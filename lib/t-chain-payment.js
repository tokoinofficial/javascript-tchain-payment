import QRCode from 'qrcode';
import { ethers } from 'ethers';

import Configs, { TestConfigs } from './config';
import { DepositReq, Rates } from './serializers';
import DepositForm from './form/deposit';

async function init(params = {}) {
    window._tpayment = {};
    window._tpayment.apiKey = params.api_key || '';
    window._tpayment.configs = params.mode === 'sandbox' ? TestConfigs : Configs;
}

async function loadWeb3() {
    const { ethereum } = window;
    if (ethereum !== undefined) {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: `0x${Number(window._tpayment.configs.ChainId).toString(16)}`,
                },
            ],
        });

        window._tpayment.provider = new ethers.providers.Web3Provider(ethereum);
        await window._tpayment.provider.send('eth_requestAccounts', []);

        const signer = window._tpayment.provider.getSigner();
        window._tpayment.walletAddress = await signer.getAddress();

        window._tpayment.tchain_contract = new ethers.Contract(
            window._tpayment.configs.TchainContractAddress,
            window._tpayment.configs.TchainContractABI,
            window._tpayment.provider,
        );
        await loadBalances();
    }
}

async function loadBalances() {
    const balances = {};
    const assets = window._tpayment.configs.Assets;
    for (const asset of Object.keys(assets)) {
        const smc = await bep20SmartContract(assets[asset].Address);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
            balances[asset] = {
                amount: balanceOf,
                decimals: await smc.decimals(),
            };
            balances[asset].unitAmount = ethers.utils.formatUnits(balances[asset].amount, balances[asset].decimals);
        }
    }

    window._tpayment.balances = balances;
}

async function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, window._tpayment.configs.Bep20ContractABI, window._tpayment.provider);
}

async function deposit(req, callback, receiptCallback) {
    const depositReq = {
        ...DepositReq,
        ...req,
        rates: await getRates(),
        funcGetRates: getRates,
        depositQrCode: await generateQrCode(req),
        callback: callback,
        receiptCallback: receiptCallback,
    };

    await loadWeb3();

    const depositForm = new DepositForm(depositReq);

    depositForm.show();
}

async function generateQrCode(req = {}) {
    const depositReq = {
        ...DepositReq,
        ...req,
    };
    const body = JSON.stringify({
        notes: depositReq.notes,
        chain_id: window._tpayment.configs.ChainId,
        currency: window._tpayment.configs.CurrencySupport.includes(depositReq.currency)
            ? depositReq.currency
            : window._tpayment.configs.DefaultCurrency,
        amount: depositReq.amount,
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'x-api-key': window._tpayment.apiKey,
            'Content-Type': 'application/json',
        },
        body,
    };

    const res = await fetch(`${window._tpayment.configs.TChainAPIURL}/t-chain-sdk/generate-qrcode`, requestOptions);
    const data = await res.json();
    const deeplink = `mtwallet://app/payment_deposit?qr_code=${data.result.data.qr_code}`;
    return QRCode.toDataURL(deeplink);
}

async function getRates() {
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
        return {
            ...Rates,
            ...dataJSON.result.data,
        };
    } catch (err) {
        return {error: 'An issue occurred during getting rates progress'};
    }
}

export default {
    init,
    deposit,
    generateQrCode,
};
