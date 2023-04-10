async function init(params = {}) {
    const { default: Configs, TestConfigs } = await import('./config');

    window._tpayment = {};
    window._tpayment.apiKey = params.api_key || '';
    window._tpayment.configs = params.TEST_MODE ? TestConfigs : Configs;
}

async function loadWeb3() {
    const { ethereum } = window;
    if (ethereum !== undefined) {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: `0x${Number(
                        window._tpayment.configs.ChainId
                    ).toString(16)}`,
                },
            ],
        });

        const { ethers } = await import('ethers');
        window._tpayment.provider = new ethers.providers.Web3Provider(ethereum);
        await window._tpayment.provider.send('eth_requestAccounts', []);

        const signer = window._tpayment.provider.getSigner();
        window._tpayment.walletAddress = await signer.getAddress();

        window._tpayment.tchain_contract = new ethers.Contract(
            window._tpayment.configs.TchainContractAddress,
            window._tpayment.configs.TchainContractABI,
            window._tpayment.provider
        );
        await loadBalances();
    }
}

async function loadBalances() {
    const balances = {};
    for (const token of Object.keys(Configs.AssetByTokenName)) {
        const smc = bep20SmartContract(Configs.AssetByTokenName[token]);
        if (smc !== null) {
            const balanceOf = await smc.balanceOf(
                window._tpayment.walletAddress
            );
            balances[token] = {
                amount: balanceOf,
                decimals: await smc.decimals(),
            };
            balances[token].unitAmount = ethers.utils.formatUnits(
                balances[token].amount,
                balances[token].decimals
            );
        }
    }

    window._tpayment.balances = balances;
}

function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(
        tokenAddress,
        window._tpayment.configs.Bep20ContractABI,
        window._tpayment.provider
    );
}

async function deposit(req, callback) {
    const [{ DepositReq }, DepositForm] = await Promise.all([
        import('./serializers'),
        import('./form/deposit'),
    ]);

    const depositReq = { ...DepositReq, ...req };

    await loadWeb3();
    depositReq.callback = callback;

    const depositForm = new DepositForm(depositReq);

    depositForm.show();
}

async function generateQrCode(req = {}) {
    const [{ DepositReq }, QRCode] = await Promise.all([
        import('./serializers'),
        import('qrcode'),
    ]);

    const depositReq = { ...DepositReq, ...req };
    const body = JSON.stringify({
        notes: depositReq.notes,
        chain_id: window._tpayment.configs.ChainId,
        currency: window._tpayment.configs.CurrencySupport.includes(
            depositReq.currency
        )
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
        body: body,
    };

    const res = await fetch(
        `${window._tpayment.configs.TChainAPIURL}/t-chain-sdk/generate-qrcode`,
        requestOptions
    );
    const data = await res.json();
    const deeplink = `mtwallet://app/payment_deposit?qr_code=${data.result.data.qr_code}`;
    return QRCode.toDataURL(deeplink);
}

export default {
    init: init,
    deposit: deposit,
    generateQrCode: generateQrCode,
};
