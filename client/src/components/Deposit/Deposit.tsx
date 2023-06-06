import { faFileInvoiceDollar, faLandmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../redux/store"
import Ballance from "../common/Ballance/Ballance"
import style from "./Deposit.module.css"


const Deposit = () => {
    const depositWallet = useAppSelector(state => state.account.depositWallet)
    const textAreaRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        let timer = setTimeout(() => setCopySuccess(false), 2000)
        return () => {
            clearTimeout(timer);
        }
      }, [copySuccess])

      const copyToClipboard = () => {
        // console.log("copyToClipboard")
        if(copySuccess === false){
            navigator.clipboard.writeText(depositWallet)
            setCopySuccess(true)
            // console.log("setCopySuccess")
        }
        
      }

    return (
        <div className={style.mainContent}>
            <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
                <div className="mt-4">

                    <div className="mt-4 mb-4">
                        <Ballance />
                    </div>

                    <p className="text-sm font-semibold mb-5">Deposit TRX</p>
                    {/* USDT wallet */}

                    <div className="border p-2 border-dashed rounded-md border-blue-500 mb-5">
                        <div className="w-full -mt-5">
                            <p className="px-4 py-0.5 rounded-full w-fit bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">TRX</p>
                        </div>
                        <div className="mb-0">
                            <div className="pt-4 pb-6 relative flex wrap items-stretch w-full text-left">
                                <div className={style.formControl}>{depositWallet}</div>
                                <div>
                                    <button style={copySuccess ? {background: `#33f37d`}: {}} onClick={copyToClipboard} className={style.copy}>{copySuccess? "COPIED" : "COPY"}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mb-1 text-xs">Copy the wallet address and make a transaction</p>
                    <p className="mb-1 text-xs">Funds will be credited within 15 minutes</p>
                    <p className="mb-5 text-xs">* Minimum deposit 40 TRX</p>

                    {/* Payment History */}
                    <div className="mb-5">
                        <div className="border border-dashed rounded-md border-violet-500 py-2">
                            <div className="flex m-1">
                                <div className="w-1/12 " >
                                    <FontAwesomeIcon color={`var(--color6)`} size="lg" icon={faLandmark} />
                                </div>
                                <div className="w-8/12 text-left self-center">
                                    <span className="text-xs font-bold text-violet-500 pl-3">DEPOSIT HISTORY</span>
                                </div>
                                <div className="w-3/12 self-center mr-1">
                                    <Link to="/deposithistory" className="bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs p-1.5 rounded block w-full text-center" >VIEW</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Deposit