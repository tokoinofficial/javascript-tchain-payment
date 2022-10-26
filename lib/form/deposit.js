'use strict';
import {Rates} from '../serializers';

import { ethers } from "ethers";
import Configs from "../config";
import { depositTemplate } from "./_template";

const _NAME = "__TCHAIN.DEPOSIT.FORM__"
export default class DepositForm {
    constructor(params={}) {
        this._currency = params.currency;
        this._orderId = params.orderId;
        this._chainId = params.chainId;
        this._tokenAddress = Configs.AssetByTokenName[Configs.TokenDefault];
        this._tokenName = Configs.TokenDefault;
        this._amount = params.amount;
        this._transactionFee = ethers.BigNumber.from("0");
        this._totalAmount =  ethers.BigNumber.from("0");
        this._isUseToko = true;
        this._tokoAmountForDiscount =  ethers.BigNumber.from("0"); // remove
        this._serviceFee = {};
        this._feeDiscounts = {};
        this._notes = "";
        this._error = "";
        this._onDepsoited = params.callback;
        this._rates = Rates;
        this.getRates();
    }

    timer(duration, display, callback) {
        let timer = duration, minutes = 0, seconds = 0;
        var t = setInterval(function() {
            minutes = parseInt(timer/60, 10);
            seconds = parseInt(timer%60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.innerText = minutes + ":" + seconds;
            if(--timer < 0) {
                clearInterval(t);
                if (typeof callback === "function") {
                    callback();
                }
            }
        }, 1000);
    }

    async getFees() {
        const depositFee = await window._tpayment.tchain_contract.depositFee();
        const depositFeePercent = depositFee.toNumber() / 10000;

        for (const token of Object.keys(Configs.AssetByTokenName)) {
            const bigAmount = this.amountToBig(token);
            const discount = await window._tpayment.tchain_contract.getDiscountFee(Configs.AssetByTokenName[token], bigAmount);
            const discounFeePercent = discount.discountFee.toNumber() / 10000;
            this._feeDiscounts[token] = {
                percent: discounFeePercent,
                deductAmount: discount.deductAmount
            }

            const rate = this.calcExchangeRate(token, this._currency, this._rates);
            const fee = parseFloat((this._amount / rate)* depositFeePercent).toFixed(18);
            const feeBig = ethers.utils.parseUnits(fee.toString());
            this._serviceFee[token] = {
                fee: feeBig,
                totalFee: feeBig,
                percent: depositFeePercent,
            }

            if (this._isUseToko) {
                const feeDiscount = parseFloat((this._amount / rate)* discounFeePercent).toFixed(18);
                const feeDiscountBig = ethers.utils.parseUnits(feeDiscount.toString())
                this._serviceFee[token]["feeDiscount"] = feeDiscount;
                this._serviceFee[token]["totalFee"] = feeBig.sub(feeDiscountBig);
            }
        }
        this._tokoAmountForDiscount = this._feeDiscounts[this._tokenName]["deductAmount"]
    }

    async getRates() {
        fetch(`${Configs.TChainAPIURL}/t-chain/exchange-rate`)
        .then((response) => response.json())
        .then((data) => {
            if (data.result) {
                this._rates = {...Rates, ...data.result.data};
            }
        });
    }

    amountToBig(token) {
        const rate = this.calcExchangeRate(token, this._currency, this._rates) || 0;
        return ethers.utils.parseEther((parseFloat(this._amount / rate).toFixed(18)).toString());
    }
    
    async createTransaction() {
        const body = JSON.stringify({
            "wallet_address": window._tpayment.walletAddress,
            "amount": parseFloat(this._amount),
            "currency": this._currency,
            "notes": this._notes,
            "token_name": this._tokenName,
            "external_id": this._orderId,
            "chain_id": this._chainId
        });

        var headers = new Headers();
        headers.append("x-api-key", window._tpayment.apiKey);
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
        }

        const res = await fetch(`${Configs.TChainAPIURL}/t-chain-sdk/create-transaction`, requestOptions);
        const data = await res.json();
        return data.result ? data.result.data : {};
    }

