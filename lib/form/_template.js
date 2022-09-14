import Configs from "../config";

export const depositTemplate = (params={}) => `<div class="_tchain-wrapper">
<div class="_tchain-container">
    <div class="_tchain-confirm-form">
        <div class="_tchain-form-header">
            <div class="_tchain-form-title">Deposit Confirmation</div>
        </div>
        <div class="_tchain-form-inputs">
            <div class="_tchain-groups">
                <div class="_tchain-label-dropdownlist">Select a coin type that you'u like to deposit</div>
                <div class='dropdown' id="_tchain.deposit.ddl.tokens">
                    <div class='title'>
                            ${Configs.Icons[params.tokenName]}
                            <span>${params.tokenName}</span>
                    </div>
                    <div class='items hide'>
                        <div class='option' value=${Configs.AssetByTokenName.USDT}>
                            <div>
                                <div class="name">
                                ${Configs.Icons.USDT}
                                    <span>USDT</span>
                                </div>
                                <div class="balance">
                                    <label>Balance</label>
                                    <div class="amount"><span class="nfm">${params.balance.USDT.unitAmount || 0}</span> USDT</div>
                                </div>
                            </div>
                        </div>
                        <div class='option' value=${Configs.AssetByTokenName.BUSD}>
                            <div>
                                <div class="name">
                                    ${Configs.Icons.BUSD}
                                    <span>BUSD</span>
                                </div>
                                <div class="balance">
                                    <label>Balance</label>
                                    <div class="amount"><span class="nfm">${params.balance.BUSD.unitAmount || 0}</span> BUSD</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="_tchain-balance-info">Balance: <span class="nfm">${params.balance[params.tokenName].unitAmount}</span> ${params.tokenName}</div>
            </div>
        </div>
        <div class="_tchain-form-info">
            <table>
                <tr>
                    <td>Deposit Amount:</td>
                    <td>${params.depositAmount} ${params.tokenName}</td>
                </tr>
                <tr>
                    <td>Transaction Fee:</td>
                    <td>${params.transactionFee} BNB</td>
                </tr>
                ${
                    params.isUseToko ? 
                `<tr>
                    <td>
                        Pay TOKO Amount:<br/>
                    </td>
                    <td>${params.tokoAmount} TOKO</td>
                </tr>` : ''
                }
                <tr>
                    <td>
                        Service Fee:
                        ${params.discountPercent > 0 && params.isUseToko ? `<br /><small>(${params.discountPercent}%) discount applied</small>` : ''}
                    </td>
                    <td>${params.serviceFee} ${params.tokenName}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="_tchain-pay-with-toko-fee">
                            <input type="checkbox" id="_tchain.deposit.cbx.pay.with.toko" ${params.isUseToko ? 'checked' : ''} />
                            <label for="_tchain.deposit.cbx.pay.with.toko"></label>
                            <div style="padding-left: 10px">
                                Pay <strong>${params.tokoAmount} TOKO</strong> to get <strong>${params.discountPercent}%
                                    discount</strong> of the service fee (Balance: <strong><span class="nfm">${params.balance.TOKO.unitAmount}</span> TOKO</strong>)
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="_tchain-total">
            <div class="_tchain-label-total">DEPOSIT AMOUNT</div>
            <div class="_tchain-total-amount">
                ${params.totalDepositAmount}
            </div>
            <div class="_tchain-total-error">
                ${params.error}
            </div>
        </div>

        <div class="_tchain-form-action">
            <div class="_tchain-text-confirm">
                By clicking "Confirm", you understood and agreed with our policy.
            </div>
            <div class="_tchain-buttons">
                <div class="btnCancel" id="_tchain.deposit.btn.close">Cancel</div>
                <div class="btnSubmit" id="_tchain.deposit.btn.submit">Confirm</div>
            </div>
        </div>
    </div>
</div>
</div>
<style>
._tchain-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.5);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

._tchain-wrapper ._tchain-container {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
}

._tchain-confirm-form {
    width: 376px;
    box-sizing: border-box;
    border-radius: 3px;
    background: #FFF;
    margin: 0 auto;
    position: relative;
    padding-bottom: 120px;
}

._tchain-form-header {
    background: #21409A;
    color: #FFF;
    text-align: center;
    padding: 15px;
}

._tchain-form-header ._tchain-form-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
}

._tchain-form-inputs {
    padding: 0 15px;
}

._tchain-form-info {
    background: #eee;
    padding: 15px;
}

._tchain-label-dropdownlist {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.23;
}

._tchain-groups {
    padding: 15px 0;
}

._tchain-groups select,
._tchain-groups .dropdown {
    width: 100%;
    border: 1px solid #21409A;
    border-radius: 10px;
    height: 55px;
    line-height: 55px;
    font-size: 22px;
    padding: 0 15px;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: center right;
    margin-top: 25px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

._tchain-balance-info {
    text-align: right;
    font-size: 15px;
    font-weight: 400;
}

._tchain-form-info {
    margin-top: 10px;
}

._tchain-form-info table {

    width: 100%;
}

._tchain-form-info table tr td {
    padding: 6px 0;
}

._tchain-form-info table tr td:first-child {
    width: 150px;
    color: #424242;
    font-weight: 400;
}

._tchain-form-info table tr td:last-child {
    color: #212121;
    font-weight: 600;
}

._tchain-pay-with-toko-fee {
    background: url(https://svgshare.com/i/m6M.svg) no-repeat;
    height: 80px;
    padding: 14px;
    margin: -10px;
    color: #FFF;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

._tchain-pay-with-toko-fee input[type="checkbox"] {
    margin-right: 10px;
}

.round {
    position: relative;
}

._tchain-pay-with-toko-fee label {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    height: 15px;
    left: 15px;
    position: absolute;
    top: calc((100% - 15px) / 2);
    width: 15px;
    margin-left: 5px;
}

._tchain-pay-with-toko-fee label:after {
    border: 2px solid #fff;
    border-top: none;
    border-right: none;
    content: "";
    height: 3px;
    left: 3px;
    opacity: 0;
    position: absolute;
    top: 5px;
    transform: rotate(-45deg);
    width: 7px;
}

._tchain-pay-with-toko-fee input[type="checkbox"] {
    visibility: hidden;
}

._tchain-pay-with-toko-fee input[type="checkbox"]:checked+label {
    background-color: #66bb6a;
    border-color: #66bb6a;
}

._tchain-pay-with-toko-fee input[type="checkbox"]:checked+label:after {
    opacity: 1;
}

._tchain-total {
    text-align: center;
    padding: 20px 15px;
}

._tchain-total ._tchain-label-total {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #616161;
}

._tchain-total ._tchain-total-amount {
    color: #212121;
    font-size: 28px;
    font-weight: 600;
    margin-top: 15px;
}

._tchain-total ._tchain-total-error {
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #C52D2D;
}

._tchain-form-action {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

._tchain-text-confirm {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #3B3B3B;
    padding: 0 20px;
    margin-bottom: 10px;
}

._tchain-buttons {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 15px;
    padding: 0 15px;
    padding-bottom: 20px;
}

.btnSubmit,
.btnCancel {
    height: 36px;
    line-height: 36px;
    border: 1px solid #21409A;
    border-radius: 30px;
    text-align: center;
    cursor: pointer;
}

.btnSubmit,
.btnCancel {
    background: #21409A;
    color: #FFF;
}

.btnCancel {
    background: #FFF;
    color: #21409A;
}

.hide {
    max-height: 0 !important;
}

.dropdown .title {
    width: 100%;
    cursor: pointer;
}

.dropdown .items {
    transition: max-height .5s ease-out;
    margin: 0 -30px;
    margin-top: 0px;
    background: #FFF;
    position: relative;
    z-index: 999;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: hidden;
    padding-bottom: 20px;
    box-shadow: 0px 3px #dedede;
}

.dropdown .items.hide {
    padding: 0;
    margin: 0;
}

.dropdown .items .option {
    cursor: pointer;
    font-size: 16px;
    padding: 0 25px;
}

.dropdown .items .option > div {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
}

.dropdown .title,
.dropdown .items .option .name {
    display: flex;
    align-items: center;
}

.dropdown .title svg,
.dropdown .items .option svg {
    width: 32px;
    margin-right: 10px;
}

.dropdown .items .option .balance {
    line-height: 24px;
}

.dropdown .items .option .balance label {
    font-weight: 400;
    font-size: 13px;
}

.dropdown .items .option .balance .amount {
    font-weight: 600;
    font-size: 16px;
    ;
}

.dropdown .items .option:hover {
    background: rgba(33, 64, 154, 0.2);
    border-radius: 5px;
}

.nfm{
    display: inline-block;
    width: 100px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    vertical-align: bottom;
}
</style>`;
