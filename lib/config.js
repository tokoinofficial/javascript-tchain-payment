
const Configs = {
    AssetByAddress: {
        "0xFBA4eED21cB02D3B4c50B4306F1c6D7A7671B30e": "BUSD",
        "0x15d0c6710a6989945134100ffae44e5e2dee1789" : "USDT",
        "0x09b9d0e083a8dc25b979e402c304dbcab574c7af": "TOKO"
    },
    AssetByTokenName: {
        BUSD: "0xFBA4eED21cB02D3B4c50B4306F1c6D7A7671B30e" ,
        USDT: "0x15d0c6710a6989945134100ffae44e5e2dee1789",
        TOKO: "0x09b9d0e083a8dc25b979e402c304dbcab574c7af"
    },
    TokenDefault: "USDT",
    Icons: {
        BUSD: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="21" viewBox="0 0 336.41 337.42"><defs><style>.cls-1{fill:#f0b90b;stroke:#f0b90b;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M168.2.71l41.5,42.5L105.2,147.71l-41.5-41.5Z"/><path class="cls-1" d="M231.2,63.71l41.5,42.5L105.2,273.71l-41.5-41.5Z"/><path class="cls-1" d="M42.2,126.71l41.5,42.5-41.5,41.5L.7,169.21Z"/><path class="cls-1" d="M294.2,126.71l41.5,42.5L168.2,336.71l-41.5-41.5Z"/></g></g></svg>`,
        USDT: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="32" height="32"><path d="M1000,0c552.26,0,1000,447.74,1000,1000S1552.24,2000,1000,2000,0,1552.38,0,1000,447.68,0,1000,0" fill="#53ae94"/><path d="M1123.42,866.76V718H1463.6V491.34H537.28V718H877.5V866.64C601,879.34,393.1,934.1,393.1,999.7s208,120.36,484.4,133.14v476.5h246V1132.8c276-12.74,483.48-67.46,483.48-133s-207.48-120.26-483.48-133m0,225.64v-0.12c-6.94.44-42.6,2.58-122,2.58-63.48,0-108.14-1.8-123.88-2.62v0.2C633.34,1081.66,451,1039.12,451,988.22S633.36,894.84,877.62,884V1050.1c16,1.1,61.76,3.8,124.92,3.8,75.86,0,114-3.16,121-3.8V884c243.8,10.86,425.72,53.44,425.72,104.16s-182,93.32-425.72,104.18" fill="#fff"/></svg>`,
    },
    TokenRegistryAddress: "0x2F76DB2f35c76794a78CF950315A14c92Fc66E18",
    TchainContractAddress: "0x8999862B90aa2e0AAB9887308DA3cF73018A69bf",
    TchainContractABI: require("./abis/tchain.json"),
    Bep20ContractABI: require("./abis/bep20.json"),
    GasLimit: 300000,
};

export default Configs;
