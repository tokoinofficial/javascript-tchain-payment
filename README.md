# TChain Payment

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

Payment.init(merchant_id);
```

`merchant_id` will be provided when creating a project or use default merchant id  


## Deposit

```
Payment.deposit(amount, order_id, callbackFunc)
```

`order_id`: unique id of each order. It is called offchain in blockchain terms. 

#### Handle callback result  
```
callbackFunc(res) {
    const tnxHash = res.hash;
}
```

#### Example for deposit
```
Payment.deposit(10, "OrderID123", (res) => {
    this.transaction_hash = res.hash;
})
```

## Generate QR
```
Payment.generateQrCode(amount, orderID).then((res) => {
  // handle QR Url
  qrCode = res;
});
```

`order_id`: unique id of each order. It is called offchain in blockchain terms. 

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
	"merchant_id": string,
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

[Demo payment with t-chain](https://github.com/tokoinofficial/t-chain-payment-js-example.git)