    close(){
        document.getElementById(_NAME).remove();;
    }

    async onDeposit() {
        if (this._error !== "") {
            return;
        }

        const tnx = await this.createTransaction();
        const fee = this._serviceFee[this._tokenName]["totalFee"];
        console.log(this._serviceFee);
        const depositData = [
            this._tokenAddress,
            this._isUseToko,
            tnx.signed_hash,
            tnx.offchain,
            tnx.token_amount_big,
            fee,
            tnx.expired_time
        ];

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);

        
        const res = await smcWithSigner.deposit(depositData,{gasLimit: Configs.GasLimit});
        this.close();
        if (typeof this._onDepsoited === "function") {
            this._onDepsoited(res);
        }
    }

    checkBalance() {
        this._error = "";
        const balances = window._tpayment.balances;
        const fee = this._serviceFee[this._tokenName]["totalFee"];
        
        const bigAmount = this.amountToBig(this._tokenName);
        const amount = bigAmount.add(fee)
        if (balances[this._tokenName] !== undefined) {
            if (balances[this._tokenName].amount.lt(amount)) {
                this._error = `Your balance is not enough ${this._tokenName} to make the payment`;
            }
        } else {
            this._error = `Token invalid`;
        }
        
        if (!this._isUseToko) return "";
        if (balances[Configs.AssetByTokenName.TOKO] !== undefined) {
            if (balances[Configs.AssetByTokenName.TOKO].amount.lt(this._tokoAmountForDiscount)) {
                this._error = `Your balance is not enough $TOKO to make the payment`;
            }
        }

        return "";
    }

    async onChangeToken(event){
        try {
            this._tokenName = event.target.value;
            this._tokenAddress = Configs.AssetByTokenName[this._tokenName];
            this._tokoAmountForDiscount = this._feeDiscounts[this._tokenName]["deductAmount"]
        } catch (e) {
            this._error = e;
        }
        
        await this.show();
    }
    
    onPayWithTOKO(event){
        this._isUseToko = event.target.checked;

        const fee = this._serviceFee[this._tokenName]["fee"];
        if (this._isUseToko) {
            const rate = this.calcExchangeRate(this._tokenName, this._currency, this._rates);
            const discounFeePercent = this._feeDiscounts[this._tokenName]["percent"];
            const feeDiscount = parseFloat((this._amount / rate)* discounFeePercent).toFixed(18);
            const feeDiscountBig = ethers.utils.parseUnits(feeDiscount.toString());
            this._serviceFee[this._tokenName]["feeDiscount"] = feeDiscount;
            this._serviceFee[this._tokenName]["totalFee"] = fee.sub(feeDiscountBig);
        } else {
            this._serviceFee[this._tokenName]["feeDiscount"] = ethers.BigNumber.from("0");
            this._serviceFee[this._tokenName]["totalFee"] = fee;
        }
        
        this.show();
    }

    hasClass(e, cls) {
        return (` ${e.className} `).replace(/[\n\t]/g, " ").indexOf(` ${cls} `) > -1
    }

    async tokenApprove(tokenAddress, contractAddress) {
        const smc = new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider)
        if (smc === null) {
            return null
        }
    
        const signer = await window._tpayment.provider.getSigner();
        return await smc.connect(signer).approve(contractAddress, ethers.constants.MaxUint256, {gasLimit: Configs.GasLimit});
    }
    
    async hasEnoughAllowance(tokenAddress, amount, contractAddress) {
        const smc = new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider)
        if (smc === null) {
            return false
        }
    
        const allowance = await smc.allowance(window._tpayment.walletAddress, contractAddress);
        return allowance.gte(amount);
    }

    calcExchangeRate(currency1, currency2, rates={}) {
        if (rates[currency1] === undefined || rates[currency1] === null) return 0;
        if (rates[currency2] === undefined || rates[currency2] === null) return 0;
        if (rates[currency2] <= 0) return 0;
        const currencyRate = parseFloat(rates[currency1]/ rates[currency2]);
        return currencyRate.toFixed(2)
    }
    
    async getTransactionFee(){
        const gasPrice = await window._tpayment.provider.getGasPrice();
        /*
        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer)
        const depositFee = this._serviceFee.sub(this._serviceFeeDiscount);
        const depositData = [
            this._tokenAddress,
            this._isUseToko,
            tnx.signed_hash,
            tnx.offchain,
            tnx.token_amount_big,
            depositFee,
            tnx.expired_time
        ];
        const gasUnits = await smcWithSigner.estimateGas.deposit(depositData, {gasLimit: Configs.GasLimit});
        */
        this._transactionFee = gasPrice;
    }

    async show() {
        if (Object.keys(this._serviceFee).length === 0 || Object.keys(this._feeDiscounts).length === 0) {
            await this.getFees();
        }
        
        this.checkBalance();
        const fee = this._serviceFee[this._tokenName]["totalFee"];
        const bigAmount = this.amountToBig(this._tokenName);

        if (this._error === "") {
            const allowance = await this.hasEnoughAllowance(this._tokenAddress, bigAmount.add(fee), Configs.TokenRegistryAddress);
            if (!allowance){
                await this.tokenApprove(this._tokenAddress, Configs.TokenRegistryAddress)
            }

            if (this._isUseToko) {
                const tokoAllowance = await this.hasEnoughAllowance(Configs.AssetByTokenName.TOKO, this._tokoAmountForDiscount, Configs.TchainContractAddress);
                if (!tokoAllowance){
                    await this.tokenApprove(Configs.AssetByTokenName.TOKO, Configs.TchainContractAddress)
                }
            }

            await this.getTransactionFee();
        }
        
        let $e = document.getElementById(_NAME);
        if ($e === undefined || $e === null) {
            $e = document.createElement("div");
            $e.id = _NAME;
        }

        const rateTOKOWithCurrency = this.calcExchangeRate("TOKO", this._currency, this._rates);
        const rateUSDTWithCurrency = this.calcExchangeRate("USDT", this._currency, this._rates);
        const rateBUSDWithCurrency = this.calcExchangeRate("BUSD", this._currency, this._rates);
        const balances = window._tpayment.balances;
        $e.innerHTML = depositTemplate({
            currency: this._currency,
            tokenName: this._tokenName,
            depositAmount: this._amount,
            transactionFee: ethers.utils.formatEther(this._transactionFee),
            isUseToko: this._isUseToko,
            tokoAmountForDiscount: ethers.utils.formatEther(this._tokoAmountForDiscount),
            discountPercent: (this._discountPercent / this._depositFeePercent) * 100,
            error: this._error,
            rates: this._rates,
            usdt: {
                rate: rateUSDTWithCurrency,
                amountTransfer: this._amount / rateUSDTWithCurrency,
                fee: ethers.utils.formatEther(this._serviceFee["USDT"]["totalFee"]),
                balance : balances["USDT"] || {},
            },
            busd: {
                rate: rateBUSDWithCurrency,
                amountTransfer: this._amount / rateBUSDWithCurrency,
                fee: ethers.utils.formatEther(this._serviceFee["BUSD"]["totalFee"]),
                balance : balances["BUSD"] || {},
            },
            toko: {
                rate: rateTOKOWithCurrency,
                amountTransfer: this._amount / rateTOKOWithCurrency,
                fee: ethers.utils.formatEther(this._serviceFee["TOKO"]["totalFee"]),
                balance : balances["TOKO"] || {},
            },
        });

        document.body.append($e);
        this.timer(300, document.getElementById("_tchain.payment.timers", this.show));
        document.getElementById("_tchain.deposit.cbx.pay.with.toko").addEventListener('change', (e) => this.onPayWithTOKO(e));
        
        document.getElementsByName("_radioTchainPaymentToken").forEach(option => {
            option.addEventListener('change', (e) => this.onChangeToken(e));
        })
        if (this._error === "") {
            document.getElementById("_tchain.deposit.btn.submit").addEventListener('click', () => this.onDeposit());    
        }
        document.getElementById("_tchain.deposit.btn.close").addEventListener('click', this.close);
    }
}
