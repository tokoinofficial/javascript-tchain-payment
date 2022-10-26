# t-chain-payment

## Installation

### Use NPM

```
$ npm install t-chain-payment
```

### Use Yarn
```
$ yarn add t-chain-payment
```

## Initialize

```
import Payment from "t-chain-payment";

Payment.init({ api_key: "3e093592-3e0e-4a52-9601-ead49f794586" });
```

`api_key` will be generate in the cms of t-chain  


## Deposit

```
const params = {
	amount: 1000,
	orderId: "order_id,
	chainId: "97",
	currency: "IDR",
};
Payment.deposit(params, callbackFunc);
```
#### Handle callback result  
```
callbackFunc(res) {
    const tnxHash = res.hash;
}
```

#### Example for deposit
```
const params = {
	amount: 1000,
	orderId: "Order123,
	chainId: "97",
	currency: "IDR",
};
Payment.deposit(params, (res) => {
    this.transaction_hash = res.hash;
});
```

## Generate QR
```
const params = {
    amount: 1000,
    orderId: "order id",
    chainId: "97",
    currency: "IDR",
};

Payment.generateQrCode(params).then((res) => {
    this.qrCode = res;
});

```

**Next step**: 
- User use T-Wallet app to scan the QR Code.
- The merchant backend application will receive the transaction via `HookURL` when the payment is completed.

`HookURL`: the URL that the merchant provides to T-Chain. It is set when creating a project or updating the account management page of T-Chain for merchants.

`Data structure` sent via Hook URL :
```json
{
	"tnx_hash": string,
	"deposit_address": string,
	"deposit_id": string,
	"offchain": string,
	"order_id": string,
	"amount": string,
	"type": int, 
	"status": int,
	"deposited_at": int
}
```
```
// status enums
const (
	Pending = 1
	Success = 2
)

// type enums
const (
	Deposit  = 1
	Withdraw = 2
)
```

`deposited_at`: unix timestamps in seconds

## Demo

[Demo payment with t-chain](https://tchain-demo.tokoin.io/)
