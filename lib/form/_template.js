import Configs from '../config';

export const depositTemplate = (params = {}) => `<div class="_tchainPaymentDialog">
    <div class="_tchainPaymentWrapper">
        <div class="_tchainPaymentForm">
            <div class="_tchainPaymentFormHeader">
                <div class="title">Deposit Confirmation</div>
            </div>
            <div class="_tchainPaymentFormContent">
                <div class="_tchainPaymentFormSummary">
                    <div class="_amount">
                        <div class="icon">${Configs.Icons.Amount}</div>
                        <div class="_value">
                            <label>Amount</label>
                            <strong>${params.currency} ${params.depositAmount}</strong>
                        </div>
                    </div>
                    <div class="_note">
                        <div class="icon">${Configs.Icons.Notes}</div>
                        <div class="value">
                            <label>Note (optional):</label>
                            <strong style="font-size: 16px; color: #3e3e3e">${params.notes}</strong>
                        </div>
                    </div>
                    <div style="background: #FFAE42; width: 100%; height: 1px; margin: 24px 0 16px 0;"></div>
                    <div class="_tchainPayWithTokoFee">
                        <input type="checkbox" id="_tchain.deposit.cbx.pay.with.toko" ${
                            params.isUseToko ? 'checked' : ''
                        } />
                        <label for="_tchain.deposit.cbx.pay.with.toko"></label>
                        <div>
                            Pay <strong>${params.tokoAmountForDiscount} TOKO</strong> to get <strong>${
    params.discountPercent
}%
                                discount</strong> of the service fee <br />
                                (Balance: <strong><span class="nfm">${
                                    params.toko.balance.unitAmount
                                }</span> TOKO</strong>)
                        </div>
                    </div>
                </div>
                <div class="_tchainPaymenChooseTokenLabel">
                    Please select a token that you would <br /> like to deposit
                </div>
                <div class="_tchainPaymenTimeRefesh">
                    Exchange rate will be refreshed after 
                    <span class="_timer" id="_tchain.payment.timers">5:00</span>
                    ${Configs.Icons.Refesh}
                </div>

                <div class="_tchainPaymentTokenList">
                    <div class="_tchainPaymentToken ${params.tokenName === 'TOKO' ? 'active' : ''}">
                        <div class="_tchainPaymentTokenHeader">
                            <div class="_tokenInfo">
                                <div class="_tokenIcon">${Configs.Icons.TOKO}</div>
                                <div class="_tokenName">
                                    Tokoin (TOKO)<br />
                                    <label>BEP20</label>
                                </div>
                            </div>
                            <div class="_tokenAction">
                                <input type="radio" id="_tchain.payment.token.toko" name="_radioTchainPaymentToken" value="TOKO" ${
                                    params.tokenName === 'TOKO' ? 'checked' : ''
                                } />
                                <label for="_tchain.payment.token.toko"></label>
                            </div>
                        </div>
                        <div class="_tchainPaymentTokenContent">
                            <div class="_item">
                                <div>Transaction Fee:</div>
                                <div>${params.transactionFee} BNB</div>
                            </div>
                            ${
                                params.discountPercent > 0 && params.isUseToko
                                    ? `<div class="_item">
                                <div>Pay TOKO Amount:</div>
                                <div>${params.tokoAmountForDiscount} TOKO</div>
                            </div>`
                                    : ''
                            }
                            <div class="_item">
                                <div>
                                    Service Fee:
                                    ${
                                        params.discountPercent > 0 && params.isUseToko
                                            ? `<br /><small>(${params.discountPercent}%) discount applied</small>`
                                            : ''
                                    }
                                </div>
                                <div><span class="nfm">${params.toko.fee}</span> TOKO</div>
                            </div>
                            <div class="_item">
                                <div>Exchange Rate:</div>
                                <div>
                                    1 TOKO =~ 
                                    <span class='nfm'>${params.toko.rate}</span>
                                    ${params.currency}
                                </div>
                            </div>
                            <div class="_item">
                                <div>You will transfer:</div>
                                <div class="_totalAmount"><span class="nfm">${
                                    params.toko.amountTransfer
                                }</span> TOKO</div>
                            </div>
                        </div>
                    </div>

                    <div class="_tchainPaymentToken ${params.tokenName === 'USDT' ? 'active' : ''}">
                        <div class="_tchainPaymentTokenHeader">
                            <div class="_tokenInfo">
                                <div class="_tokenIcon">${Configs.Icons.USDT}</div>
                                <div class="_tokenName">
                                    Tether(USDT)<br />
                                    <label>BEP20</label>
                                </div>
                            </div>
                            <div class="_tokenAction">
                                <input type="radio" id="_tchain.payment.token.usdt" name="_radioTchainPaymentToken" value="USDT" ${
                                    params.tokenName === 'USDT' ? 'checked' : ''
                                } />
                                <label for="_tchain.payment.token.usdt"></label>
                            </div>
                        </div>
                        <div class="_tchainPaymentTokenContent">
                            <div class="_item">
                                <div>Transaction Fee:</div>
                                <div>${params.transactionFee} BNB</div>
                            </div>
                            ${
                                params.discountPercent > 0 && params.isUseToko
                                    ? `<div class="_item">
                                    <div>Pay TOKO Amount:</div>
                                    <div>${params.tokoAmountForDiscount} TOKO</div>
                                </div>`
                                    : ''
                            }
                            <div class="_item">
                                <div>
                                    Service Fee:
                                    ${
                                        params.discountPercent > 0 && params.isUseToko
                                            ? `<br /><small>(${params.discountPercent}%) discount applied</small>`
                                            : ''
                                    }
                                </div>
                                <div><span class="nfm">${params.usdt.fee}</span> USDT</div>
                            </div>
                            <div class="_item">
                                <div>Exchange Rate:</div>
                                <div>
                                    1 USDT =~ 
                                    <span class='nfm'>${params.usdt.rate}</span>${params.currency}
                                </div>
                            </div>
                            <div class="_item">
                                <div>You will transfer:</div>
                                <div class="_totalAmount"><span class="nfm">${
                                    params.usdt.amountTransfer
                                }</span> USDT</div>
                            </div>
                        </div>
                    </div>

                    <div class="_tchainPaymentToken ${params.tokenName === 'BUSD' ? 'active' : ''}">
                        <div class="_tchainPaymentTokenHeader">
                            <div class="_tokenInfo">
                                <div class="_tokenIcon">
                                    ${Configs.Icons.BUSD}
                                </div>
                                <div class="_tokenName">
                                    Binace USD(BUSD)<br />
                                    <label>BEP20</label>
                                </div>
                            </div>
                            <div class="_tokenAction">
                                <input type="radio" id="_tchain.payment.token.busd" name="_radioTchainPaymentToken" value="BUSD" ${
                                    params.tokenName === 'BUSD' ? 'checked' : ''
                                } />
                                <label for="_tchain.payment.token.busd"></label>
                            </div>
                        </div>
                        <div class="_tchainPaymentTokenContent">
                            <div class="_item">
                                <div>Transaction Fee:</div>
                                <div>${params.transactionFee} BNB</div>
                            </div>
                            ${
                                params.discountPercent > 0 && params.isUseToko
                                    ? `<div class="_item">
                                    <div>Pay TOKO Amount:</div>
                                    <div>${params.tokoAmountForDiscount} TOKO</div>
                                </div>`
                                    : ''
                            }
                            <div class="_item">
                                <div>
                                    Service Fee:
                                    ${
                                        params.discountPercent > 0 && params.isUseToko
                                            ? `<br /><small>(${params.discountPercent}%) discount applied</small>`
                                            : ''
                                    }
                                </div>
                                <div><span class="nfm">${params.busd.fee}</span> BUSD</div>
                            </div>
                            <div class="_item">
                                <div>Exchange Rate:</div>
                                <div>
                                    1 BUSD =~ 
                                    <span class='nfm'>${params.busd.rate}</span>
                                    ${params.currency}
                                </div>
                            </div>
                            <div class="_item">
                                <div>You will transfer:</div>
                                <div class="_totalAmount"><span class="nfm">${
                                    params.busd.amountTransfer
                                }</span> BUSD</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="_tchainPaymentFormAction">
                    ${
                        params.error !== ''
                            ? `
                        <div class="_tchainError">
                        ${params.error}
                        </div>
                    `
                            : ''
                    }
                    
                    <div class="_tchainButtons">
                        <div class="_btnCancel" id="_tchain.deposit.btn.close">Cancel</div>
                        <div class="_btnSubmit ${
                            params.error !== '' ? 'disable' : ''
                        }" id="_tchain.deposit.btn.submit">Confirm</div>
                    </div>
                </div>
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
    width: 450px;
    box-sizing: border-box;
    border-radius: 3px;
    background: #FFF;
    margin: 0 auto;
    position: relative;
    padding-bottom: 80px;
    max-height: 90%;
    overflow: hidden;
}
._tchainPaymentFormHeader {
    background: #21409A;
    color: #FFF;
    text-align: center;
    padding: 15px;
}
._tchainPaymentFormHeader .title{
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
}
._tchainPaymentFormContent {
    padding: 16px;
    max-height: 700px;
    overflow-y: auto;
}
._tchainPaymentFormSummary {
    background-color: rgba(255, 216, 141, 0.2);
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
._tchainPayWithTokoFee {
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyNzRweCIgaGVpZ2h0PSI0NXB4IiB2aWV3Qm94PSIwIDAgMjc0IDQ1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNzQgNDUiIHhtbDpzcGFjZT0icHJlc2VydmUiPiAgPGltYWdlIGlkPSJpbWFnZTAiIHdpZHRoPSIyNzQiIGhlaWdodD0iNDUiIHg9IjAiIHk9IjAiCiAgICBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVJJQUFBQXRDQVlBQUFCaWJPVHZBQUFwNGtsRVFWUjQycjFkYTNya05xNDlvTXAyZDVhUgoyZjk2N21RZms3YnJJZUwrd091QVVybmRtV1NjTCsxeVZWRWk4VHdBQVVyKytKY3EvQ2RmNU44S1FQd1Q4YitCaVltcnZ1T3FWNGdJCkJnWUVHMFRzbGIwekFBaEVCZ1R3NjlDUEFLcjk3ZlgrL2I2UzM5Z3hjZFVQM1BRRGlnbW9BQ0oxbjN3TkFDT3Y5TkFiSm5hYmwzOVgKUkFEMTM2RGZFUHFlWDBmcUUvam5FRUQ4L2paTjhaZThha2w2VHV6WTlRSE5WZmtkY2g0QTN3VStINmJJcm5kYmkrNzV1ZEI0a1EwRApHd1N5MEhRaGVQQWg3My84R0hrTnJRR3hGdDFySFlMa2cxMU9hcnhPM1BXR2g5Nzl1NXA4RWFJanJ6K3ZBMWttNVpRUjZkTVZnYXJkClYxWHgwQnZ1ZXJQWk5YbVE1WGQvcis0UDFNTGtSSVpsb2RWeVhSK3ZDejJMbHVKVUxMbG1LaHQ5SDdqcEJ5Wm1ybHpiUEZsQzVVU2UKZ3BSQ256K2hnYXh5VWZTTWdhdCtQdlNPNi93UGRuMUEvdmg5NnRHQWdBaDVwdkNLQ2NWMXZ1T0dHd0M0NlJnWU12SXZFVE1rb2FpbQpjQ3ZaeWtEMWR6K2ZSeHF6NmNZRUE2YStwVmhGV0NrQnd6Mk5pVjIrQk5ya1JoRC9OWVBpeGtGSXdMV1pGV0tVbkFnZUdacUppVjN2CmFRaFlBQ1JYUVlva1phaEVBRlhCbEIyUGVjTURacFFHUmw1SElCaGl4cjF1TDBVL0VneUpONFQ1Y0xBbXpoZHA0NkhBRklXeVFXRjYKU1AxdEJ2Q0JoenI5eWZDd3NTaEY2RXJDVnc0K25Tb0FHYnFIM3R6ZzZwRW5TYzl1YkFYRDFKdXVHL05yNjR0eHdueXI2OHNUdWVacApudWtWRTlqazVJSEh2R0ppTHlNU2RBZ2pFUVpZUWZRb1NTcDZGUy9hT2xTSUxPeTR6MldCMTdIamdZLzlQNUEvL3FWNnREam5TR0ExCk9Ec21idnFCbXlNVDBZRWhteXRqWVpOUVRsYVF2TjVQRE5hS2lOaCtGekw2c085cUo1Z3BkZmQ4Sm1CMzdKZ2tuaTdRZ1V3SUZkUjgKUnhxSkVpOUdRU0JrODF6QVM3RVVEMzI0Z0pBQ2kwQjB2US9kb3ltVWxxY1hYUXgyR0pQUkJPdVpZSVRuU1E5NmlsQ0NEMzFkaW9tcAowenduMDBFQkdjSDM0dGw5M2pEZEFIWkQzbEZsQ1BZWi9kZ2dTTTZPUGhOQWRlS0JPKzd6V21hdUlFempvOUo2R3A4Ykh4Y0Rueko4Ck1nZEhxcnJRVHhzZjlLQlRXcmN5ZnJpOFB2U0txUTlvUTh6RXEvWk9wME01OEdmckp3Uk42KzFJbGVXaDI0ZGQ3NUIvLzc2ckx0TTQKS1BpenhRWXkwWGZjOVE0QWJqZ01tWmhpbWpDUFZIQUJLOU5xS0pnV1B3dDlGTjJZVE4xTHZjbmpkSVJpeU9XdWQ0S000WWw4ZGlKcApxY1VWMjhhVElCRkRGVjNFR2pKeEJHRU1SVU1nQ2tDeFkxZjd2M3ZDSGtJSnIyY3hVaVpvc1I3SjlkZ1VQTXhrUkVMMDYzeW5kMWFFCmNyQkRjdURIMU4zblVBWm5KS0pDZXM3cHlEQkNQTFI1bE9HTEtLTXJoRFRQMnowdXkwa29pQm5idTE3aFdMMTkvMmxvd0lvbVJDOUMKQU1xT0E0QXVJVlJEZlBpSzQxemx1L1JpMTd1Rjhycjc1V2tlemZoMTJTajVOTGx2QnJJaE10YkxvQTg3amtJNDhTZlAvNkpTVTZaQQp3QW1qYlNwS2w0UVRjb2pnVGI1RGRIaE11b1FsTkFWbVQ3ZllYU2p5SzlJdG55d01FUVUyR1hpVDc0QUMxL2xPRUJ0a0JGbEU3UFdMClhBd1J5SFNDYVB0RzBKd1p4QUEzV1o4Q3JpNVlqSWNXS3k4TWZ2MGJzaGw2RThGRHcwdkgzTm5UYVNFU0pZR0E0Q0l2R0xMaDdqbWcKV0hQQTZ5bHFHU3RocjgxQkFBNmhaNjZZSFVueUt0WlJnaVlDeTh2SWdPcU8yU2p2VU1mNU9VVHdnamNJaG9WNFVQcFlrNTRObVNRaQpPK2hLLzVNOGNDakhpN3dDQ3R6bnpjTmdOKzdKRTcrZm52OE9UMTVLNUZ5U2Jna2FYOVoxbk9tRmRJek5hSnYxUTV6SHRvYkttZVRjClFtcFVTU3lLa1NUVkI4SjFhV1pYV1lPRlBtMFVGN3I3Ly8zK1VJc2h1d0tjV3A1RUtNZVFSekZ4MHlzaGt5MXpKS0xEa2NtYXpIeWUKSXpsZDlDZWh6OFRFaDc2bk1XR29uQWdGZ3A3alVPd2VYckFIYWVGTy9FY0lwUXMyeC9ocnRpT3VVWXh0Q0FWb2dqUXh6YmpwbzVRNwoxdEZDaGdqQkttbHA4N2VrNXE0UElwdmpFODlkeGUwazZkbjVzQ0xUSmdja1JITGdSK2VqNnNUdVJ1MGdWNG5VWXMzM0RQSFcwTUZ5CkxjZGNGTWp3c2NlcTNFVC92aUdUSytWTXlPQlFucVBrb0hKdVBjSEpIbDN5bmsxQlR1YlJGUEJMZW5YVWkrbkk1SzRmbURvTG1La1EKWDBmT3J3ekVtck9yTlVUdVRCYWtsOUlwWjZFc2puTHl4NzlVTTc3VmtEWHlwc3NBL2xtaDJ0U0pHNjU0NkQyRlpzaFd5b2d3S01hbwpYOHVSUERFd05JK3BGdVo4YUJnVEZvK0ErbjF0bWF1UTZjNmpZbmFUbTVIanp3eHRYbytnWWtkZ0pIaTBQTVdxR01pWWVOY0hkaFRzCk44Rmt5RThoVlJySThMSWVVK01PcFNSam9KNkdsTkNOQXd0NHo5WnJRd1I2R04rdm9Ya2RrNnNlY2kwRzFnM2dReVBVSWNPdnBCQ24KSWQveE4rZW9OUFhhM3B0dWFCL3p3eEhUU1U2bUdZcTYvekdIc056M1JFbUxTTkpJVEI5OGtqYnd2MGsvb0liY0huckRmVjQ5ejNRMAp2TTFRbEFDZEdJcXVENS9TOU1SeDhNL0ZFTFA5dDJNSHBnSXlDT3Ayd05NWGEvQlAvYmZBSUtzQ3FRaVdSUm0xQ2F2VGxWTTdwZkozCm83TkRUSnd3WWpFMGZ2OVgrUWIxdkkxNW5vQ1kwOWFoYmxNcFYzR0pNQWNUMEprR3h0WTluUkd6aFM3RTIwVEdnSVUzbENzdlFVaVoKYWdGQmhtTDFqMkJ6NDd2cnczTW5nTWdrRDJ3V1AwT3dGUFFZZndFVWFVeTB6WDhrS2VkQnJJc2Y2a1pOUEFSUVVXTmRJQmdCWlpoNApKV0Z0d254dHpxdVpoaTArS3hnczJPUVZnR1NvRS9RVUZVeFdVM0VSVFRSWTRVSHdRNGtmVU1GTUNiWXdSMFV4UFdlU3lWQ1dPeEs3CkZUWWt2OVBnSGcxQXNLalNCZFAvWmpTclg4dVJrRjdFa2phOEFBTzRUZ1YwVDdRbzZ6VTBaRkFoT21oU2tuclJ0dStYbjhoeVRRMU0KbyswUzRUaWhqa2hpMHJzbi9tS3hQUlFaNjEyZUVzTENuQnNlK3NoclpGMUpKRjViL2NZNUlkZnM4RmVUVnJ0R0F2Wkh4dXBIUklHRQpka2hQYnNpRXZUNS90MStuRUU1NjY3V2VoU2haYngyaHJyakJVVlg2T0R4MWhUcWhTZXpaODNmYlpiRDE3UHJBWGU5THlGRDFNSTNtCmgxMmFOY1JaM20vekRJak4vT2lTcVppVlVHWStKS0tMVUdmSFEyK29tSHloNXlsOWtmS1VORDU0NEU3WHUxNXhteDlFbTQ1RUd0SWsKVGpXK1NhMEQ2NXlDbm1PbFE1dDFDMjA3UDFEKzlXUzh5ZXNOdC9uaFpRUjgxWkxIWHBlenpuTkJVaXlmVEFkR1ZFK1MycTJPSkpERQpyZyszNmhGYmx5ZmptUEd6SEVka3kzZTRZZkx0NGR3YWZsYW9oc1c2Zm1Jd1Bvc3BKeVkrWmhtVElraEIvY3BEMk44VFZnU1V5U3cyCktLY0ZhMFJJR1Uwb0dXaTIraFBmL1dGRzFpck9RN2dkTzNZOE1KWG10ZFJmREtwL1lDRlY3TGhGWVZaQzlkckZLanl6OHZFb2RDeGcKd1EvZUxxLzE4enE2NEUzZG9USVQvWlFocm5uczJQR1lkMlJpdE5HVDZ5ZUtubWM1bEs2bS9YT1ZpZnU4NHE1WFJ5enhReUdrMUQxWAp1dVI5RDg3aFdRSG1jbzJUa09kbk9aSXp4UElBR1JNSXNZZlhXODZ1NVh4OFhzbkhYQmZhRlE1eUlQMjFLbkNwdWdWN2Y4TUZBS3pRClNTaTZiZGFkYWhQYzRMQ2loeXE5eUN0RUg5ZzlBYXRTZ3BaaTkyUjhrUzV3cXNNeExGWmRLSGxKdXc0REc3Nk43eEFGUHZTSHJVTkMKd0V0b0RkN2F0WWNLeG5qSitvNUN2WkVqV0ZuSnFxeXBvSjN3WFF5TmFad0JyL3hEWnVrWmNrT3c0WUtCWWNWMHVqZURrNEZGN0RLZwpjaWYyMXdXdnNCMjFLWHVLVVFtUHVtS1JZS2M4eTBFZk1sUEw0dUFoYU9yVXlYWjNVSDJUQ3laMlN4WXlQUmNabERFeUNic3E1a3BpCm9Rc3crb29DdXJQb1JiRGhaYndCQ3FvejZUSVhvYXd1T3kvRkdZNmpGbW5KWFo4amdqdklOVWxLR2oyU2gvcTZ5eXFaaWd0ZWdZRTAKSnBvb3hHZkR0NkVwS1pHOGZWK1h6MC9rSWZpYzlCVFBrWEFzSmdBMmJJNG83b0JFYlliRlZHTXRGYWNjeVJwRGlWcitJVXJEVVJtQgpoUEVCaCtTekhBbUpBYXR5eXkza1BHcThZT0IxZklmT01DWUJscTBXTklWT0krY1FhN1QxcStkWWFqdXdTMUs4blBBdDJTNUtLUkRCCm5NZzVUUlhhMnE3NTUwdGVSeXhSekNSTTJhMEFUUjMzaFVlUFhJWlc2QlYzQ0tOdTI4TXorVHpKbUhRNWNLR0pCSHhJQzBsV0IrVHIKSHloNVNnYVhWSXNPYkRLeTdpUnpHQXFBa04xRlh2QlFWUEhhb2xqOXA1d0Q1MWk0UUF4S0JsZXNHTzVGM3FBQzNQV2FDRWhJbmxVNwo4bGtSc2pBaG1EWk5ubW51cWRnOVIxSkdwT2paOWNvL0w0VkpaM0FSTXliWC9RT0szZmlLdXRkRTVicWdzWTZZVTkrckM3bElsamYxCmk3d0swZHoxOHhKR0FVa0MrL3VDRnlqZ01mWnMrK2kxdTJFS2NSd2ZjdzVtdmVDaEF6c2V5WVZBSncwbExjVDhTaDJKV1VZT0pEcGYKTjJ4V1p3SXpKcGxFWGVzRjB1emJkVGE4WU1MQ25JWksxd1NiYUZXaUpnTUNwd2o5WFlpczFhS2NUQ0hLL1prdVpqVGNXMHNsWWpOaApTSVlxRVZmYm9ScDRrVmZmSGRtYjM0N1ZTQWhvZ3lXTHJqWjhBVERkUUFMY3QyQ0xWaHd5RE5rQWlNZjRtc3JITVB3aXI5aDFlTGhOCmxRd3RmNkNMb1NLM3lkdWdQSmpwNHNqa05qOXdSQlJ0bFUwQUR1bVhMSGpUN3NrNXpGQms0Wm9oMDA1ZXpwR2MxVm5SaWxNL0JNQkYKWHFFajFyQW5nWFJ3MkVwWDBITjVaUFN0S3BCeFpyWHB1NEZTL3YzNzFPVmJKRnBXZ1hqVFd4STlLbFFITm95TXg4ZnArTGluK3FSdApXOU04b3JYM0RhbzRsWU5vNCtRNnZLYWZiUS96MzFsbmtzaWtoeDQ5WjFMa05hVmJTcjliQ01QYjJXZmhEU1YyMCtBSUNlT2FXNUJHCi95NWwwdWl3MDVicDB5UXNLVk40b3NlOFc0MkhlN1JRYk5YWklIaW5ad2YxYXgzS3dRbkUzMUkwN25JaEJLTzE2SXpLeGRXODRkVy8KZDNJU2hmaTZvckVHRTFWYmtyQkNoNERvaW9uYi9DQmtRc3BmTHJRbnRaZTZvc3d0QkQwek94RTRPTllWNHhlKzlobmo1em1TdnR4bwpDYmp0UHlqUEZ6emluRWVYeTNJRTB2U3hPWW1tbjB2ZVNBU1hWaStRNDBwakRabW9KK3gyd0l2THJMOWl1REZSUXlqTCtPcHZDQ3QzCkFYVDNNS2NNUVNvZngyQTRHb3FqZ3lRazFCQUtxMElFTWh1K3lYZElDM1BjMHhQVVl3WUpnRTAyN0FFek9kaE10bEQraHVOVEtaSW4KNDVzTTFiVU91ejVrTUZzMmhEeTZqWG1Cd0pEZXBKUmhYQXBaUnhJaGtJMi9qSmZjSVFuNGJodHB3ME02MURiM0lZUUl6a2l1a1NVbQo1aERKZW9yWURzWWthQlg5V0h1VzJCZkMwU0hPQjl2U3RtSzduczg0VGxGSVVVTmhWcW1wOThJUnZJNXZ3QlRjbzZzY3dxQ2tTYXdOClpLeGNLNnd5QVdrR3M4MlRuYUtzNnlEanhQcDh5SkVvR1d2ajN3V3Z3QWJjOW5mczJKZDZvS0E1UzFXN0FWR0loZERYZ1ZqSGlsTDAKbUNQSnNNNXpBaEdES1lDYmZtRDN1TmRnMFlTcWwzakRmY2t5SGdUZkJGWWpBVVhGNmkxWFFyRmNydVdZbTFqWitpeEhvdHJuY2N5WgpVSVdDRWxSTEQySUUzTEM1QjlkS3ZPbnNWWC9xSm90aVdoR0J5a3dMRW1pWkdhaExlRlgxQzBXRXpvK092cUxteExhSnZRczNhb0I4Cm5uRzNTY3A3a1JjOEFNLzJyelVOVVE5VDlNd0U4U2RSejZUWFZyOHhnYWc5a2NySktLMERKa1VBWUR1RWJ1QlUzWS9QZ1NrMmJzTUcKQ1BBZ1l5SUsrNXpNV05BdmJHbHBqVG0xUkZLNmR2a092STQzWUtwdkRVZE5VU0hVdUZpK3o4QWlyNk5RSFdpVFdlcUxPcUk3NG84MApFNGM2a3A0ak9YT3VGekZqY3AwL25MOEFkTkRzRTBpQzY2dlllY255S21SUE5RektSSFVkeTdNY2lZK04zZ2pBQ25tZ2ZnWklXSzRCCnlNekFadVo1Sk5MR016SUlZeUt3NXEyTTc1dElsdkNhVjNpV0l3bW9IMGltaDBabjR6Y012STN2d0t5Y1NVcmtTVXdjQ0dMRHhZdnMKWm1FUkIySnBXeFFONnFabldUTDNRaUlYLy9LdWliUnZFRDZUSGtSVWNMWGhSWHhYQjQra0R3dk84aFlpbWJuRGtFQWgyS0JwM3pwbApEaDZOZWhndk41UXVkTEpNb3BXNjVOV1ZQSzlnak0yTDBLYnpScEdocy9NaERLZEdmV3I5NDhWWFI0TlgvbnVVTVJiS0NhVE1ETHlNCmJ3QUVONitRVHZsWTVTdTBXOWlFaGFLRlBGRk9oZWtWcHErbnk4cVlORVFueDg5SnZwY2d1SXpKY0dQaXlKT3ZjNVRIc29oUnNObVIKRU5Kd2RrUTI3TDFmT1k4a0RNbUhmZ0N3UkdiMDFBeHMyZmtiNFVwTTl1d2NERUN4UjdVaktqSElrZjZ6ZVRBNzBCajRTVXk1akxjNgpreDllVGgrZUoyYVErMVNWTTNGUHVyYjluOWVWOUpnNlkvUzFXNU04M2RwdHlkY3psREhUbGZSdDhqTFFjZGpRUSs4a0Z6SC9PaGNHCmZyOVEwNTNRVE1YM0ZuT3ZRUndibkxVRXZZQnhEM2U2ZjZ2NHJ2VWUwdWQ1Z0pZMy96RXRneS9SVjFSSzJZMHdad1JhVEU4UVBlbloKSkM2cVBSVzMrVzVoenRJa3lhSG8ybDNlNzB4R1lNMmJ1UU5zSmYzUUE5L1hCT3RuZWdyU1V5QUtHbSs0enZkRUpsM2VoQkNpb0ZBMApyMkoxYWlrQUpVZUdTT1I1YmlGajh2cmtWYXdFL3FvV2c2a0FtMjVaRVRyUTRTS1A1NmdGRUd3WWRqQU9aazRvQ3FaWXRQNUtIVWxiCkIvbzZ6QzhOZkJ1L1FhYmczWkZKME9mNWVQUCtYTXVSbmxicTljSHpVQ3k4K09rbWNyYUlEak9MZ2NPTUNkRTNac2VDUGNZRkZ4V3YKMWRocFBkUVpTa3B1UnVZRnV3ajIrYWc3NXBjcm14U2liUUNncW5GYUV3VjNRUk4wNyt0RVc4Y2FMVVZ1d1FMbVNNSkduaXBNaWU5Qwp6ZnRCeFFyd2RLWEl6K01MU3pkMlNhYXQvM1Y4QjFSdzl6QW5GTER0YkpCV3MzR1dkVkh0UmtlOVdzT3NrdWNWR2RTRkU2RjNtMFhyCkhiaklHekFFdC9uREV0b0grU1FuRnJlaTRoTWxQcmJtWnRZVE9jdVJ4TDhuT1E2YjVIQmpZdjBzdTVvaEdIcXhQV20xazducVBKS24KS1E1ZnFtQmlKREtCaHZMbHFvajRYV1NVLy9sQ2ptUzE2SlV6VVh6b3V4VS9aYXdWM2I2ZTQ4RE1tbzBoWVV6czNyRnZiMUJWRXVHRQpzR1J2aURJRHVrbUU5ZzFWNTJ1Slhhd0gvQ0VWZXlXWkpIZkVGSlVEcWZYNHZEUzZhb01QbS9lZzlESjJ1ODUwaE1MOGNEZ2ZCaVhDCkJCMUdxOHo1Y0xjdThRV2w4T3RCZ3N6WGdlSFpOSy9yQ2NNbXhyL0xlUFhqQWJUbm9EUkNENkhLWnFKaktsUVBEeEtaVU84V1JDM00KOGZ1SEVWcDdyNnBKVWxwdWhxL2VFWFlaRXhzVGhCRXpHaVR3U2NkREhjbFJwOVpjemtWZWdQRWJydk5QUjNtRVFCQTVwdUpKMVoyWQp3WjdFZHRXK25SeEc3RXM1a3ZVOGtvR0JOL2tHQUs2QUU1QTZjR1VnenZqZ2pNa1M0VkVNR0ZVVEZhb0ViQUxkOXl4SDRnd2hzV2RDCnB0TEs4L0diREx5TjN3QVZmTXdmeUsxZUlrUlZjR3JDWjl2Tm1SNlQ5OWk0OGlNMHI3U21QU0J4NjBNUWMvV2dCSFpGdklFS2VZMFcKY2hBOUJzVHJScnpsd2ZNV3phU1RKRm95OHdLSUpKS1I1TFoxVm5NUlhXdE05SC90VklQWU9xVzVCVjhxcWtsK3A3Tkp4VHJ5TlFvRQpaeDVMVU1vdnNGMm9oOTZDUFExWkNsTlFhaVNia0diaHBTWWFpT0RGa2NsdFJzNUV5UWhVMnlBTzF3M1VRaHdsbExibU9JNWI2SVEyCjBPVkNhZnhwY3dNamRZemFNTW1jQ1dwdVZGblh3azhIR2RMZzFUSHBET0R6T2hMa2hKcHN0QmpzcWgvNG1EOEE5OVFiTm9oWTlzU08KWGJUelNNN0dyN21OaUUyTGJISStqNXduWCtkSkRJa2l4dWZubWFqblRDck1xU29BM3A3bVdEM3lDT1Z0cE0yZHhEaDdTdEJ5RlRXQwp6cjlvQmdka2NNeTR6em5yWGkwMkx6cXdVRTdkNjFnQzM5RnBKOERsZW16RTdsdjBIUE5iSDlKTy9GaHpISXRDdGR4RGZGNS9TeE4wCkRrbHp4VzBjY2kxVldwKzVLMWhQa1lVNTVDaWFSeWlIeHVIbTJYa2JvSG5FOWFMTzVPcklaSER1QzVUcnl2dU0xR2hacmh1bjNQWGMKUlBBdDNPcTY5YnpTOHl5SEdPZUhuT3VGSFpseHc4ZjgweHhETWtMU2FWZGltTTlqb2R3YXFsZU1EZlNuZFNTNU8rUGZyeHhIQWVKWAorUVlNUnlZNkljT21NTVhFYjNnTHZ5UmhGd1NVbGgrVjVWNGk1c0ozamVNbjF3RUpKSHV1amt6T3hnOFJ5NW1vNE4yUlNWV3dWa3piCnZaa2xNV09ISVdMN3RtT3ozSXZwMlVRM0toR0RIdU1rZWVuS01ZVGF2MG1acTNlSkJjeU9GUkFNMitsZ1JZelFSbEc1QkJGc1B2K3AKajF5QXRVWW9OUTVXWXJidTNxbmVQajR4RHV5UkEyWlhQcXpFSUxmS0FRelp6T3lUQWJlcmJkZ0dzTTlIdXc4YmxLN296TWQxQmJKNApkRUN3V1oySndwR0pqL0ZUeVZqSmMyMlpzNVBHYzBaaWxadm9zMXhsaHVXN0pHcXRJMW1SZWRjTEtIQVpyL2dHTzdoOXg0TjRWQVRuCmVhd2FvNHQ5Q043OHRJNkVGWk9KSDYrR0d4TUY4SUVmMktkQ1pYTXJ2dmxDaGljcUIwMlJKSmgrWngxRnJrdXhyS1l4aEFYeDV6a1MKeGRITXNDRDdlU2FpVm1laVNnSXhHL1JtNFhIVDZmRmpaRWlrMElXUGozdE1ZWkhWMXFzVFc1OHl5MHV2Z2hrbjRyZUViNjY1NkpnawpkaUc3NElKZGR1L0FWYlJjVHVSTU5BeUhoeE9SN1hjK0RpOGNZK29YUGNuUU9qK2s0algzZkVxZWs1eEVYTVZ6VEtsTUlaL2thTXp4CkRETW1XamtUTTNZWDI3VUtCMGJua1pnaTBPTkxQQWxSdVNKU2tMWDNDK2FsUXo3cy9OUlpnZ0JrUzBqUlhWMzJvNzRvUmRNNm9LZTAKd3RKYXRVdUdWbkZlcnk4S1JQZE1MK2hWNjRVeittN3lodGZjR3M0TWxFbXNlbldWaENtSzNxVkJmMGNrVk52dGZ5bEhzc1pnbVROUgo0R08rZTZHWFY3ODZhVXRsUm81djUwZlFuWG1mMnBqL0xNZXhlZzVwaE9RNmt2cXNBclBpYWwxdmsyM0ptZEJ1eDBtM2FpQUlReWFlClBWaFJTY0pHb0VmTTVBRU9IcmhvUTA2SXJqa2dGR3BrL2NUUUl4OXBIaGRjcWhDTmR3M2kvbG15WVEyWHU5clRBaUswRDJTNWEzUVMKSi9FV0pMVE9BdUR6VDRNWGpkY2ttR2tIS1NHc2hGYXNYUU9Pa01pTHk4Q0dTeGExNmNDUjNveDZWdVVqdjNiY0JReGt3amtUMmlKUApSTTNqZWMwZGMvRHpmYkRJUmFzTWJydGJLN0l0dExhS3lWRXY3TGZsejk0QUNOV1puR1ZxZU5lRzg0QkgvZnpMejdYaEwzQ080Nm9mCitOQjNKL25teFdlMml4UDlPVXc4SHIvbzZGK2V4MEU0VU9OVndyeHg2TEFJUEQ0N3p5UlFpSHZ5cFk0a0JBdW83L0V1Rk5lVkJGdFoKZ250WVZOQzRJR3JsZW5nYk9vQnVLV1lYVFI0SHJUTk9lSjY1RGtIT0cvQTZrenh3MkR6NUxyTWZ1QVEyaTZ1clpHTVNDaC96NmZUbgpYQTJ2djRjalBmUmhZeEwwbldvUElsdXM4Rk4rUkxLeDFJajVjWlNuaVluYmZLZWl0ZmpleUlSNTBTUG9LdmxPUWRwNjcreHMybWVKCjRxYlVUM0tZWDhrZFpzNEUrN0pkN3oxUE11aStpenduSDMreGpvUVZoQm5LT1E2TEk4V0tZRHczTXFRT3FGR01tTXBoL045NUhrbGIKeCtLSkJzU0VqekxWY2VFZ2tOV1orSGttczg0ek9WU0J4UDYvZTlRUi9TcE5qZnJDdW4vczNaWWdBVS9GalZHWjIvRFYrNG50QUxJOQpuajNwaW5vNTE3VWhqbk9zcGtUbVl5SUJpYU1idlJQYUp1ZGh4SlpoVGlsSWhXQm9ndGtJZ3VOdVFQMHV2cEtKSm9Od3pCbU5EUFhpCktzUEQ2M2dZMTlGeGxNd2ZrRnQ4UnMyVlRSNWh2VnVHVEVDN09TNVBlVXpCeW9RbEh5TDl1b3hYcUpTandwSTI1bUFqU2I1Vy9VVFMKMDk2cVZWL2tGZDlFY2QxL1lKZWRMdCszSEVJdU9VZVM5UHNyZFNUNWVieHFNWmdkRHZTS04raFFYT2NIZG5rQXV0VzJwc2JwY3hGTApFcFpjY2h4eGY3N3I2Z0h6bjErb0l4SDNHcnZXMlJ5eENSMDlIcWJBQTYveUhTckFWWDlZbjlIQjBGbXNIZ0t2MmF2RFBUS0NpTmUxCnBEWXo3RGE5RUVML1dPdU1Ecm9rRlRHVkVrM2RmZjJ6NkRnWHE5V0FnaVFkTGdMczZyc2htQmJUZTB3OHM1SFJRcjdLeTlqY2h1ZkEKNmhHa1ZVZFNNVGxCK3hEb1NDMGNiTXlhbzREWFZpemFRM0pST1NUZVJUT1BhYjA3bWkwQVppQ3A5eW52V2ptcWJHNU1QaXkyNEt4MwpDMlpNNnJ5YlFyOTVWbXE1akFNLzRtWGV5NVcvNmpmc09pbmYxRE8wSm5wL3BwKzVOT3FsMitRTnJ4dHczZjlzWGNQUk01U3RCWWl3ClV5Q1VNMVQ4eFRxU3I4UmdiL2dHR2NCVnIrYkpkRURFUzlGVmdhRzFMYnpBdVZ6STMzQWV5WEVkd1l1UnBWWW1RNU9nZEUwcksyQVYKdnB1elJLTjBNQVk3NE5yR1E5Rm8wVzNuejZHcHVMalE0ZTFacjAwY1gxQ240SytCQldsTTBwcXZ1bUdUQWVEaGVSTTdyTHQ1SXVmcQpKcGRFTUtFVTFrZ25lUW9lNUZoSGtpN0twOUxyY3RKQ1VtNkNGM0NPYURyR2NGNnBRQjBSQnMwM3VaZ0JiRFV6UmY3a0hKZHFya2liCk9KSktpTmpGYzJRQ1pKalRUdUVmblE3MVUvTXBNOU8wYjBFMEhMYkdPclNOV01uelREOVgvYlpldXJmZW01TUZkNFMwZ2k1SitVS2YKRnoxa1NOYmNnaTZlZlVFd3VueWZ4UFFWM3dBUlhQV0tIVHMydFcxaG82L2xmMGRhdkNmM1QyVmN1aDJmSWFtZnJpUC85RjBremJNNQo3UDNZYlJFVUN5U1J5UWZLbUdSVzNpMTNNSnUzR0JNZ2tyN1VDV21vWFlXOGYrMmx4UFZtd09UTUNUQXlzUkFIcWxtWjJ3OG1Lcy9UCkRYQ25oeDJ4R2R1N00wVTdpckpDRlFZMnJ6Q1p2ZzVyZFlDOFdPOUxWQ2czWTFMbWo0MjBvYitGYXhwMEpSaEc0bitHME14cGQzd2YKY2kwQUJpNTJTSlVqUjk1MXlJT2NFdGw2cGFkWE00ZEhYejIra0Y0TVJ5YVlXcytpRHVjeUs0OVdqUVM4Z09Gcm9yVzIwOThaNGZyNAo5c1JBc3I2RWNuK21uMGU5RUN1bjM0Q1BQZXBNSmlIc3lvOFVQWXhHaXYreWp1UXJNZGdyM2lBUTNBS1p4T2pZd3FOdXpUVkhzaWFOClZ0UDcxVHFTczE2YkdHK2w0Wlo4VFBySFZRa0JDQWJlTnN2V1J3V3NNSVBqUEJLYVp5Q0dpbnM3UFdNeTFhdXplc0psMmVTUUluck4KZGNqd1NsdktlYTF0OHNSSFJnWmgrRGQ1Z2NScDc0d01Ga1EzTUx6U2xZT2t6WTV6bkxlR3pKRDNZTUR0WXJoVzJwYTVRQ3ZZV3BSQQpYTm1VZGpNNlg0ZTNKcWlqU29ISUJlckhEeFE5MmNUeDNZWDRJWWNaVm82ZzFtVEc1RGNBWWtWcjRSeGlIYVBqczdhUFNJYjZUTDZUClowdE5mTjlOWk1UN1REKzFPWVZWdnlHQ0M5N3diWVBsVE9qYzRyUmZUU0NwRnYyUDMxVlhoUTNQaFVVeG1abk0xcCtObjRqbnI5NWMKNkwxVE9IcHkwdHJSbmNpd1BKL0gwZlA5MnZpNmpqMks0MDRzZEN0TVhaSmhhTzU2OVFUczNqeE0vSHZzR2k2UFVaemczUXFHb0J4NgprRGEyOElnRnJsN1g3Z29MWmNCZ1VreS94aG9DeGQ4VHV4bWw4SUZTNndqSEdRKys0cGtxNENmQVcrOUxDL1ZvZkJtSUdwZjBhQld4CkRDR2xQTzVpWUk3UDNPV2dwWERRaEZmc2hrSlI2SEsrUzNKU1JFZGU0dXh4TElxSjYveGhoekd6NDB3K2Q3bW9FK3FXWng3ei9ZVGsKS3I3VGRwczZIOHRZeGJoZjArOEp4VU92bmpPSll6blAxb0hjemZ4SGNpUm5NZGlydkVMZ1o4RHFoQTRCdkUwOW5tWjNzTWovd0hrawo3Zk1rcUIrYUE4VkQrQVF1RnMxNGxBYndLbStRSVhpZmYvYmN4SXFvU0FjWWthd3JsWDZ6TkNpbHBPZmZaazhjUnpsWW1Sa1dUa2hUCmFqZ2tiOWNsenpVODd4R05pWUg2cys0aHZxT2diV0ZrSFE2ODk2VlRFSVZzbWtjTEltbUdPc0tUV1dnRFhzY3AvVHJDalZKMklPWXMKbUdMYjFtdDlVVEl2QVRBand4TmtJaWZ5Uk1na2N5YkxIUHR1YUJqR0JiRTFSTWpjWFBoL1FxYksrU2pKMDlmMU8rdE1ObmlqM3lUMAoxdTdpL0ZCY29IcXdTTjFpVVk2RTJNKzdMWi9YYjFBTWhsZEE0alF2T3hCSkl4YkY2SXFSODlCbEh2V2xyODNqU1k1bFdZZEJlOXVaCmlFTnpZdWVtYkh3aGxJdTg0dnNRZk13L015eXFlWVhkRGsvb25zY0xybmllc2ZwNEdtQTlXYTRtMjdwWGt5NEwrM09abGpnOUJIRWkKdlFzNVJwWWVFejNNL0ErQXFsZ2poSnVVTnhrK24rcjJOYU44QVFUWmxjdEp1V29sb0Z5clNUWEF1MDYwaFJwcmFYa1dCaXlreWZIMAp1TGlPdWpEWGJwTWhZUTJleWVLN2lZK0ZERU5hT1BSNUlrOStoOHlaWk5jd1g4OTJqN0s3UEdCQm9xT1loNjBqcW81N2JtTGREWlBLCmZZVXRBZWhNR1VKd3AvcXBCM3JFNFVpV00rSERrYVRXRVp6NTQxOFYyWHdwWkZrVmxTSFNFOEx5ZUlVZEF2M3dZcUVoRzRZT3lPZ0gKN3h6SEY5VHNoUGdzaFBuMWRhaVlJWG5FRStxbzRNeitHd1ZQWGRFKzlFOTdEcEJEN21JMnNENElqRTBFUTFVdTFPcndRUTdqUStDVQozazA2d0E2Rm5qTGJHdnVURW1rdUlieU5qeEZibStFN1BDRnZLU0xicVRDTm15UHRnZGRoVE9qZUZFN3dDdGNDT2lnT1Q2bzdXMGQ3Cm5mVXZ0WTR1VC9iYm5uZTkwLzJaM2tUUHdZbnpsUjlIZVZLYXp0U0pXM3V3UGROK1VHVXF5VXlHMHNnY1RZUjBTWmMyaTNpRzloR3YKaEJpVmZnVE1pYzgvQVFBb2ZYM29GVmMvejRSM0pkTnNDdjQzT1pMVmNhUXh3U09Wa3g4MkhoVDUrYk5SeithQjQvaGZXb2NURHc4LwpnY3ZaM0F6S3lQY0VnaDBUSC9OUE56NGxqdUJ4UzB6ZUpzcWljV0pBSW5RQkd5b3B3ZTVpYloyd2Q0MWpJVXN3NitGSjB1N2R0NzA1CkhDb0t6WHgyYjN5ZnZ6ZTlEcVdmOEFVb2RqeHdVMzhBMVpyamtEQ3NhNDRqNWhIZDBHWFlTaUhRdnNVVVMzb1JsbGtkbnAyOVVnOXEKUCtRZ1dLNDU0bGx5TlovTHAvMTNuVDl3aTZiV2xJTXlISlVqalB3SmNKWXpBY25IOGNTOUozSGZpY0hBU28rZjZNV01rOWIyLzJRbwoyNTljS2ZYczMyZUVXQkVCeitWTEQwRitNdDZNeVk0cDlxakJPS2F4ZTRldkc2cHpRcHpONHl0SUtpenhQWS96SzRXczVIQThUaU9JCmZaMGZ1T09HYXIraXplRDBHSU1FMTNtYXJrTThCY0hLeUVnbW1zSjRONGJ5SDFUWnUvczVKR3k0dXM5YWpJbWNDV0lwSmdDb1J0ZU4KSWEyVnlsYjQxWlBFaG1qdXVNOHJkNlhRZllNSUtFUktNRCsvbS83bE9QOHd3TDErNDB5aHVoUk0zNkdxbkFMQVNWanVkZW1vaEdleQp5UFVTY2lraGsrak42V2lNanh1Z3NJRzcrZWl6N213WW9kRjZSUWlKckFoLytlNFg5VnN4Y1o4M3lwbjArLzlqZFNRL0hZOTRRRktjCmY2RVFidXBici9ZMzE1RWN4aTg1Rm9IVlZpZ203cmpsZDAydVBNVEJEdEhOQzVNRzNzWTNETFc2R2RVNkhsQllTS2l5TWlTUG53d24KaytwR2tyM3NRU2lPRDRibk9xcCtZV0JnaDBDbkpjb0VYRCtCUkNqWmR0RGNTVzFzcytCNWM0SDUyZXhNWlM4K1d0OUxySDNnZ292QQprSW5XQ1dQUWRlZEkvWVM5bnJ0aTJpdEhmcjRPN3A3T2RmRGo0bWhkbFdNUjYyYUduUjBNclZxZE9DSE1LbjI5MDNveEpsWVAxTzN1CnFUeXBaZi9pcExYTW1lVFhaaDRwTUJFNUhLOUxrbGgzQkVaUjJ4TTNsaHlQcElkUU5iQWlUeHlrMlhQNnR3ek96L1E3Y2laMmJzL1UKM2U4dy9iTi9zSTdrVUw5eDRsWHNyQXgvZElHaWRaLytMK3BJK25ocDR3ZjhDV1lLUXlhUmQyaTdSSkUwcTVMcG9adDNRZS9kWTRqZgpyV1VLSTNRS3hhNFlQd2pTZXh2T3g2ZVdaVkxXZHFJZTBlZEV0aXZXR0krWTZNcnNOUEhrM1ZyR1B2eGg2NXJ0QllRTVpHQm9KWWNECmFRbjh1RCtGUCtZaDFsUG5XUlJOYTYzUk84VElTTmcyQkQwYXQrTXp0amlsNmszNmZLZkxqRWQxVXVjdEYzN0VhUGxFSGpQY1pFU2oKbGd1TXJ1SHIvTkhHdHliRk5MK2FvVXZSd3d4SUFUYVg3NkRiMlZZd3lYVStXM3B4dkovcTkwS1B5M2pETjhET005RkgxaEw5MStlUgovS3lXLzFtdmp0RDRPS2RreW5RQkhaVDhVeXlTVHRmcEdQS3J2VGFmcjJPWnB3aGU4QW9WTlhndXU0VmhXZ1pBQURxM2RXRERDOTdFCkRzaWUyTUhua1pnZ3hPRUsxUllGUnlTTU5zcVkxanI0OE9GVzUzQnlmb1lsc21lMi9OZUQxSHZJRXFRT2NzVjdrNUFBMHRDRllGcVAKVWNiOUtaUit2RUhzQnM1b2FnUTJ2UGc1R0I4NTk3d3ZUYWdxT3VOOEdsZG9BbDRKOEJEbmpTdzhqWFhNNkhtU1ZENTIySzBuSng4MQpRbk1ocEJKa1RpV09ZdzhXZWo3VGkzNmV5YnVmZDFNMjRtRDNBcUh4MFFwZW5jc2gxQkpOa2ZDVERLMUl5ZVdwbnYzTHVMQnJhdHZkClhNOHo4YWJSLzBrZHliUHhQV25tK1pGNFlGWVM5Wit2STNuZVBSelhzUXBkREh0STJNVHVPV3RHR3hPSU1ubXhFODd0eklvZnRJUEMKMHNLSUFrMGFlR2VHUGVpS0RvU0Z4K2taeWJkNGE4UG1oV091SkV2bVBqMGdJYnE4ZnBiY3J2UTBwYkRoaGlRMWU0Yk1NUndmZTJuTAp2dURGNk9nRlc2czg4TGtxQ2VWcC9RUlFVaEd5N3FSMUhTTnBmVUFVQzBMTzFuOEtPUXJoQ2pxZjZndG45U3luaUtUcEJaOW44cU1iClV2WUNxUi9jNDlMbmtvYWZ6d3JKS0VJb1FrRHkyY1o2ZytxaW4zenJjNzJRb0phZlp3TGZrZG9oLy81OTE5WGRhNXNwOFBtMjdzL3EKU0lDdmJjL0dPN3p2TGYvTVBQN2krS2tUTjF6OVFjM3VmYjFHVi95QjJDT01vaWNqZDMza1UvM01BNDVrZERFMTJFTUNRZHQ4VlM5UQprSDk5NW13aGxacHd6SC9YdTI5UDAzWjJDc2E2bmJsY3R4azFGdkJDZkpPZU9zaFZGM1VzSTlybkNzVWR0eGJtcktGVjM0VllkaTdRCjZhREMzNmp3b3VpNWJDdTM1VkpGcis3K2JPcjZ3dUc2MVBqWG41UW52eVJQejg0emljUjhTN3dtL1hyU05aR2FUNmgyZ3pwRjF3UjYKOFdFdStpa2dRdjEwSGJ3MWZBbGN4WDBMOGVwWHp5TjUxaXR6L2x5YjgvR21rSXBJQ2dtM3gvNHQ1NUY4UFVleWpoOHlDcG5NT0dvUApVRDlxVVRDeWJ5SnlHWnU4NEp2K1pqa1Q2VTg4YXovWmJTbCtsS01zU2xhUVFUSU9XQnZLMlBEV3UwTXVHRlEzWVpCWkVBMXYwU3ZFCmhxb0tuT1E0M1RhUE9NcGdWdm05cjJNa0Y3dGNDQ3hjbEVRbUt3WXNKTTVvb2hTYklVUHdyZk9xNkxsTW54V2xkYythTTloVVd2ZHIKVEVCUHhzc1NMai9Oa1pBOGhRVHplU2JYK2Q3bGdrVWs1RHRtSVlRaVY3ckpPdGo1eHpGVG80ZmtwZ0RMVnlQV3FYN1g5eTd5WnUvOQorL2RKcDMvU1VTYWNoRjNrNkJ4UmxJb2ZFRTM3bEsvejNJSnI1amJrNUw2ZnpZTVpjSnpIM3pIZVRzKy80amJmblZmZU40VGFpUXBVCk1ueGI5NEdISGZhRUhlbHAxdUsxdzJ1a0lEZkZKcUZOTXlObm5yaCtkcStMV1FJcXNFSG9abXMwSThXOUhSUlowSFUwRDR1S2RWaHMKN1IwNWdScGNNVXk4ckFlcitsTDRlclI3Sjh2NktlUlljVU5UZE5DNnVQNGpya2wzWTNyTlBGK2wwN05iUXhMc2RFZ2RDWHlsN0VCbAo0anJmMitGSVdWY2lnWEdOSGdBalNtbWhiUEZwTEh3a3VTQTd4Zk0vUTQ0ZG1aNW9NT21IUW4zWHhzaVg4Vm9TUWNCVHhIK2JJMWtuCmNvd2gyY1lldll3Y0dLSXBVQ3c2bFNNNW13Zm5XSjZ0bzQ4dll4anJIM2lUTjJEd0ljREF4QVpnV281QUhGVTVzeSs0QU9PN0c1UEkKVjJnKzFJY05kNFA1Tks4VkdjVEsxNXpQR1QzaUhOT0g3aVgvd1NjbDRKRWZkS1REWTByY2k1NFN1UkU2aU1xVVlVQ1VxMnpMY0FucQpISXcwSnFsb1MyOEhiOEhTSE5NenR4Sk81aG5UajlhaFM4NHBFSkRZZHZXT1IrVk04aW85eThiNXFFYjZCRVhISEluUy9BMGhiM2lWCjcwNkQ2czFKSkRBQ2w5TnFFbDE0RHhqekVqMW5wSXRjYzJJOFB1TVQ1bW9kZ2NnNG1id0tZSDMyLy93SG1mSDVtZld2QUFBQUFFbEYKVGtTdVFtQ0MiIC8+Cjwvc3ZnPgo=");
    height: 80px;
    padding: 14px;
    color: #FFF;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-size: cover;
    border-radius: 10px;
    line-height: 18px;
}
._tchainPayWithTokoFee input[type="checkbox"] {
    margin-right: 10px;
}
._tchainPayWithTokoFee label {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    height: 16px;
    left: 10px;
    position: absolute;
    top: calc((100% - 15px) / 2);
    width: 16px;
}

._tchainPayWithTokoFee label:after {
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

._tchainPayWithTokoFee input[type="checkbox"] {
    visibility: hidden;
}

._tchainPayWithTokoFee input[type="checkbox"]:checked+label {
    background-color: #66bb6a;
    border-color: #66bb6a;
}

._tchainPayWithTokoFee input[type="checkbox"]:checked+label:after {
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
._tchainPaymentFormAction ._tchainButtons ._btnSubmit{
    border: 1px solid #21409A;
    border-radius: 30px;
    text-align: center;
    cursor: pointer;
    height: 40px;
    line-height: 38px;
    background: #21409A;
    color: #FFF;
}
._tchainPaymentFormAction ._tchainButtons ._btnSubmit.disable {
    background: #979797;
    color: #000;
    border-color: #979797;
    cursor: not-allowed;
}
._tchainPaymentFormAction ._tchainButtons ._btnCancel{
    background: #FFF;
    color: #21409A;
}
._hide {
    max-height: 0 !important;
}
._tchainPaymentTokenList { margin-top: 16px;}
._tchainPaymentToken {
    padding: 16px;
    background: #FAFAFA;
    border-radius: 16px;
    border: 1px solid #E0E0E0;
    margin-bottom: 16px;
    box-sizing: border-box;
    padding-bottom: 0;
}
._tchainPaymentToken.active{
    background: rgba(79, 112, 194, 0.2);
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
    border-color: #21409A;
}
._tchainPaymentTokenHeader ._tokenAction input[type="radio"]:checked+label:after {
    opacity: 1;
    transition: 0.2s;
}

._tchainPaymentTokenHeader ._tokenAction label {
    background-color: #fff;
    border: 1px solid #21409A;
    border-radius: 50%;
    cursor: pointer;
    height: 25px;
    right: 0px;
    position: absolute;
    top: -10px;
    width: 25px;
    transition: 0.2s;
}

._tchainPaymentTokenHeader ._tokenAction label:after {
    border-top: none;
    border-right: none;
    content: "";
    height: 15px;
    left: 4px;
    opacity: 0;
    position: absolute;
    top: 4px;
    width: 15px;
    background: #21409A;
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
    background: rgba(255, 216, 141, 0.4);
    margin: 0 -16px;
    padding: 16px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}
._tchainPaymentToken ._tchainPaymentTokenContent ._item ._totalAmount{
    color: #0E843A
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item ._totalAmount{
    color: #FFF;
}

._tchainPaymentToken.active ._tchainPaymentTokenContent ._item:last-child{
    background: #21409A;
    color: #FFF !important;
}
._tchainError {
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #C52D2D;
    padding: 10px 0;
}

</style>
`;