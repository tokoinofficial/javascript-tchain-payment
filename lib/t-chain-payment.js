import { ethers } from "ethers";

const configs = {
    token_registry_address: "0x2F76DB2f35c76794a78CF950315A14c92Fc66E18",
    tchain_contract_address: "0x8999862B90aa2e0AAB9887308DA3cF73018A69bf",
    tchain_contract_abi: require("./abis/tchain.json"),
    bep20_contract_abi: require("./abis/bep20.json"),
    gas_limit: 300000,
    token_assets: {
        busd: "0xFBA4eED21cB02D3B4c50B4306F1c6D7A7671B30e",
        usdt: "0x8f63c123d19a4c7c142058fceceda06a77453322",
    },
};

async function init(merchantID) {
    window._tpayment = {};
    await initWeb3()
    window._tpayment.token_registry_address = configs.token_registry_address
    window._tpayment.tchain_contract_address = configs.tchain_contract_address
    window._tpayment.tchain_contract = new ethers.Contract(configs.tchain_contract_address, configs.tchain_contract_abi, window._tpayment.provider);
    window._tpayment.merchant_id = merchantID;
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

function bep20SmartContract(tokenAddress) {
    return new ethers.Contract(tokenAddress, configs.bep20_contract_abi, window._tpayment.provider);
}

async function tokenApprove(tokenAddress) {
    const smc = bep20SmartContract(tokenAddress);
    if (smc === null) {
        return null
    }

    const balanceOf = await smc.balanceOf(window._tpayment.walletAddress);
    const signer = await window._tpayment.provider.getSigner();
    return await smc.connect(signer).approve(configs.token_registry_address, balanceOf);
}

async function hasEnoughAllowance(tokenAddress, amount) {
    const smc = bep20SmartContract(tokenAddress);
    if (smc === null) {
        return false
    }

    const allowance = await smc.allowance(window._tpayment.walletAddress, configs.token_registry_address);
    return allowance.toBigInt() >= amount;
}

async function deposit(tokenAsset, amount, isUseToko) {
    try {
        tokenAsset = tokenAsset.toLowerCase();
        const tokenAddress = configs.token_assets[tokenAsset];
        if (tokenAddress === undefined || tokenAddress === null) {
            throw new Error("Token invalid");
        }

        const amountBigInt = ethers.utils.parseEther(amount.toString()).toBigInt();
        const allowance = await hasEnoughAllowance(tokenAddress, amountBigInt);
        if (!allowance){
            await tokenApprove(tokenAddress)
        }

        // deposit
        const signer = await window._tpayment.provider.getSigner();
        const smcWithSigner = await window._tpayment.tchain_contract.connect(signer);
        return smcWithSigner.deposit(tokenAddress, window._tpayment.merchant_id, amountBigInt, isUseToko, {gasLimit: configs.gas_limit});
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    init: init, 
    deposit: deposit,
};
