import { ethers } from "ethers";
import QRCode from 'qrcode';
import Configs from "./config";
import DepositForm from "./form/deposit";
import {DepositReq} from './serializers';

async function init(params = {}) {
    window._tpayment = {};
    window._tpayment.token_registry_address = Configs.TokenRegistryAddress;
    window._tpayment.tchain_contract_address = Configs.TchainContractAddress;
    window._tpayment.apiKey = params.api_key || '';
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
    for (const token of Object.keys(Configs.AssetByTokenName)) {
        const smc = bep20SmartContract(Configs.AssetByTokenName[token]);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
            balances[token] = {
                amount: balanceOf,
                decimals: await smc.decimals(),
            }
            balances[token].unitAmount = ethers.utils.formatUnits(balances[token].amount, balances[token].decimals);
        }
    }

    window._tpayment.balances = balances;
}

function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, Configs.Bep20ContractABI, window._tpayment.provider);
}

async function deposit(req, callback) {    
    const depositReq = {...DepositReq, ...req}
    
    await loadWeb3(depositReq.chain_id);
    depositReq.callback = callback;
    
    const depositForm = new DepositForm(depositReq);

    depositForm.show();   
}

async function generateQrCode(req={}) {
    const depositReq = {...DepositReq, ...req}
    const body = JSON.stringify({
        "notes": depositReq.notes,
        "chain_id": depositReq.chain_id,
        "currency": depositReq.currency,
        "amount": depositReq.amount
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            "public-api-key": window._tpayment.apiKey,
            "Content-Type": "application/json"
        },
        body: body
    }

    const res = await fetch(`${Configs.TChainAPIURL}/t-chain-sdk/generate-qrcode`, requestOptions);
    const data = await res.json();
    const deeplink = `mtwallet://app/payment_deposit?qr_code=${data.result.data.qr_code}`;
    return QRCode.toDataURL(deeplink);
}

export default {
    init: init, 
    deposit: deposit,
    generateQrCode: generateQrCode,
};
