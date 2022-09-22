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
        this._amount = ethers.utils.parseEther(params.amount.toString()) || ethers.BigNumber.from("0");
        this._serviceFee = ethers.BigNumber.from("0");
        this._transactionFee = ethers.BigNumber.from("0");
        this._totalAmount =  ethers.BigNumber.from("0");
        this._isUseToko = false;
        this._tokoAmount =  ethers.BigNumber.from("0");
        this._discountPercent =  0;
        this._serviceFeeDiscount = ethers.BigNumber.from("0");
        this._depositFeePercent = 0;
        this._error = "";
        this._onDepsoited = params.callback;
        
    }

    async onDeposit() {
        if (this._error !== "") {
            return;
        }

        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);

        const res = await smcWithSigner.deposit(this._tokenAddress, 
            window._tpayment.merchant_id,
            this._amount,
            fee, 
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

    checkBalance() {
        this._error = "";
        const balances = window._tpayment.balances;
        const fee = (this._serviceFee.sub(this._serviceFeeDiscount));
        const amount = this._amount.add(fee)
        if (balances[this._tokenName] !== undefined) {
            if (balances[this._tokenName].amount.lt(amount)) {
                this._error = `Your balance is not enough ${this._tokenName} to make the payment`;
            }
        } else {
            this._error = `Token invalid`;
        }
        if (!this._isUseToko) return "";
        if (balances[Configs.AssetByTokenName.TOKO] !== undefined) {
            if (balances[Configs.AssetByTokenName.TOKO].amount.lt(this._tokoAmount)) {
                this._error = `Your balance is not enough $TOKO to make the payment`;
            }
        }
        return "";
    }

    async onChangeToken(event){
        try {
            this._tokenAddress = event.attributes.value.value;
            this._tokenName = Configs.AssetByAddress[this._tokenAddress];
            document.getElementById("_tchain.deposit.ddl.tokens").querySelector(".items").classList.toggle("hide");
        } catch (e) {
            this._error = e;
            console.log(e);
        }
        
        await this.show();
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
        return allowance.gte(amount);
    }
    
    async getDepositFee(){
        const depositFee = await window._tpayment.tchain_contract.depositFee();
        this._depositFeePercent = depositFee.toNumber() / 10000;
        this._serviceFee = ethers.BigNumber.from((this._amount * this._depositFeePercent).toString());
        if (this._isUseToko) {
            this._serviceFeeDiscount = ethers.BigNumber.from((this._amount * this._discountPercent).toString());
        } else {
            this._serviceFeeDiscount = ethers.BigNumber.from("0");
        }
    }
    
    async getDiscount() {
        const discount = await window._tpayment.tchain_contract.getDiscountFee(this._amount);
        this._discountPercent = discount.discountFee.toNumber() / 10000;
        this._tokoAmount = discount.deductAmount;
    }
    
    async getTransactionFee(){
        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer)
    
        const gasPrice = await window._tpayment.provider.getGasPrice();
        const depositFee = this._serviceFee.sub(this._serviceFeeDiscount);
        // const debugFee = await window._tpayment.tchain_contract.debugDepositFee(this._amount);
        const gasUnits = await smcWithSigner.estimateGas.deposit(this._tokenAddress, window._tpayment.merchant_id, this._amount, depositFee, this._isUseToko, this._offchain, {gasLimit: Configs.GasLimit});
        this._transactionFee = gasPrice.mul(gasUnits);
    }

    async show() {
        await this.getDiscount();
        await this.getDepositFee();
        this.checkBalance();

        const fee = (this._serviceFee.sub(this._serviceFeeDiscount));
        
        if (this._error === "") {
            const allowance = await this.hasEnoughAllowance(this._tokenAddress, this._amount.add(fee), Configs.TokenRegistryAddress);
            if (!allowance){
                await this.tokenApprove(this._tokenAddress, Configs.TokenRegistryAddress)
            }

            if (this._isUseToko) {
                const tokoAllowance = await this.hasEnoughAllowance(Configs.AssetByTokenName.TOKO, this._tokoAmount, Configs.TchainContractAddress);
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

        console.log(window._tpayment.balances);

        $e.innerHTML = depositTemplate({
            tokenName: this._tokenName,
            depositAmount: ethers.utils.formatEther(this._amount),
            transactionFee: ethers.utils.formatEther(this._transactionFee),
            isUseToko: this._isUseToko,
            tokoAmount: ethers.utils.formatEther(this._tokoAmount),
            discountPercent: (this._discountPercent / this._depositFeePercent) * 100,
            serviceFee: ethers.utils.formatEther(fee),
            totalDepositAmount: ethers.utils.formatEther(this._amount.add(fee)),
            error: this._error,
            balances: window._tpayment.balances,
        });

        document.body.append($e);
        document.getElementById("_tchain.deposit.cbx.pay.with.toko").addEventListener('change', (e) => this.onPayWithTOKO(e));
        if (this._error === "") {
            document.getElementById("_tchain.deposit.btn.submit").addEventListener('click', () => this.onDeposit());    
        }
        document.getElementById("_tchain.deposit.ddl.tokens").addEventListener('click', (e) => this.onClickDropdownlist(e));
        document.getElementById("_tchain.deposit.btn.close").addEventListener('click', this.close);
    }
}
