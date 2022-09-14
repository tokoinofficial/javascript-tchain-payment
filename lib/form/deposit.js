'use strict';

import { ethers } from "ethers";
import Configs from "../config";
import { depositTemplate } from "./_template";

const _NAME = "__TCHAIN.DEPOSIT.FORM__"

export default class DepositForm {
    constructor(params={}) {
        this._offchain = ethers.utils.formatBytes32String(params.offchain);
        this._tokenAddress = Configs.AssetByTokenName[Configs.TokenDefault];
        this._tokenName = Configs.TokenDefault;
        this._amount = params.amount || 0;
        this._serviceFee = 0;
        this._transactionFee = 0;
        this._totalAmount =  0;
        this._isUseToko = false;
        this._tokoAmount =  0;
        this._discountPercent =  0;
        this._serviceFeeDiscount = 0;
        this._error = "";
        this._onDepsoited = params.callback;
    }

    async onDeposit() {
        const amount = ethers.utils.parseEther(this._amount.toString());
        const fee = ethers.utils.parseEther((this._serviceFee - this._serviceFeeDiscount).toString());

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);
        const res = await smcWithSigner.deposit(this._tokenAddress, 
            window._tpayment.merchant_id,
            amount.toBigInt(),
            fee.toBigInt(), 
            this._isUseToko, 
            this._offchain,
            {gasLimit: Configs.GasLimit}
        );
        this.close();
        if (typeof this._onDepsoited === "function") {
            this._onDepsoited(res);
        }
    }

    close(){
        document.getElementById(_NAME).remove();;
    }

    async onChangeToken(event){
        this._tokenAddress = event.attributes.value.value;
        this._tokenName = Configs.AssetByAddress[this._tokenAddress];
        document.getElementById("_tchain.deposit.ddl.tokens").querySelector(".items").classList.toggle("hide");
        await this.show();
    }

    getDepositFeeDiscount(){
        if (this._isUseToko) {
            this._serviceFeeDiscount = this._amount * this._discountPercent/100;
        } else {
            this._serviceFeeDiscount = 0;
        }
    }
    
    onPayWithTOKO(event){
        this._isUseToko = event.target.checked;
        this.show();
    }

    onClickDropdownlist(event) {
        const ddl = document.getElementById("_tchain.deposit.ddl.tokens");
        const items = ddl.querySelector(".items");
        items.classList.toggle("hide");
        ddl.querySelectorAll('.dropdown .option').forEach(option => {
            option.addEventListener('click', () => this.onChangeToken(option));
        })
    }

    onChangeTab(itemActive){
        const tabs = document.getElementById("_tchain-tabs");
        tabs.querySelectorAll('.item').forEach(item => {
            item.classList.remove("active");
        })

        document.querySelectorAll("._tchain-tabs-content").forEach(item => {
            item.classList.remove("active");
        }) 

        itemActive.classList.add("active");
        document.getElementById(itemActive.attributes.for.value).classList.add("active");
    }

    hasClass(e, cls) {
        return (` ${e.className} `).replace(/[\n\t]/g, " ").indexOf(` ${cls} `) > -1
    }

    async tokenApprove(tokenAddress, contractAddress) {
        const smc = new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider)
        if (smc === null) {
            return null
        }
    
        // const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
        const signer = await window._tpayment.provider.getSigner();
        return await smc.connect(signer).approve(contractAddress, ethers.constants.MaxUint256, {gasLimit: Configs.GasLimit});
    }
    
    async hasEnoughAllowance(tokenAddress, amount, contractAddress) {
        const smc = new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider)
        if (smc === null) {
            return false
        }
    
        const allowance = await smc.allowance(window._tpayment.walletAddress, contractAddress);
        return allowance.toBigInt() >= amount;
    }
    
    async getDepositFee(){
        const depositFee = await window._tpayment.tchain_contract.depositFee();
        this._serviceFee = this._amount*(depositFee.toNumber() / 10000);
        if (this._isUseToko) {
            this._serviceFeeDiscount = this._amount * this._discountPercent/100;
        } else {
            this._serviceFeeDiscount = 0;
        }
    }
    
    async getDiscount() {
        const amountBigInt = ethers.utils.parseEther(this._amount.toString()).toBigInt();
        const discount = await window._tpayment.tchain_contract.getDiscountFee(amountBigInt);
        this._discountPercent = discount.discountFee.toNumber() / 100;
        this._tokoAmount = ethers.utils.formatUnits(discount.deductAmount.toBigInt())
    }
    
    async getTransactionFee(){
        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer)
    
        const gasPrice = await window._tpayment.provider.getGasPrice();
        const depositFee = ethers.utils.parseEther((this._serviceFee - this._serviceFeeDiscount).toString()).toBigInt();
        const amount = ethers.utils.parseEther(this._amount.toString()).toBigInt();
        const gasUnits = await smcWithSigner.estimateGas.deposit(this._tokenAddress, window._tpayment.merchant_id, amount, depositFee, this._isUseToko, this._offchain, {gasLimit: Configs.GasLimit});
        this._transactionFee = ethers.utils.formatUnits(gasPrice.mul(gasUnits))
        this._transactionFee = ethers.utils.formatUnits(gasPrice)
    }

    async show() {
        const amount = ethers.utils.parseEther(this._amount.toString());
        const fee = ethers.utils.parseEther((this._serviceFee - this._serviceFeeDiscount).toString());

        const allowance = await this.hasEnoughAllowance(this._tokenAddress, amount.add(fee).toBigInt(), Configs.TokenRegistryAddress);
        if (!allowance){
            await this.tokenApprove(this._tokenAddress, Configs.TokenRegistryAddress)
        }

        if (this._isUseToko) {
            const tokoAmount = ethers.utils.parseEther(this._tokoAmount.toString());
            const tokoAllowance = await this.hasEnoughAllowance(Configs.AssetByTokenName.TOKO, tokoAmount.toBigInt(), Configs.TchainContractAddress);
            if (!tokoAllowance){
                await this.tokenApprove(Configs.AssetByTokenName.TOKO, Configs.TchainContractAddress)
            }
        }

        await this.getDiscount();
        await this.getDepositFee();
        await this.getTransactionFee();
        
        let $e = document.getElementById(_NAME);
        if ($e === undefined || $e === null) {
            $e = document.createElement("div");
            $e.id = _NAME;
        }

        $e.innerHTML = depositTemplate({
            tokenName: this._tokenName,
            depositAmount: this._amount,
            transactionFee: this._transactionFee,
            isUseToko: this._isUseToko,
            tokoAmount: this._tokoAmount,
            discountPercent: this._discountPercent,
            serviceFee: (this._serviceFee - this._serviceFeeDiscount),
            totalDepositAmount: (this._amount + this._serviceFee - this._serviceFeeDiscount),
            error: this._error,
            balance: window._tpayment.balances,
        });

        document.body.append($e);
        document.getElementById("_tchain.deposit.cbx.pay.with.toko").addEventListener('change', (e) => this.onPayWithTOKO(e));
        document.getElementById("_tchain.deposit.ddl.tokens").addEventListener('click', (e) => this.onClickDropdownlist(e));
        document.getElementById("_tchain.deposit.btn.submit").addEventListener('click', () => this.onDeposit());
        document.getElementById("_tchain.deposit.btn.close").addEventListener('click', this.close);
    }
}
