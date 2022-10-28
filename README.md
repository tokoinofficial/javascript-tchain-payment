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

Payment.init({ api_key: api-key });
```

`api_key` is the public key. It will be generated in the cms of t-chain.


## Deposit

```
const params = {
	amount: 1000,
	notes: "order_id",
	chain_id: "97",
	currency: "IDR",
};
Payment.deposit(params, callbackFunc);
```
Notes:
- currency : USD/IDR/VND (default: USD)
- chain_id: 97(testnet)/56(mainnet)


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
	notes: "order-123-456,
	chain_id: "97",
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
    notes: "order-123-456",
    chainId: "97",
    currency: "IDR",
};

Payment.generateQrCode(params).then((res) => {
    this.qrCode = res;
});

```
Notes:
- currency : USD/IDR/VND (default: USD)
- chain_id: 97(testnet)/56(mainnet)

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
	"notes": string,
	"amount": string,
	"type": string, 
	"status": string,
	"deposited_at": string
}
```

`status` is `Pending` or `Success`
`type` is `Deposit` or `withdraw`

## Demo

[Demo payment with t-chain](https://tchain-demo.tokoin.io/)
