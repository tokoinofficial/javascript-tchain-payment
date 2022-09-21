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
                                    <div class="amount"><span class="nfm">${params.balances.USDT.unitAmount || 0}</span> USDT</div>
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
                                    <div class="amount"><span class="nfm">${params.balances.BUSD.unitAmount || 0}</span> BUSD</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="_tchain-balance-info">Balance: <span class="nfm">${params.balances[params.tokenName].unitAmount}</span> ${params.tokenName}</div>
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
                                    discount</strong> of the service fee (Balance: <strong><span class="nfm">${params.balances.TOKO.unitAmount}</span> TOKO</strong>)
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
                <div class="btnSubmit ${params.error !== '' ? 'disable' : ''}" id="_tchain.deposit.btn.submit">Confirm</div>
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
    background: url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMzYzIDg0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbHRlcj0idXJsKCN5KSI+PG1hc2sgaWQ9ImEiIHdpZHRoPSIzNDMiIGhlaWdodD0iNjQiIHg9IjEwIiB5PSI4IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMzQzIiBoZWlnaHQ9IjY0IiB4PSIxMCIgeT0iOCIgZmlsbD0iI0Q5RDlEOSIgcng9IjgiLz48L21hc2s+PGcgbWFzaz0idXJsKCNhKSI+PHBhdGggZmlsbD0idXJsKCN2KSIgZD0iTTM1My4yLTZIMTB2MTEwaDM0My4yVi02eiIvPjxnIG9wYWNpdHk9Ii40IiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6bXVsdGlwbHkiPjxtYXNrIGlkPSJiIiB3aWR0aD0iMzQ0IiBoZWlnaHQ9IjExMCIgeD0iMTAiIHk9Ii02IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBmaWxsPSJ1cmwoI2spIiBkPSJNMzUzLjItNkgxMHYxMTBoMzQzLjJWLTZ6Ii8+PC9tYXNrPjxnIG1hc2s9InVybCgjYikiPjxwYXRoIGZpbGw9InVybCgjaCkiIGQ9Ik04MC41ODMtOTkuMzc5bDIxNC4wMSAyMTQuMDFjLTMuOTcyLTMwLjI1LTM2LjExNi04MC45NzItODQuNTc3LTEyOS40M3MtOTkuMTg0LTgwLjYwNi0xMjkuNDMtODQuNTc4eiIvPjxwYXRoIGZpbGw9InVybCgjZykiIGQ9Ik0tMTQuOTk0LTM0LjQ4bDgwLjExNyA4MC4xMTdDNjMuNjU2IDM0LjMzMSA1MS42MTcgMTUuMzI2IDMzLjQ2Ny0yLjgyNFMtMy42MjctMzMuMDEzLTE0Ljk5NC0zNC40OHoiLz48cGF0aCBmaWxsPSJ1cmwoI2YpIiBkPSJNNDYuMzYxLTgxLjg5OGwxNzguNjMgMTc4LjYzYy0zLjMtMjUuMjM5LTMwLjE4OS02Ny41ODktNzAuNTgzLTEwOC4wNC00MC4zOTUtNDAuNDU2LTgyLjgwNi02Ny4yODMtMTA4LjA0LTcwLjU4M3oiLz48cGF0aCBmaWxsPSJ1cmwoI2UpIiBkPSJNMTA0LjYtOS42MWwxMTcuMjcgMTE3LjI3Yy0yLjItMTYuNjIxLTE5LjgtNDQuMzY2LTQ2LjMyMi03MC45NS0yNi41ODMtMjYuNTItNTQuMzI4LTQ0LjE4MS03MC45NS00Ni4zMnoiLz48cGF0aCBmaWxsPSJ1cmwoI2QpIiBkPSJNLTMuNjg5LTYyLjIyM2wyMDQuMTEgMjA0LjExYy0zLjc4OS0yOC44NDQtMzQuNDY2LTc3LjI0NC04MC42NjYtMTIzLjQ0LTQ2LjItNDYuMjYxLTk0LjYtNzYuODc4LTEyMy40NC04MC42Njd6Ii8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTE3MS41OC0xLjg0NGw5OC4yNjYgOTguMjY3Yy0xLjgzMy0xMy44NzItMTYuNjIyLTM3LjIxNy0zOC44NjYtNTkuNDYtMjIuMTg0LTIyLjI0NS00NS40NjctMzYuOTczLTU5LjQtMzguODA3eiIvPjxwYXRoIGZpbGw9InVybCgjYikiIGQ9Ik0xNTIuMjEtODQuNzczbDE4Ny4xMiAxODcuMDZjLTMuNDg0LTI2LjQ2MS0zMS41OTUtNzAuODI4LTczLjk0NS0xMTMuMThzLTg2LjcxNi03MC40NjEtMTEzLjE4LTczLjg4M3oiLz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMjE5LjYxLTY0Ljc4OWwxNTQuMTggMTU0LjE4Yy0yLjg3Mi0yMS44MTctMjYuMDMzLTU4LjM2MS02MC45MjctOTMuMjU2LTM0Ljg5NS0zNC44OTQtNzEuNDM5LTU4LjA1Ni05My4yNTYtNjAuOTI4eiIvPjxwYXRoIGZpbGw9InVybCgjdSkiIGQ9Ik0xMS4xNjEgMTQuNTMxbDU0LjUxMSA1NC41MTFjLTEuMDM5LTcuNy05LjIyOC0yMC42NTYtMjEuNTcyLTMzQzMxLjc1NiAyMy42OTggMTguODYxIDE1LjU3IDExLjE2MSAxNC41MzF6Ii8+PHBhdGggZmlsbD0idXJsKCN0KSIgZD0iTTc4LjItNi45OGwyMDYuNzQgMjA2Ljc0Yy0zLjg1LTI5LjI3Mi0zNC44OTUtNzguMjIyLTgxLjcwNi0xMjUuMDMtNDYuODExLTQ2LjgxMi05NS43NjEtNzcuODU2LTEyNS4wMy04MS43MDd6Ii8+PHBhdGggZmlsbD0idXJsKCNzKSIgZD0iTTI4MC4yMyAzNC41MTZsMTMxLjU3IDEzMS41N2MtMi40NDUtMTguNjM5LTIyLjI0NS00OS44MDYtNTIuMDA2LTc5LjU2Ny0yOS43NjEtMjkuNzYxLTYwLjkyOC00OS41NjEtNzkuNTY3LTUyLjAwNnoiLz48cGF0aCBmaWxsPSJ1cmwoI3IpIiBkPSJNMjM3LjU4LTQ2LjQ1N2wyMDIuODMgMjAyLjgzYy0zLjc4OS0yOC43MjItMzQuMjIzLTc2Ljc1Ni04MC4xNzgtMTIyLjY1LTQ1Ljg5NS00NS44OTQtOTMuOTI4LTc2LjM4OS0xMjIuNjUtODAuMTc4eiIvPjxwYXRoIGZpbGw9InVybCgjcSkiIGQ9Ik0xODUuNDUtMzguNjk1bDE5My4yMyAxOTMuMjNjLTMuNjA1LTI3LjMxNy0zMi42MzMtNzMuMTUtNzYuMzg5LTExNi45MS00My42OTQtNDMuNjk0LTg5LjQ2Ni03Mi43MjItMTE2Ljg0LTc2LjMyOHoiLz48cGF0aCBmaWxsPSJ1cmwoI3ApIiBkPSJNMTM0Ljg1LTEwLjIxOWwyMTMuODMgMjEzLjgzYy0zLjk3Mi0zMC4yNS0zNi4xMTctODAuOTExLTg0LjUxNy0xMjkuMzEtNDguNC00OC40LTk5LjA2MS04MC41NDQtMTI5LjMxLTg0LjUxN3oiLz48cGF0aCBmaWxsPSJ1cmwoI28pIiBkPSJNNzAuNDM5IDY1LjU1OWw4My4xMTEgODMuMTExYy0xLjUyOC0xMS43MzQtMTQuMDU2LTMxLjQ3My0zMi44MTctNTAuMjk1LTE4Ljc2MS0xOC44MjItMzguNTYxLTMxLjI4OS01MC4yOTQtMzIuODE3eiIvPjxwYXRoIGZpbGw9InVybCgjbikiIGQ9Ik0yNzIuNTMgNzAuNjk1bDU4LjcyOCA1OC43MjhjLTEuMS04LjMxMS05LjktMjIuMjQ0LTIzLjIyMi0zNS41MDYtMTMuMjYxLTEzLjI2MS0yNy4xOTUtMjIuMTIyLTM1LjUwNi0yMy4yMjJ6Ii8+PHBhdGggZmlsbD0idXJsKCNtKSIgZD0iTTEyLjY4OSA2MS45NTNsNjAuMzc4IDYwLjM3OGMtMS4xLTguNTU2LTEwLjIwNi0yMi44NTYtMjMuODMzLTM2LjQ4My0xMy43NS0xMy42ODktMjguMDUtMjIuNzk0LTM2LjU0NC0yMy44OTR6Ii8+PHBhdGggZmlsbD0idXJsKCNsKSIgZD0iTTI3My4wOC01OS45NjFsMTM4LjYgMTM4LjZjLTIuNTY2LTE5LjYxNy0yMy40MDUtNTIuNDMzLTU0Ljc1NS04My44NDQtMzEuNDExLTMxLjM1LTY0LjIyOC01Mi4xMjgtODMuODQ1LTU0Ljc1NnoiLz48cGF0aCBmaWxsPSJ1cmwoI2opIiBkPSJNODMuMjcyIDM4LjE4NGw3Mi4wNSA3Mi4wNWMtMS4zNDQtMTAuMjA2LTEyLjE2MS0yNy4yNTYtMjguNDc4LTQzLjU3My0xNi4zMTYtMTYuMzE3LTMzLjM2Ni0yNy4xOTQtNDMuNTcyLTI4LjQ3OHoiLz48cGF0aCBmaWxsPSJ1cmwoI2kpIiBkPSJNLTI0LjM0NC05OC4xNTZsMjA1LjMzIDIwNS4zM2MtMy43ODktMjkuMDI4LTM0LjY1LTc3LjczMy04MS4xNTYtMTI0LjE4QzUzLjM4Ni02My41MTIgNC42OC05NC4zNzMtMjQuMzUtOTguMTYyeiIvPjwvZz48L2c+PC9nPjwvZz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImgiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDUgMTEyLjUwNCAtMTk5LjY1Nykgc2NhbGUoNTAuNzQ2IDE2My4yNCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAyMi44MDMgLTE4Ljg5NSkgc2NhbGUoMTguOTk5IDYxLjExNDk5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJmIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDg0LjcwNiAtMTQwLjg4NCkgc2NhbGUoNDIuMzUxIDEzNi4yMykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAxNDYuMDA0IC0xNTkuOTU3KSBzY2FsZSgyNy44MTMgODkuNDY2OTkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMDAzIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMzMxIiBzdG9wLWNvbG9yPSIjQkNCQ0JDIi8+PHN0b3Agb2Zmc2V0PSIuNjE4IiBzdG9wLWNvbG9yPSIjRTFFMUUxIi8+PHN0b3Agb2Zmc2V0PSIuODUxIiBzdG9wLWNvbG9yPSIjRjdGN0Y3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDUgMTA2LjI4NSAtNzYuOTA1KSBzY2FsZSg0OC4zOTc5OSAxNTUuNjgwMDEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMDAzIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMzMxIiBzdG9wLWNvbG9yPSIjQkNCQ0JDIi8+PHN0b3Agb2Zmc2V0PSIuNjE4IiBzdG9wLWNvbG9yPSIjRTFFMUUxIi8+PHN0b3Agb2Zmc2V0PSIuODUxIiBzdG9wLWNvbG9yPSIjRjdGN0Y3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDUgMTcxLjc5OCAtMjMyLjI3Mykgc2NhbGUoMjMuMzA0MDEgNzQuOTYxOTkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMDAzIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMzMxIiBzdG9wLWNvbG9yPSIjQkNCQ0JDIi8+PHN0b3Agb2Zmc2V0PSIuNjE4IiBzdG9wLWNvbG9yPSIjRTFFMUUxIi8+PHN0b3Agb2Zmc2V0PSIuODUxIiBzdG9wLWNvbG9yPSIjRjdGN0Y3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDUgMTQxLjc2MSAtMjcyLjE5Mikgc2NhbGUoNDQuMzcgMTQyLjczKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJhIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE3MC4wNzcgLTMzNS40NDUpIHNjYWxlKDM2LjU1OCAxMTcuNikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0idSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSA3Mi4xMTkgLTE5LjYxNikgc2NhbGUoMTIuOTMyIDQxLjU5OCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0idCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAyMTYuMjk0IC0xNDguODAyKSBzY2FsZSg0OS4wMTkgMTU3LjY4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJzIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDI5OS45NiAtMzUzLjQxNykgc2NhbGUoMzEuMjA0IDEwMC4zOCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iciIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAyNDQuODkxIC0zNTkuOTY0KSBzY2FsZSg0OC4wOTggMTU0LjcxOTk5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDIxOS41OSAtMjkwLjc5Nikgc2NhbGUoNDUuODI5IDE0Ny40MikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAyNDcuMTMzIC0yMjAuNTU2KSBzY2FsZSg1MC43MDggMTYzLjEyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJvIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE4OC45NjcgLTcyLjcyMykgc2NhbGUoMTkuNzA4IDYzLjM5NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4wMDMiIHN0b3AtY29sb3I9IiM4QThBOEEiLz48c3RvcCBvZmZzZXQ9Ii4zMzEiIHN0b3AtY29sb3I9IiNCQ0JDQkMiLz48c3RvcCBvZmZzZXQ9Ii42MTgiIHN0b3AtY29sb3I9IiNFMUUxRTEiLz48c3RvcCBvZmZzZXQ9Ii44NTEiIHN0b3AtY29sb3I9IiNGN0Y3RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0ibiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00NSAyNzQuMzg5IC0zMDguMTA1KSBzY2FsZSgxMy45MzIgNDQuODE2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJtIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDEzNS4zMzUgLjgzKSBzY2FsZSgxNC4zMTUgNDYuMDQ3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJsIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE4OC42NjkgLTM5My43MzEpIHNjYWxlKDMyLjg2OSAxMDUuNzMpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMDAzIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMzMxIiBzdG9wLWNvbG9yPSIjQkNCQ0JDIi8+PHN0b3Agb2Zmc2V0PSIuNjE4IiBzdG9wLWNvbG9yPSIjRTFFMUUxIi8+PHN0b3Agb2Zmc2V0PSIuODUxIiBzdG9wLWNvbG9yPSIjRjdGN0Y3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImoiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDUgMTUyLjQgLTk5LjE3KSBzY2FsZSgxNy4wODkgNTQuOTcxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjAwMyIgc3RvcC1jb2xvcj0iIzhBOEE4QSIvPjxzdG9wIG9mZnNldD0iLjMzMSIgc3RvcC1jb2xvcj0iI0JDQkNCQyIvPjxzdG9wIG9mZnNldD0iLjYxOCIgc3RvcC1jb2xvcj0iI0UxRTFFMSIvPjxzdG9wIG9mZnNldD0iLjg1MSIgc3RvcC1jb2xvcj0iI0Y3RjdGNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJpIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDUzLjcxMiAtNzAuMjQpIHNjYWxlKDQ4LjY4NiAxNTYuNjEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMDAzIiBzdG9wLWNvbG9yPSIjOEE4QThBIi8+PHN0b3Agb2Zmc2V0PSIuMzMxIiBzdG9wLWNvbG9yPSIjQkNCQ0JDIi8+PHN0b3Agb2Zmc2V0PSIuNjE4IiBzdG9wLWNvbG9yPSIjRTFFMUUxIi8+PHN0b3Agb2Zmc2V0PSIuODUxIiBzdG9wLWNvbG9yPSIjRjdGN0Y3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+PC9yYWRpYWxHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InYiIHgxPSIxMCIgeDI9IjM1My4yIiB5MT0iNDkiIHkyPSI0OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0RBMjJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3MzNFRSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJrIiB4MT0iMTAuMDE2IiB4Mj0iMzUzLjIyIiB5MT0iNDkuMDIyIiB5Mj0iNDkuMDIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjQTgwMDA0Ii8+PHN0b3Agb2Zmc2V0PSIuMjM2IiBzdG9wLWNvbG9yPSIjQjcwNjA2Ii8+PHN0b3Agb2Zmc2V0PSIuNjg3IiBzdG9wLWNvbG9yPSIjREUxNzBDIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkQyNDExIi8+PC9saW5lYXJHcmFkaWVudD48ZmlsdGVyIGlkPSJ5IiB3aWR0aD0iMzYzIiBoZWlnaHQ9Ijg0IiB4PSIwIiB5PSIwIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0iaGFyZEFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIi8+PGZlT2Zmc2V0IGR5PSIyIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIvPjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+PGZlQmxlbmQgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzMyNTdfMzE2MTAiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMzI1N18zMTYxMCIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=") no-repeat;
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
.disable {
    background: #979797;
    color: #000;
    border-color: #979797;
    cursor: not-allowed;
}
</style>`;
