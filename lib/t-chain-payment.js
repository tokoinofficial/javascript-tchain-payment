import QRCode from 'qrcode';

import Configs, { TestConfigs } from './config';
import { DepositReq } from './serializers';
import DepositForm from './form/deposit';

// FIXME: Bundle from npm module using webpack instead
async function loadEthers() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.skypack.dev/ethers';
    script.crossOrigin = 'anonymous';
    script.referrerpolicy = 'no-referrer';
    document.head.appendChild(script);
}

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

        const signer = await window._tpayment.provider.getSigner();
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
    for (const token of Object.keys(window._tpayment.configs.AssetByTokenName)) {
        const smc = await bep20SmartContract(window._tpayment.configs.AssetByTokenName[token]);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(ethers.Typed.address(window._tpayment.walletAddress));
            balances[token] = {
                amount: balanceOf,
                decimals: await smc.decimals(),
            };
            balances[token].unitAmount = ethers.formatUnits(balances[token].amount, balances[token].decimals);
        }
    }

    window._tpayment.balances = balances;
}

async function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, window._tpayment.configs.Bep20ContractABI, window._tpayment.provider);
}

async function deposit(req, callback) {
    const depositReq = {
        ...DepositReq,
        ...req,
    };

    await loadWeb3();
    depositReq.callback = callback;

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

// Start loading ethers as page loads
loadEthers();

export default {
    init,
    deposit,
    generateQrCode,
};
