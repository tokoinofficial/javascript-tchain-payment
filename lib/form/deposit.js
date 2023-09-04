import Configs from '../config';
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
        this._tokenSelected = !!configs.Assets[params.token] ? params.token : configs.DefaultToken;
        this._amount = params.amount;
        this._transactionFee = ethers.BigNumber.from('0');
        this._totalAmount = ethers.BigNumber.from('0');
        this._serviceFee = {};
        this._feeDiscounts = {};
        this._error = '';
        this._balanceError = '';
        this._rates = params.rates || Rates;
        this._isUseDiscountToken = false;
        this._discountToken = "";
        this._depositQrCode = params.depositQrCode;
        this._isShowQRCode = false;
        this._getRates = params.funcGetRates || async function(){};
        this._onDepsoited = params.callback;
        this._onReceipted = params.receiptCallback;
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
        try {
            const depositFee = await window._tpayment.tchain_contract.depositFee();
            const depositFeePercent = depositFee.toNumber() / 10000;
            const tokenPayFees = window._tpayment.configs.AssetPayFees || [];
            const tokens = window._tpayment.configs.Assets;
            for (const token of Object.keys(tokens)) {
                const rate = this.calcExchangeRate(token, this._currency, this._rates);
                if (rate === 0) continue;
                for(let i = 0; i < tokenPayFees.length; i++) {
                    const discountAsset = tokenPayFees[i];
                    const discount = await window._tpayment.tchain_contract.getDiscountFee(
                        tokens[token].Address,
                        tokens[discountAsset].Address,
                    );

                    const discounFeePercent = discount[0].toNumber() / 10000;
                    this._feeDiscounts[token] = {
                        ...this._feeDiscounts[token],
                        [discountAsset]: {
                            percent: discounFeePercent,
                            deductAmount: discount[1],
                            deductUnitAmount: ethers.utils.formatUnits(discount[1], 18)
                        },
                    };
                };

                const fee = parseFloat((this._amount / rate) * depositFeePercent).toFixed(18);
                const feeBig = ethers.utils.parseUnits(fee.toString());
                this._serviceFee[token] = {
                    fee: feeBig,
                    totalFee: feeBig,
                    percent: depositFeePercent,
                    feeDiscount: 0,
                };

                if (this._isUseDiscountToken && this._discountToken !== "" && this._feeDiscounts[token]) {
                    const discountInfo = this._feeDiscounts[token][this._discountToken];
                    const feeDiscount = parseFloat((this._amount / rate) * discountInfo.percent).toFixed(18);
                    const feeDiscountBig = ethers.utils.parseUnits(feeDiscount.toString());
                    this._serviceFee[token].feeDiscount = feeDiscount;
                    this._serviceFee[token].totalFee = feeBig.sub(feeDiscountBig);
                }
            }
        } catch (err) {
            console.log('getFeeAllToken', err);
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
        if (!this._isUseDiscountToken || this._discountToken === "") return 0;
        const discountPercent = this._feeDiscounts[token][this._discountToken].percent;
        const depositFeePercent = this._serviceFee[token].percent;
        return (discountPercent / depositFeePercent) * 100;
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
                token_name: this._tokenSelected,
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

        await this.approveAllowance();

        const tnx = await this.createTransaction();
        const fee = this._serviceFee[this._tokenSelected].totalFee;
        const depositAssetInfo = Configs.Assets[this._tokenSelected];
        const discountTokenInfo = Configs.Assets[this._discountToken] || depositAssetInfo;
        const depositData = [
            depositAssetInfo.Address,
            discountTokenInfo.Address,
            tnx.signed_hash,
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tnx.merchant_id)),
            tnx.offchain,
            tnx.token_amount_big,
            fee,
            tnx.expired_time,
        ];

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);

        const res = await smcWithSigner.deposit(depositData, { gasLimit: window._tpayment.configs.GasLimit });

        this.close();
        
        if (typeof this._onDepsoited === 'function') {
            this._onDepsoited(res);
        }

        if (typeof this._onReceipted === "function") {
            this._onReceipted(await res.wait());
        }

    }

    checkBalance() {
        if (this._tokenSelected === '') {
            return;
        }

        this._balanceError = '';
        const { balances } = window._tpayment;
        const fee = this.getDepositFee(this._tokenSelected);

        const bigAmount = this.amountToBig(this._tokenSelected);
        const amount = bigAmount.add(fee);
        if (balances[this._tokenSelected] !== undefined) {
            if (balances[this._tokenSelected].amount.lt(amount)) {
                this._balanceError = `Your balance is not enough ${this._tokenSelected} to make the payment`;
            }
        } else {
            this._balanceError = 'Token invalid';
        }

        if (!this._isUseDiscountToken) return "";
        if (balances[this._discountToken] !== undefined) {
            const feeDiscount = this._feeDiscounts[this._tokenSelected][this._discountToken];
            if (balances[this._discountToken].amount.lt(feeDiscount.deductAmount)) { 
                this._balanceError = `Your balance is not enough $${this._discountToken} to make the payment`;
            }
        }

        return "";
    }

    validateBalance(token) {
        const { balances } = window._tpayment;
        const fee = this.getDepositFee(token);
        const bigAmount = this.amountToBig(token);
        const amount = bigAmount.add(fee);
        return balances[token].amount.lt(amount);
    }

    async onChangeToken(event) {
        try {
            this._tokenSelected = event.target.value;
            const tokenPayFees = window._tpayment.configs.AssetPayFees || [];
            if (tokenPayFees.includes(this._tokenSelected)) {
                this._isUseDiscountToken = true;
                this._discountToken = this._tokenSelected;
            }
        } catch (e) {
            this._error = e;
        }

        await this.show();
    }

    async onChangeDiscountToken(event) {
        this._isUseDiscountToken = event.target.checked;
        this._discountToken = this._isUseDiscountToken ? event.target.value : "";
        this.show();
    }

    async onClickDiscountToken(event) {
        if (event.target.checked && this._isUseDiscountToken && this._discountToken === event.target.value) {
            event.target.checked = false;
        }
        this.onChangeDiscountToken(event);
    }

    setIsShowQRCode(isShowQR = false) {
        this._isShowQRCode = isShowQR;
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
                `Not enough allowance for ${this._tokenSelected}, request allowance approval`,
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

        const allowance = await smc.allowance(window._tpayment.walletAddress, contractAddress);
        console.log(`Allowance for ${this._tokenSelected}: ${allowance}`);
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
        if (this._error === '' &&  Configs.Assets[this._tokenSelected]) {
            console.debug(`Checking allowance for ${this._tokenSelected}...`);
            const fee = this.getDepositFee(this._tokenSelected);
            const bigAmount = this.amountToBig(this._tokenSelected);

            // Approve for token
            await this.tokenApprove(Configs.Assets[this._tokenSelected].Address, bigAmount.add(fee));

            if (this._isUseDiscountToken && this._discountToken !== "") {
                // Approve for token pay fee
                const feeDiscount = this._feeDiscounts[this._tokenSelected][this._discountToken];
                await this.tokenApprove(Configs.Assets[this._discountToken].Address, feeDiscount.deductAmount);
            }
        }
    }

    async onRefreshRates() {
        await this._getRates();
        this.show();
    }

    async show() {
        this.validateCurrency(this._currency);
        await Promise.all([this.getFeeAllToken(), this.getTransactionFee()]);
        this.checkBalance();

        let $e = document.getElementById(_NAME);
        if ($e === undefined || $e === null) {
            $e = document.createElement('div');
            $e.id = _NAME;
        }

        const err = this._error || this._balanceError;
        const rateTOKOWithCurrency = this.calcExchangeRate('TOKO', this._currency, this._rates);
        const rateUSDTWithCurrency = this.calcExchangeRate('USDT', this._currency, this._rates);
        const rateJOYWithCurrency = this.calcExchangeRate('JOY', this._currency, this._rates);
        const { balances } = window._tpayment;

        const params = {
            currency: this._currency,
            notes: this._notes,
            tokenSelected: this._tokenSelected,
            depositAmount: this._amount,
            transactionFee: ethers.utils.formatEther(this._transactionFee),
            isUseDiscountToken: this._isUseDiscountToken,
            discountToken: this._discountToken,
            discountPercent: this.getPercentFeeDiscount(this._tokenSelected),
            error: err,
            rates: this._rates,
            depositQrCode: this._depositQrCode,
            isShowQRCode: this._isShowQRCode,
            Assets:{
                USDT: {
                    ...Configs.Assets.USDT,
                    rate: rateUSDTWithCurrency,
                    amountTransfer: this._amount / rateUSDTWithCurrency,
                    fee: ethers.utils.formatEther(this.getDepositFee('USDT')),
                    balance: balances.USDT || {},
                    isWarning: this.validateBalance('USDT'),
                    discountFees: this._feeDiscounts["USDT"] || {},
                },
                TOKO: {
                    ...Configs.Assets.TOKO,
                    rate: rateTOKOWithCurrency,
                    amountTransfer: this._amount / rateTOKOWithCurrency,
                    fee: ethers.utils.formatEther(this.getDepositFee('TOKO')),
                    balance: balances.TOKO || {},
                    isWarning: this.validateBalance('TOKO'),
                    discountFees: this._feeDiscounts["TOKO"] || {},
                },
                JOY: {
                    ...Configs.Assets.JOY,
                    rate: rateJOYWithCurrency,
                    amountTransfer: this._amount / rateJOYWithCurrency,
                    fee: ethers.utils.formatEther(this.getDepositFee('JOY')),
                    balance: balances.JOY || {},
                    isWarning: this.validateBalance('JOY'),
                    discountFees: this._feeDiscounts["JOY"] || {},
                },
            }
        };

        $e.innerHTML = depositTemplate(params);

        document.body.append($e);
        if (document.getElementById('_tchain.payment.timers')) {
            this.timer(300, document.getElementById('_tchain.payment.timers'), () => this.onRefreshRates());
        }

        const eTChainAssetPayFees = document.getElementsByClassName("_tchain.token.pay.fee");
        if (eTChainAssetPayFees) {
            for(let i = 0; i < eTChainAssetPayFees.length; i++) {
                eTChainAssetPayFees[i].addEventListener('click', (e) => this.onClickDiscountToken(e))
            }
        }
        
        if (document.getElementById('t.chain.nav.scan.qr')) {
            document.getElementById('t.chain.nav.scan.qr').addEventListener('click', (e) => this.setIsShowQRCode(true));
        }
            
        if (document.getElementById('t.chain.nav.prev')) {
            document.getElementById('t.chain.nav.prev').addEventListener('click', (e) => this.setIsShowQRCode(false));
        }

        if (document.getElementsByName('_radioTchainPaymentToken')) {
            document.getElementsByName('_radioTchainPaymentToken').forEach((option) => {
                option.addEventListener('change', (e) => this.onChangeToken(e));
            });
        }

        if (err === '' && document.getElementById('_tchain.deposit.btn.submit')) {
            document.getElementById('_tchain.deposit.btn.submit').addEventListener('click', () => this.onDeposit());
        }

        if (document.getElementById('_tchain.deposit.btn.close')) {
            document.getElementById('_tchain.deposit.btn.close').addEventListener('click', this.close);
        }
    }
}
