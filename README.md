# TChain Payment

## Installation

#### Use NPM

```
$ npm install t-chain-payment
```

#### Use Yarn
```
$ yarn add t-chain-payment
```

## Usage

```
import Payment from "t-chain-payment";

Payment.init(merchant_id);
```

#### Deposit

```
Payment.deposit(amount, order_id, callbackFunc)
```

- `callbackFunc` is a function that will be called after deposit
- callbackFunc(res) {
    const tnxHash = res.hash;
  }
#### Example

```
Payment.deposit(10, "OrderID123", (res) => {
    this.transaction_hash = res.hash;
})
```


## Demo

[Demo library](https://github.com/tokoinofficial/t-chain-payment-js-example.git)

