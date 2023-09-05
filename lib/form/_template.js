/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { version } from '../../package.json';

function generateOptionPayFee(tokenInfo={}, selected=""){
    const { configs } = window._tpayment;
    let html = `<div class="discountFeeOptions">
        <div class="desc">
            To get 10% discount of the service fee, just pay a small amount with:
        </div>
    `;
    const tokenPayFees  = configs.AssetPayFees;
    const icons = configs.Icons;
    const discountFees = tokenInfo.discountFees || {};
    tokenPayFees.forEach(token => {
        if (discountFees[token]) {
            html += `
            <div class="_option">
                <div class="info">
                    <div class="check">
                        <input type="radio" id="_tchain.deposit.cbx.pay.with.${tokenInfo.Symbol}.${token}" name="_tchain.${tokenInfo.Symbol}.token.pay.fee" value="${token}" 
                            class="_tchain.token.pay.fee" ${ selected === token ? 'checked' : '' }
                        />
                        <label for="_tchain.deposit.cbx.pay.with.${tokenInfo.Symbol}.${token}"></label>
                    </div>
                    <div class="icon">${icons[token]}</div>
                    <div class="discountFee"><span class="nfm">${discountFees[token].deductUnitAmount || 0}</span></div>
                </div>
                <div class="balance">
                    <span style="font-size: 11px; color: #3C3C43; font-weight: 400">Balance</span>
                    <div style="display: flex; align-items: center">
                        <div class="icon">${icons[token]}</div>
                        <span class="amount"><span class="nfm">${tokenInfo.balance.unitAmount}</span></span>
                    </div>
                </div>
            </div>
            `;
        }
    });
    html += `</div>`;
    return html;
}

function generateAssetOptions(params={}) {
    let html = "";
    const { configs } = window._tpayment;
    const tokens = params.Assets;
    const selected = params.tokenSelected;
    const icons = configs.Icons;
    const tokenPayFees  = configs.AssetPayFees;
    for (const token of Object.keys(tokens)) {
        const tokenInfo = tokens[token];
        const optionPayFees = generateOptionPayFee(tokenInfo, params.discountToken);
        html += `
        <div class="_tchainPaymentToken ${token === selected ? 'active' : ''}">
            <div class="_tchainPaymentTokenHeader">
                <div class="_tokenInfo">
                    <div class="_tokenIcon">${icons[token]}</div>
                    <div class="_tokenName">
                        ${tokenInfo.Name}<br />
                        <label>${tokenInfo.Type}</label>
                    </div>
                </div>
                <div class="_tokenAction">
                    <input type="radio" id="_tchain.payment.token.${token}" name="_radioTchainPaymentToken" value="${token}" ${
                        selected === token ? 'checked' : ''
                    } />
                    <label for="_tchain.payment.token.${token}"></label>
                </div>
            </div>
            <div class="_tchainPaymentTokenContent">
                <div class="_item">
                    <div>Transaction Fee:</div>
                    <div>${params.transactionFee} BNB</div>
                </div>
                <div class="_item">
                    <div>Service Fee:</div>
                    <div><span class="nfm">${tokenInfo.fee}</span> ${token}</div>
                </div>
                <div class="_item">
                    <div>Exchange Rate:</div>
                    <div>
                        1 ${token} =~ 
                        <span class='nfm'>${tokenInfo.rate}</span>
                        ${params.currency}
                    </div>
                </div>
                ${
                    selected === token && !tokenPayFees.includes(token) ? 
                    `
                    <div class="_item" style="grid-template-columns: 100%">
                        ${optionPayFees}
                    </div>
                    ` : ``
                }
                <div class="_item ${tokenInfo.isWarning ? 'warning' : ''}">
                    <div class="_totalLabel">You'll transfer:</div>
                    <div class="_totalAmount"><span class="nfm">${
                        tokenInfo.amountTransfer
                    }</span> ${token}</div>
                    ${
                        tokenInfo.isWarning
                            ? `<div class="_warning">
                        ${configs.Icons.Warning}
                        <span>Insufficient balance to use this token for transfer</span>
                    </div>`
                            : ''
                    }
                </div>
            </div>
        </div>
        `
    }
    return html;
}

