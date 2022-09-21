import { ethers } from "ethers";
import QRCode from 'qrcode';
import Configs from "./config";
import DepositForm from "./form/deposit";


async function init(merchantID) {
    window._tpayment = {};
    window._tpayment.token_registry_address = Configs.TokenRegistryAddress;
    window._tpayment.tchain_contract_address = Configs.TchainContractAddress;
    window._tpayment.merchant_id = merchantID;
    window._tpayment.configs = Configs;
}

async function loadWeb3(chainId) {
    const { ethereum } = window;
    if (ethereum !== undefined) {        
        await ethereum.request({
            method: "wallet_switchEthereumChain", 
            params: [{ chainId: `0x${Number(chainId).toString(16)}` }]
        })

        window._tpayment.provider = new ethers.providers.Web3Provider(ethereum), "any";
        await window._tpayment.provider.send("eth_requestAccounts", []);
        
        const signer = window._tpayment.provider.getSigner();
        window._tpayment.walletAddress = await signer.getAddress();

        window._tpayment.tchain_contract = new ethers.Contract(Configs.TchainContractAddress, Configs.TchainContractABI, window._tpayment.provider);
        await loadBalances();
    }
}

async function loadBalances() {
    const balances = {};
    console.log("Start")
    for (const token of Object.keys(Configs.AssetByTokenName)) {
        console.log(1)
        const smc = bep20SmartContract(Configs.AssetByTokenName[token]);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
            balances[token] = {
                amount: balanceOf,
                decimals: await smc.decimals(),
            }
            balances[token].unitAmount = ethers.utils.formatUnits(balances[token].amount, balances[token].decimals);
        }
        console.log(2)
    }

    window._tpayment.balances = balances;
    console.log("end")
}

function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider);
}

async function deposit(amount, offchain, networkID, callback) {    
    await loadWeb3(networkID);
    const depositForm = new DepositForm({
        amount, 
        offchain,
        callback: callback,
    });

    depositForm.show();   
}

async function generateQrCode(amount, offchain) {
    const qrString = `mtwallet://app/payment_deposit?merchant_id=${window._tpayment.merchant_id}&order_id=${offchain}&amount=${amount}&bundle_id=&env=dev`;
    return QRCode.toDataURL(qrString)
}

export default {
    init: init, 
    deposit: deposit,
    generateQrCode: generateQrCode,
};
