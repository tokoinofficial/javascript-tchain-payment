# t-chain-payment

## Installation

### Use NPM

```shell
$ npm install @tokoinofficial/t-chain-payment
```

### Use Yarn
```shell
$ yarn add @tokoinofficial/t-chain-payment
```

## Initialize

Sandbox mode (running on testnet)

```js
import Payment from "@tokoinofficial/t-chain-payment";

Payment.init({ api_key: api-key, mode: 'sandbox' });
```

Production mode (running on mainnet)

```js
import Payment from "@tokoinofficial/t-chain-payment";

Payment.init({ api_key: api-key });
```

`api_key` is the public key. It will be generated in the cms of t-chain.


## Deposit

```js
const params = {
	amount: 1000,
	notes: "order_id",
	currency: "IDR",
};
Payment.deposit(params, callbackFunc, receiptCallbackFunc);
```
Notes:
- currency : USD/IDR (default: USD)
- Support for VND as currency is coming soon


#### Handle callback result  
```js
callbackFunc(res) {
    const tnxHash = res.hash;
}

receiptCallbackFunc(res) {}
```

#### Example for deposit
```js
const params = {
	amount: 1000,
	notes: "order-123-456,
	currency: "IDR",
};
Payment.deposit(params, (res) => {
    this.transaction_hash = res.hash;
},
(receipt) => {
    if (receipt.status == 1) {}
});
```

## Generate QR
```js
const params = {
    amount: 1000,
    notes: "order-123-456",
    currency: "IDR",
};

Payment.generateQrCode(params).then((res) => {
    this.qrCode = res;
});

```
Notes:
- currency : USD/IDR (default: USD)
- Support for VND as currency is coming soon

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
