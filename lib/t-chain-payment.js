import { ethers } from "ethers";
import QRCode from 'qrcode';
import Configs from "./config";
import DepositForm from "./form/deposit";


async function init(merchantID) {
    window._tpayment = {};
    await initWeb3()
    window._tpayment.token_registry_address = Configs.TokenRegistryAddress;
    window._tpayment.tchain_contract_address = Configs.TchainContractAddress;
    window._tpayment.tchain_contract = new ethers.Contract(Configs.TchainContractAddress, Configs.TchainContractABI, window._tpayment.provider);
    window._tpayment.merchant_id = merchantID;
    window._tpayment.balances = await loadBalances();
}

async function initWeb3() {
    const { ethereum } = window;
    if (ethereum !== undefined) {        
        window._tpayment.provider = new ethers.providers.Web3Provider(ethereum);
        await window._tpayment.provider.send("eth_requestAccounts", []);
        const signer = window._tpayment.provider.getSigner();
        window._tpayment.walletAddress = await signer.getAddress();
    }
}

async function loadBalances() {
    const balances = {};
    Object.keys(Configs.AssetByTokenName).forEach(async(token) => {
        const smc = bep20SmartContract(Configs.AssetByTokenName[token]);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
            balances[token] = {
                amount: balanceOf.toBigInt(),
                decimals: await smc.decimals(),
            }
            balances[token].unitAmount = ethers.utils.formatUnits(balances[token].amount, balances[token].decimals);
        }
    })

    return balances;
}

function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider);
}

function deposit(amount, offchain, callback) {    
    const depositForm = new DepositForm({
        amount, 
        offchain,
        callback: callback,
    });

    depositForm.show();   
}

async function generateQrCode(amount, offchain) {
    const data = {
        merchant_id: window._tpayment.merchant_id,
        order_id: offchain,
        amount: amount,
        bundle_id: "",
        env: ""
    };
    return QRCode.toDataURL(JSON.stringify(data))
}

export default {
    init: init, 
    deposit: deposit,
    generateQrCode: generateQrCode,
};
