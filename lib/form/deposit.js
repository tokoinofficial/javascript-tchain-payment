import { ethers } from 'ethers';
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
        this._transactionFee = ethers.BigNumber.from('0');
        this._totalAmount = ethers.BigNumber.from('0');
        this._isUseToko = false;
        this._tokoAmountForDiscount = ethers.BigNumber.from('0');
        this._serviceFee = {};
        this._feeDiscounts = {};
        this._error = '';
        this._balanceError = '';
        this._onDepsoited = params.callback;
        this._rates = Rates;
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
        const depositFeePercent = depositFee.toNumber() / 10000;

        for (const token of Object.keys(window._tpayment.configs.AssetByTokenName)) {
            const bigAmount = this.amountToBig(token);
            const discount = await window._tpayment.tchain_contract.getDiscountFee(
                window._tpayment.configs.AssetByTokenName[token],
                bigAmount,
            );
            const discounFeePercent = discount.discountFee.toNumber() / 10000;
            this._feeDiscounts[token] = {
                percent: discounFeePercent,
                deductAmount: discount.deductAmount,
            };

            const rate = this.calcExchangeRate(token, this._currency, this._rates);
            if (rate === 0) continue;

            const fee = parseFloat((this._amount / rate) * depositFeePercent).toFixed(18);
            const feeBig = ethers.utils.parseUnits(fee.toString());
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

        return ethers.BigNumber.from('0');
    }

    getPercentFeeDiscount(token) {
        if (this._serviceFee[token] === undefined || this._serviceFee[token] === null) return 0;
        if (this._feeDiscounts[token] === undefined || this._feeDiscounts[token] === null) return 0;
        return (this._feeDiscounts[token].percent / this._serviceFee[token].percent) * 100;
    }

    amountToBig(token) {
        const rate = this.calcExchangeRate(token, this._currency, this._rates) || 0;
        if (rate === 0) {
            return ethers.BigNumber.from('0');
        }
        return ethers.utils.parseEther(
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
        } catch (err) {
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
        const fee = this._serviceFee[this._tokenName].totalFee;
        const depositData = [
            this._tokenAddress,
            this._isUseToko,
            tnx.signed_hash,
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tnx.merchant_id)),
            tnx.offchain,
            tnx.token_amount_big,
            fee,
            tnx.expired_time,
        ];

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);

        console.log('deposit data', depositData);

        const res = await smcWithSigner.deposit(depositData, { gasLimit: window._tpayment.configs.GasLimit });
        this.close();
        if (typeof this._onDepsoited === 'function') {
            this._onDepsoited(res);
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
        const amount = bigAmount.add(fee);
        if (balances[this._tokenName] !== undefined) {
            if (balances[this._tokenName].amount.lt(amount)) {
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

    async onPayWithTOKO(event) {
        this._isUseToko = event.target.checked;
        this.show();
    }

    hasClass(e, cls) {
        return ` ${e.className} `.replace(/[\n\t]/g, ' ').indexOf(` ${cls} `) > -1;
    }

    async tokenApprove(tokenAddress, contractAddress) {
        const smc = new ethers.Contract(
            tokenAddress,
            window._tpayment.configs.Bep20ContractABI,
            window._tpayment.provider,
        );
        if (smc === null) {
            return null;
        }

        const signer = await window._tpayment.provider.getSigner();
        return await smc
            .connect(signer)
            .approve(contractAddress, ethers.constants.MaxUint256, { gasLimit: window._tpayment.configs.GasLimit });
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

        const allowance = await smc.allowance(window._tpayment.walletAddress, contractAddress);
        return allowance.gte(amount);
    }

    calcExchangeRate(currency1, currency2, rates = {}) {
        if (rates[currency1] === undefined || rates[currency1] === null) return 0;
        if (rates[currency2] === undefined || rates[currency2] === null) return 0;
        if (rates[currency2] <= 0) return 0;
        const currencyRate = parseFloat(rates[currency1] / rates[currency2]);
        return currencyRate;
    }

    async getTransactionFee() {
        const gasPrice = await window._tpayment.provider.getGasPrice();
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
            const allowance = await this.hasEnoughAllowance(
                this._tokenAddress,
                bigAmount.add(fee),
                window._tpayment.configs.TokenRegistryAddress,
            );
            if (!allowance) {
                console.log(`Not enough allowance for ${this._tokenName}, request allowance approval`);
                await this.tokenApprove(this._tokenAddress, window._tpayment.configs.TokenRegistryAddress);
            }

            if (this._isUseToko) {
                const tokoAllowance = await this.hasEnoughAllowance(
                    window._tpayment.configs.AssetByTokenName.TOKO,
                    this._tokoAmountForDiscount,
                    window._tpayment.configs.TchainContractAddress,
                );
                if (!tokoAllowance) {
                    console.log('Not enough allowance for TOKO, request allowance approval');
                    await this.tokenApprove(
                        window._tpayment.configs.AssetByTokenName.TOKO,
                        window._tpayment.configs.TchainContractAddress,
                    );
                }
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
        }

        const err = this._error || this._balanceError;
        const rateTOKOWithCurrency = this.calcExchangeRate('TOKO', this._currency, this._rates);
        const rateUSDTWithCurrency = this.calcExchangeRate('USDT', this._currency, this._rates);
        const rateBUSDWithCurrency = this.calcExchangeRate('BUSD', this._currency, this._rates);
        const { balances } = window._tpayment;

        $e.innerHTML = depositTemplate({
            currency: this._currency,
            notes: this._notes,
            tokenName: this._tokenName,
            depositAmount: this._amount,
            transactionFee: ethers.utils.formatEther(this._transactionFee),
            isUseToko: this._isUseToko,
            tokoAmountForDiscount: ethers.utils.formatEther(this._tokoAmountForDiscount),
            discountPercent: this.getPercentFeeDiscount(this._tokenName),
            error: err,
            rates: this._rates,
            usdt: {
                rate: rateUSDTWithCurrency,
                amountTransfer: this._amount / rateUSDTWithCurrency,
                fee: ethers.utils.formatEther(this.getDepositFee('USDT')),
                balance: balances.USDT || {},
            },
            busd: {
                rate: rateBUSDWithCurrency,
                amountTransfer: this._amount / rateBUSDWithCurrency,
                fee: ethers.utils.formatEther(this.getDepositFee('BUSD')),
                balance: balances.BUSD || {},
            },
            toko: {
                rate: rateTOKOWithCurrency,
                amountTransfer: this._amount / rateTOKOWithCurrency,
                fee: ethers.utils.formatEther(this.getDepositFee('TOKO')),
                balance: balances.TOKO || {},
            },
        });

        document.body.append($e);
        this.timer(300, document.getElementById('_tchain.payment.timers', this.show));
        document
            .getElementById('_tchain.deposit.cbx.pay.with.toko')
            .addEventListener('change', (e) => this.onPayWithTOKO(e));

        document.getElementsByName('_radioTchainPaymentToken').forEach((option) => {
            option.addEventListener('change', (e) => this.onChangeToken(e));
        });
        if (err === '') {
            document.getElementById('_tchain.deposit.btn.submit').addEventListener('click', () => this.onDeposit());
        }
        document.getElementById('_tchain.deposit.btn.close').addEventListener('click', this.close);
    }
}
