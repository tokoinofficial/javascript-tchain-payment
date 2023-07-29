import { Rates } from '../serializers';

import { depositTemplate } from './_template';

const _NAME = '__TCHAIN.DEPOSIT.FORM__';
export default class DepositForm {
    constructor(params = {}) {
        const { configs } = window._tpayment;
        this._currency = configs.CurrencySupport.includes(params.currency) ? params.currency : configs.DefaultCurrency;
        this._notes = params.notes;
        this._chainId = configs.ChainId;
        this._tokenName = Object.keys(configs.AssetByTokenName).includes(params.token)
            ? params.token
            : configs.DefaultToken;
        this._tokenAddress = configs.AssetByTokenName[this._tokenName];
        this._amount = params.amount;
        this._transactionFee = 0n;
        this._totalAmount = 0n;
        this._isUseToko = false;
        this._tokoAmountForDiscount = 0n;
        this._serviceFee = {};
        this._feeDiscounts = {};
        this._error = '';
        this._balanceError = '';
        this._onDeposited = params.callback;
        this._rates = Rates;
        this.shadowDom = null;
    }

    timer(duration, display, callback) {
        let timer = duration;
        let minutes = 0;
        let seconds = 0;
        const t = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            display.innerText = `${minutes}:${seconds}`;
            if (--timer < 0) {
                clearInterval(t);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }, 1000);
    }

    async getFeeAllToken() {
        const depositFee = await window._tpayment.tchain_contract.depositFee();
        const depositFeePercent = Number(depositFee) / 10000;

        for (const token of Object.keys(window._tpayment.configs.AssetByTokenName)) {
            const bigAmount = this.amountToBig(token);
            const discount = await window._tpayment.tchain_contract.getDiscountFee(
                window._tpayment.configs.AssetByTokenName[token],
                bigAmount,
            );
            const discounFeePercent = Number(discount.discountFee) / 10000;
            this._feeDiscounts[token] = {
                percent: discounFeePercent,
                deductAmount: discount.deductAmount,
            };

            const rate = this.calcExchangeRate(token, this._currency, this._rates);
            if (rate === 0) continue;

            const fee = parseFloat((this._amount / rate) * depositFeePercent).toFixed(18);
            const feeBig = ethers.parseUnits(fee.toString());
            this._serviceFee[token] = {
                fee: feeBig,
                totalFee: feeBig,
                percent: depositFeePercent,
            };

            if (this._isUseToko) {
                const feeDiscount = parseFloat((this._amount / rate) * discounFeePercent).toFixed(18);
                const feeDiscountBig = ethers.utils.parseUnits(feeDiscount.toString());
                this._serviceFee[token].feeDiscount = feeDiscount;
                this._serviceFee[token].totalFee = feeBig.sub(feeDiscountBig);
            }
        }
        this._tokoAmountForDiscount = this._feeDiscounts[this._tokenName].deductAmount;
    }

    async getRates() {
        try {
            const headers = new Headers();
            headers.append('x-api-key', window._tpayment.apiKey);
            headers.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'GET',
                headers,
            };

            const res = await fetch(
                `${window._tpayment.configs.TChainAPIURL}/t-chain-sdk/exchange-rate`,
                requestOptions,
            );
            const dataJSON = await res.json();
            this._rates = {
                ...Rates,
                ...dataJSON.result.data,
            };
        } catch (err) {
            this._error = 'An issue occurred during getting rates progress';
        }
    }

    getDepositFee(token) {
        if (this._serviceFee[token] !== undefined) {
            return this._serviceFee[token].totalFee;
        }

        return 0n;
    }

    getPercentFeeDiscount(token) {
        if (this._serviceFee[token] === undefined || this._serviceFee[token] === null) return 0;
        if (this._feeDiscounts[token] === undefined || this._feeDiscounts[token] === null) return 0;
        return (this._feeDiscounts[token].percent / this._serviceFee[token].percent) * 100;
    }

    amountToBig(token) {
        const rate = this.calcExchangeRate(token, this._currency, this._rates) || 0;
        if (rate === 0) {
            return 0n;
        }
        return ethers.parseEther(
            parseFloat(this._amount / rate)
                .toFixed(18)
                .toString(),
        );
    }

    async createTransaction() {
        try {
            const body = JSON.stringify({
                wallet_address: window._tpayment.walletAddress,
                amount: parseFloat(this._amount),
                currency: this._currency,
                notes: this._notes,
                token_name: this._tokenName,
                chain_id: this._chainId,
            });

            const headers = new Headers();
            headers.append('x-api-key', window._tpayment.apiKey);
            headers.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'POST',
                headers,
                body,
            };

            const res = await fetch(
                `${window._tpayment.configs.TChainAPIURL}/t-chain-sdk/create-transaction`,
                requestOptions,
            );
            const data = await res.json();
            return data.result ? data.result.data : {};
        } catch (_err) {
            this._error = 'An issue occurred during creating transaction progress';
        }
        return {};
    }

    close() {
        document.getElementById(_NAME).remove();
    }

    async onDeposit() {
        if (this._error !== '') {
            return;
        }

        console.log('Allowance / Approval');
        await this.approveAllowance();

        console.log('Deposit // Start');

        const tnx = await this.createTransaction();
        const fee = this.getDepositFee(this._tokenName);
        const depositData = [
            this._tokenAddress,
            this._isUseToko,
            tnx.signed_hash,
            ethers.keccak256(ethers.toUtf8Bytes(tnx.merchant_id)),
            tnx.offchain,
            tnx.token_amount_big,
            fee,
            tnx.expired_time,
        ];

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);

        console.log('deposit data', depositData);

        const res = await smcWithSigner.deposit(depositData, {
            gasLimit: window._tpayment.configs.GasLimit,
        });
        this.close();
        if (typeof this._onDeposited === 'function') {
            this._onDeposited(res);
        }
    }

    checkBalance() {
        if (this._tokenName === '') {
            return;
        }

        this._balanceError = '';
        const { balances } = window._tpayment;
        const fee = this.getDepositFee(this._tokenName);

        const bigAmount = this.amountToBig(this._tokenName);
        const amount = bigAmount + fee;
        if (balances[this._tokenName] !== undefined) {
            if (balances[this._tokenName].amount < amount) {
                this._balanceError = `Your balance is not enough ${this._tokenName} to make the payment`;
            }
        } else {
            this._balanceError = 'Token invalid';
        }

        if (!this._isUseToko) return '';
        if (balances[window._tpayment.configs.AssetByTokenName.TOKO] !== undefined) {
            if (balances[window._tpayment.configs.AssetByTokenName.TOKO].amount.lt(this._tokoAmountForDiscount)) {
                this._balanceError = 'Your balance is not enough $TOKO to make the payment';
            }
        }

        return '';
    }

    async onChangeToken(event) {
        try {
            this._tokenName = event.target.value;
            if (this._tokenName === 'TOKO') {
                this._isUseToko = true;
            }
            this._tokenAddress = window._tpayment.configs.AssetByTokenName[this._tokenName];
            this._tokoAmountForDiscount = this._feeDiscounts[this._tokenName].deductAmount;
        } catch (e) {
            this._error = e;
        }

        await this.show();
    }

    onPayWithTOKO(event) {
        this._isUseToko = event.target.checked;
        this.show();
    }

    hasClass(e, cls) {
        return ` ${e.className} `.replace(/[\n\t]/g, ' ').indexOf(` ${cls} `) > -1;
    }

    async tokenApprove(tokenAddress, amount) {
        const allowance = await this.hasEnoughAllowance(
            tokenAddress,
            amount,
            window._tpayment.configs.TokenRegistryAddress,
        );

        if (!allowance) {
            console.debug(
                `Not enough allowance for ${window._tpayment.configs.AssetByAddress[tokenAddress]}, request allowance approval`,
            );

            const smc = new ethers.Contract(
                tokenAddress,
                window._tpayment.configs.Bep20ContractABI,
                window._tpayment.provider,
            );
            if (smc === null) {
                console.error('Cannot instantiate SmartContract:', {
                    tokenAddress,
                    abi: window._tpayment.configs.Bep20ContractABI,
                    provider: window._tpayment.provider,
                });
                return null;
            }

            const signer = await window._tpayment.provider.getSigner();
            const receipt = await smc
                .connect(signer)
                .approve(window._tpayment.configs.TokenRegistryAddress, ethers.constants.MaxUint256, {
                    gasLimit: window._tpayment.configs.GasLimit,
                });
            console.log('Allowance approval receipt:', receipt);
            return receipt;
        }
        return null;
    }

    async hasEnoughAllowance(tokenAddress, amount, contractAddress) {
        const smc = new ethers.Contract(
            tokenAddress,
            window._tpayment.configs.Bep20ContractABI,
            window._tpayment.provider,
        );
        if (smc === null) {
            return false;
        }

        const allowance = await smc.allowance(
            ethers.Typed.address(window._tpayment.walletAddress),
            ethers.Typed.address(contractAddress),
        );
        console.log(`Allowance for ${window._tpayment.configs.AssetByAddress[tokenAddress]}: ${allowance}`);
        return allowance >= amount;
    }

    calcExchangeRate(currency1, currency2, rates = {}) {
        if (rates[currency1] === undefined || rates[currency1] === null) {
            return 0;
        }
        if (rates[currency2] === undefined || rates[currency2] === null) {
            return 0;
        }
        if (rates[currency2] <= 0) return 0;
        const currencyRate = parseFloat(rates[currency1] / rates[currency2]);
        return currencyRate;
    }

    async getTransactionFee() {
        const gasPrice = (await window._tpayment.provider.getFeeData()).gasPrice;
        this._transactionFee = gasPrice;
    }

    validateCurrency(currency) {
        if (!window._tpayment.configs.CurrencySupport.includes(currency)) {
            this._error = `${currency} is not supported at this time`;
        }
    }

    async approveAllowance() {
        if (this._error === '') {
            console.debug(`Checking allowance for ${this._tokenName}...`);
            const fee = this.getDepositFee(this._tokenName);
            const bigAmount = this.amountToBig(this._tokenName);

            // Approve for token
            await this.tokenApprove(this._tokenAddress, bigAmount.add(fee));

            if (this._isUseToko) {
                // Approve for TOKO
                await this.tokenApprove(window._tpayment.configs.AssetByTokenName.TOKO, this._tokoAmountForDiscount);
            }
        }
    }

    async show() {
        this.validateCurrency(this._currency);
        await Promise.all([this.getRates(), this.getFeeAllToken(), this.getTransactionFee()]);
        this.checkBalance();

        let $e = document.getElementById(_NAME);
        if ($e === undefined || $e === null) {
            $e = document.createElement('div');
            $e.id = _NAME;
            $e.attachShadow({ mode: 'open' });
        }
        this.shadowDom = $e.shadowRoot;

        const err = this._error || this._balanceError;
        const rateTOKOWithCurrency = this.calcExchangeRate('TOKO', this._currency, this._rates);
        const rateUSDTWithCurrency = this.calcExchangeRate('USDT', this._currency, this._rates);
        const rateBUSDWithCurrency = this.calcExchangeRate('BUSD', this._currency, this._rates);
        const { balances } = window._tpayment;

        this.shadowDom.innerHTML = depositTemplate({
            currency: this._currency,
            notes: this._notes,
            tokenName: this._tokenName,
            depositAmount: this._amount,
            transactionFee: ethers.formatEther(this._transactionFee),
            isUseToko: this._isUseToko,
            tokoAmountForDiscount: ethers.formatEther(this._tokoAmountForDiscount),
            discountPercent: this.getPercentFeeDiscount(this._tokenName),
            error: err,
            rates: this._rates,
            usdt: {
                rate: rateUSDTWithCurrency,
                amountTransfer: this._amount / rateUSDTWithCurrency,
                fee: ethers.formatEther(this.getDepositFee('USDT')),
                balance: balances['USDT'] || {},
            },
            busd: {
                rate: rateBUSDWithCurrency,
                amountTransfer: this._amount / rateBUSDWithCurrency,
                fee: ethers.formatEther(this.getDepositFee('BUSD')),
                balance: balances['BUSD'] || {},
            },
            toko: {
                rate: rateTOKOWithCurrency,
                amountTransfer: this._amount / rateTOKOWithCurrency,
                fee: ethers.formatEther(this.getDepositFee('TOKO')),
                balance: balances['TOKO'] || {},
            },
        });

        document.body.append($e);
        this.timer(300, this.shadowDom.getElementById('_tchain.payment.timers', this.show));
        this.shadowDom
            .getElementById('_tchain.deposit.cbx.pay.with.toko')
            .addEventListener('change', (e) => this.onPayWithTOKO(e));

        this.shadowDom.querySelectorAll('input[name=_radioTchainPaymentToken]').forEach((option) => {
            option.addEventListener('change', (e) => this.onChangeToken(e));
        });
        if (err === '') {
            this.shadowDom
                .getElementById('_tchain.deposit.btn.submit')
                .addEventListener('click', () => this.onDeposit());
        }
        this.shadowDom.getElementById('_tchain.deposit.btn.close').addEventListener('click', this.close);
    }
}
