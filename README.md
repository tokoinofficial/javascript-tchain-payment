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
Payment.deposit(tokenAsset, amount, isUseToko)
```

- `tokenAsset` is `busd` or `usdt`

- if `isUseToko` is true. You must have a `$TOKO` token and it will use to pay a fee for the transaction and the amount of receive will be large than.

#### Example

```
Payment.deposit("busd", 1, true)
```


## Demo

[Demo library](https://github.com/tokoinofficial/tchain-payment-example)