function generateDepositForm(params={}) {
    const { configs } = window._tpayment;
    return `<div style="padding-bottom: 80px">
        <div class="_tchainPaymenChooseTokenLabel">
            Please select a token that you would <br /> like to deposit
        </div>
        <div class="_tchainPaymenTimeRefesh">
            Exchange rate will be refreshed after 
            <span class="_timer" id="_tchain.payment.timers">5:00</span>
            ${configs.Icons.Refesh}
        </div>

        <div class="_tchainPaymentTokenList">
            ${generateAssetOptions(params)}
        </div>

        <div class="_tchainPaymentFormAction">
            <div class="_tchainButtons">
                <div class="_btnCancel" id="_tchain.deposit.btn.close">Cancel</div>
                <div class="_btnSubmit ${
                    params.error !== '' ? 'disable' : ''
                }" id="_tchain.deposit.btn.submit">Confirm</div>
            </div>
        </div>
    </div>
    `
}

function generateDepositQRCode(qrCode="") {
    return `
    <div class="tab-scan-qrcode">
        <div class="_tchainPaymenChooseTokenLabel">
            Please scan the QR code below to <br /> pay with T-Pay
        </div>
        <div style="padding: 0 24px">
            <img style="width: 100%" src="${qrCode}" />
        </div>
    </div>
    `
}
export const depositTemplate = (params = {}) => {
    const { configs } = window._tpayment;
    return `<div class="_tchainPaymentDialog">
    <div class="_tchainPaymentWrapper">
        <div class="_tchainPaymentForm">
            ${params.isShowQRCode ?
            `<div class="_tchainPaymentFormHeader">
                <div class="iconPrev" id="t.chain.nav.prev">
                    <div class="icon"></div>
                </div>
                <div class="title">Scan Code to Pay</div>
            </div>`
            : `<div class="_tchainPaymentFormHeader">
                <div class="title">Pay With T-Chain</div>
                <div class="iconScan" id="t.chain.nav.scan.qr">
                    <div class="icon">${configs.Icons.Scan}</div>
                </div>
            </div>`
            }
            <div class="_tchainPaymentVersion">
                <span>Version ${version} | Powered by</span>
                <a href="" class="_tchainPaymentLink">t-chainpayment.io ${configs.Icons.Link}</a>
            </div>
            <div class="_tchainPaymentFormContent">
                <div class="_tchainPaymentFormSummary">
                    <div class="_amount">
                        <div class="icon">${configs.Icons.Amount}</div>
                        <div class="_value">
                            <label>Amount</label>
                            <strong>${params.currency} ${params.depositAmount}</strong>
                        </div>
                    </div>
                    <div class="_note">
                        <div class="icon">${configs.Icons.Notes}</div>
                        <div class="value">
                            <label>Note (optional):</label>
                            <strong style="font-size: 16px; color: #3e3e3e">${params.notes}</strong>
                        </div>
                    </div>
                </div>
                
                ${
                    params.isShowQRCode? generateDepositQRCode(params.depositQrCode) : generateDepositForm(params)
                }
            </div>
        </div>
    </div>
</div>
<style>
._tchainPaymentDialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.5);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
._tchainPaymentWrapper {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
}
._tchainPaymentForm {
    box-sizing: border-box;
    border-radius: 3px;
    background: #FFF;
    margin: 0 auto;
    position: relative;
    max-height: 90%;
    overflow: hidden;
}

._tchainPaymentFormHeader {
    background: #179EEF;
    color: #FFF;
    text-align: center;
    padding: 15px;
}
._tchainPaymentFormHeader .title{
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
}

._tchainPaymentFormHeader .iconScan{
    position: absolute;
    top: 11px;
    right: 15px;
    cursor: pointer;
}

._tchainPaymentFormHeader .iconPrev {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-right: 2px solid #FFF;
    border-top: 2px solid #FFF;
    transform: rotate(225deg);
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
}
._tchainPaymentVersion {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    height: 37px;
    background: rgba(32, 161, 255, 0.08);
    font-size: 12px;
}
._tchainPaymentVersion ._tchainPaymentLink {
    font-weight: bold;
    color: #00A0F7;
    text-decoration: none;
}
._tchainPaymentFormContent {
    padding: 16px;
    overflow-y: auto;
}
._tchainPaymentFormSummary {
    background-color: #F2F2F2;
    padding: 20px 24px;
    border-radius: 12px;
}
._tchainPaymentFormSummary ._amount, ._tchainPaymentFormSummary ._note {
    display: grid;
    grid-template-columns: 26px calc(100% - 26px);
    grid-gap: 15px;
}
._tchainPaymentFormSummary ._note {
    margin-top: 24px;
}
._tchainPaymentFormSummary ._amount ._value, ._tchainPaymentFormSummary ._note ._value {
    
}
._tchainPaymentFormSummary ._amount ._value label, ._tchainPaymentFormSummary ._note label {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    display: block;
    color: #424242;
}
._tchainPaymentFormSummary ._amount ._value strong, ._tchainPaymentFormSummary ._note strong{
    font-size: 20px;
    font-weight: 700;
    line-height: 22px;
    color: #212121;
    margin-top: 5px;
    display: block;
}
._tchainPaymentFormSummary ._note input {
    width: 100%;
    cursor: pointer;
}
._tchainPaymentFormSummary ._note input::-webkit-input-placeholder { 
    color: #21409A;
    letter-spacing: -0.192px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    mix-blend-mode: normal;
}

._tchainPaymentFormSummary ._note input:-ms-input-placeholder {
    color: #21409A;
    letter-spacing: -0.192px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    mix-blend-mode: normal;
}

._tchainPaymentFormSummary ._note input::placeholder {
    color: #21409A;
    letter-spacing: -0.192px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    mix-blend-mode: normal;
}
.discountFeeOptions ._option .check {
    position: relative;
    width: 20px;
    text-align: center;
}
.discountFeeOptions ._option .check input[type="radio"] {}
.discountFeeOptions ._option .check label {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    height: 20px;
    left: 0px;
    top: 0;
    position: absolute;
    width: 20px;
}

.discountFeeOptions ._option .check  label:after {
    border: 1px solid #fff;
    border-top: none;
    border-right: none;
    content: "";
    height: 4px;
    left: 4px;
    opacity: 0;
    position: absolute;
    top: 6px;
    transform: rotate(-45deg);
    width: 10px;
}

.discountFeeOptions ._option .check  input[type="radio"] {
    visibility: hidden;
}

.discountFeeOptions ._option .check  input[type="radio"]:checked+label {
    background-color: #8A6A16;
    border-color: #8A6A16;
}

.discountFeeOptions ._option .check input[type="radio"]:checked+label:after {
    opacity: 1;
}
.nfm{
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    vertical-align: bottom;
}
.disable {
    background: #979797;
    color: #000;
    border-color: #979797;
    cursor: not-allowed;
}
._tchainPaymenChooseTokenLabel {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    letter-spacing: -0.25px;
    margin: 16px 0;
    padding: 0 24px;
    color: #424242;
}
._tchainPaymenTimeRefesh{
    font-size: 14px;
    text-align: center;
    font-weight: 400;
    color: #424242;
    background: rgba(245,245,245,0.9);
    padding: 12px;
    border-radius: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
}
._tchainPaymenTimeRefesh ._timer{
    font-size: 16px;
    font-weight: 700;
    color: #212121;
}
._tchainPaymenTimeRefesh ._icon{
    vertical-align: bottom;
    margin-left: 10px;
    cursor: pointer;
}
._tchainPaymentFormAction {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.04);
    z-index: 9999;
    background: #FFF;
}
._tchainPaymentFormAction ._tchainButtons{
    display: grid;
    grid-auto-flow: column;
    grid-gap: 15px;
    padding: 0 15px;
    align-content: center;
    height: 70px;
}
._tchainPaymentFormAction ._tchainButtons ._btnCancel,
._tchainPaymentFormAction ._tchainButtons ._btnSubmit {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 44px;
    text-align: center;
    cursor: pointer;
    height: 50px;
    line-height: 38px;
    background: #179EEF;
    color: #FFF;
    font-weight: bold;
}
._tchainPaymentFormAction ._tchainButtons ._btnSubmit.disable {
    background: #979797;
    color: #000;
    border-color: #979797;
    cursor: not-allowed;
}
._tchainPaymentFormAction ._tchainButtons ._btnCancel{
    border: 1px solid rgba(189, 189, 189, 1);
    background: #FFF;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
}
._hide {
    max-height: 0 !important;
}
._tchainPaymentTokenList { margin-top: 16px;}
._tchainPaymentToken {
    padding: 16px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #E0E0E0;
    margin-bottom: 16px;
    box-sizing: border-box;
    padding-bottom: 0;
}
._tchainPaymentToken.active{
    background: rgba(32, 161, 255, 0.08);
    border: none;
}
._tchainPaymentToken ._tchainPaymentTokenHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
}
._tchainPaymentTokenHeader ._tokenInfo {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 12px;
}
._tchainPaymentTokenHeader ._tokenInfo ._tokenIcon{}
._tchainPaymentTokenHeader ._tokenInfo ._tokenName{
    font-size: 18px;
    color: #21409A;
    font-weight: 700;
    line-height: 20px;
}
._tchainPaymentTokenHeader ._tokenInfo ._tokenName label {
    background: rgba(255, 174, 66, 0.3);
    color: #B76A21;
    font-size: 9px;
    font-weight: 700;
    border-radius: 18px;
    width: 38px;
    display: block;
    text-align: center;
    height: 14px;
    line-height: 14px;
}
._tchainPaymentTokenHeader ._tokenAction{position: relative}
._tchainPaymentTokenHeader ._tokenAction input[type="radio"] {
    visibility: hidden;
}
._tchainPaymentTokenHeader ._tokenAction input[type="radio"]:checked+label {
    border-color: rgba(0, 160, 247, 1);
}
._tchainPaymentTokenHeader ._tokenAction input[type="radio"]:checked+label:after {
    opacity: 1;
    transition: 0.2s;
}

._tchainPaymentTokenHeader ._tokenAction label {
    background-color: #fff;
    border: 2px solid rgba(60, 60, 67, 0.6);
    border-radius: 50%;
    cursor: pointer;
    height: 25px;
    right: 0px;
    position: absolute;
    top: -10px;
    width: 25px;
    transition: 0.2s;
}

._tchainPaymentToken.active ._tchainPaymentTokenHeader ._tokenAction label {
    border-color: rgba(0, 160, 247, 1);
}

._tchainPaymentTokenHeader ._tokenAction label:after {
    border-top: none;
    border-right: none;
    content: "";
    height: 17px;
    left: 2px;
    opacity: 0;
    position: absolute;
    top: 2px;
    width: 17px;
    background: rgba(0, 160, 247, 1);
    border-radius: 15px;
}

._tchainPaymentToken ._tchainPaymentTokenContent{}
._tchainPaymentToken ._tchainPaymentTokenContent ._item{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 15px;
    margin-bottom: 10px;
}

._tchainPaymentToken ._tchainPaymentTokenContent ._item div:last-child{
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    color: #212121;

}
._tchainPaymentToken ._tchainPaymentTokenContent ._item:last-child{
    background: rgba(101, 216, 60, 0.08);
    margin: 0 -16px;
    padding: 16px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}

._tchainPaymentToken ._tchainPaymentTokenContent ._item:last-child ._totalLabel {
    color: rgba(60, 60, 67, 0.6);
}

._tchainPaymentToken ._tchainPaymentTokenContent ._item:last-child ._totalAmount{
    color: rgba(74, 157, 45, 1);
    font-weight: bold;
}

._tchainPaymentToken ._tchainPaymentTokenContent ._item:last-child ._warning {
    grid-column: 1 / span 2;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 16px;
    font-size: 15px;
    font-weight: normal;
    color: #FF4242;
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item ._totalAmount{
    color: #FFF;
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item:last-child {
    background: #65D83C;
}

._tchainPaymentToken ._tchainPaymentTokenContent ._item:last-child.warning {
    background: rgba(255, 66, 66, 0.08);
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item:last-child ._totalLabel, 
._tchainPaymentToken.active ._tchainPaymentTokenContent ._item:last-child ._totalAmount {
    color: rgba(12, 15, 18, 1);
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item:last-child ._totalAmount {
    font-weight: bold;
}
._tchainPaymentToken.active ._tchainPaymentTokenContent ._item .discountFeeOptions{
    background: #FFD568;
    border-radius: 8px;
    padding: 10px 0;
}
.discountFeeOptions .desc{
    font-weight: 400;
    font-size: 15px;
    letter-spacing: -0.24px;
    padding: 0 10px;
}

.discountFeeOptions ._option{
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 0 10px;
}

.discountFeeOptions ._option:nth-child(2n){
    background: #FFC225;
}

.discountFeeOptions ._option .info{
    display: flex;
    gap: 10px;
    align-items: center;
}
.discountFeeOptions ._option .info .discountFee {
    font-size: 17px;
    font-weight: 600;
}
.discountFeeOptions ._option .info .icon svg {
    width: 24px;
    max-height: 24px;
    vertical-align: text-bottom;
}

.discountFeeOptions ._option .balance{ text-align: center}
.discountFeeOptions ._option .balance .icon svg {
    width: 16px;
    max-height: 16px;
    vertical-align: text-bottom;
}

.discountFeeOptions ._option .balance .amount {
    font-size: 13px;
    font-weight: 600;
}

._tchainError {
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #C52D2D;
    padding: 10px 0;
}

@media(min-width: 300px) {
    ._tchainPaymentForm {
        width: calc(100% - 30px);
    }
}

@media(min-width: 500px) {
    ._tchainPaymentForm {
        width: 450px;
    }
}

@media(min-height: 600px) {
    ._tchainPaymentFormContent {
        max-height: 510px;
    }
}

@media(min-height: 767px) {
    ._tchainPaymentFormContent {
        max-height: 650px;
    }
}

@media(min-height: 900px) {
    ._tchainPaymentFormContent {
        max-height: 700px;
    }
}

</style>
`
}
