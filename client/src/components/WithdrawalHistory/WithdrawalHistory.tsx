import React, { useEffect, useState } from "react"
import style from "./WithdrawalHistory.module.css"
import tron from "./img/tron-trx-logo.svg"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { userGetWithdrawalHistoryThunk } from "../../redux/reducers/accountSlice"
import { IWithdrawalHistoryResponseData } from "../../api/api"

const WithdrawalHistory = () => {

    const dispatch = useAppDispatch()
    const withdrawalHistory = useAppSelector(state => state.account.withdrawalHistory)

    useEffect(() => {
        dispatch(userGetWithdrawalHistoryThunk())
    }, [])

    const [hasDeposits, setHasDeposits] = useState(true)

    return (
        <div className={style.mainContent}>
            <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
                <div className="mt-5">
                    <p className="text-sm font-semibold mb-5">History of your withdrawals</p>
                    {withdrawalHistory.length === 0
                        ? <p>You have no withdrawals</p>

                        : <div>
                            {withdrawalHistory.map((item, idx) => <WithdrawalHistoryCard key={idx} amount={item.amount} createDate={item.createDate} status={item.status} />)}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

const WithdrawalHistoryCard: React.FC<IWithdrawalHistoryResponseData> = ({ amount, createDate, status }) => {

    const [expanded, setExpanded] = useState(false)
    let correctDate = createDate.toString().split('.')[0].split('T')

    return (
        <>
            {
                expanded
                    ? <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-left bg-[var(--color20)] shadow-md p-2 rounded-md mb-2">
                        <p className="text-left font-bold"><img className="w-8 inline-block mr-2" src={tron} alt="" /> TRX</p>
                        <div className="grid grid-cols-3 my-2">
                            <div className="border-r">
                                <p className="">Amount</p>
                                <p className="text-xs font-semibold">{amount} TRX</p>
                            </div>
                            <div className="pl-2">
                                <p>Status</p>

                                {status
                                    ? <p className="text-xs text-green-500 font-semibold">Success</p>
                                    : status === null ? <p className="text-xs text-amber-500 font-semibold">Pending</p>
                                        : <p className="text-xs text-red-500 font-semibold">Error</p>}
                            </div>
                            <div className="border-l pl-2">
                                <p childrentext-xs>Date</p>
                                <p className="text-xs">{`${correctDate[0]} ${correctDate[1]}`}</p>
                            </div>
                        </div>
                        <p className="text-xs">Code: {createDate.toString().replace("-","").replace("-","").replace("T", "").replace(":","").replace(":","").replace(".","").replace("Z","")}</p>
                        {/* <p className="text-xs">Obs: Wsh happend here</p> */}
                        <p onClick={() => setExpanded(false)} className="text-xs text-center pt-2 cursor-pointer">Hide Details</p>
                    </div>
                    : <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-left bg-[var(--color20)] shadow-md p-2 rounded-md mb-2">
                        <div className="grid grid-cols-2">
                            {status
                                ? <p className="text-left font-bold text-green-500"><img className="w-8 inline-block mr-2" src={tron} alt="" />Success</p>
                                : status === null ? <p className="text-left font-bold text-amber-500"><img className="w-8 inline-block mr-2" src={tron} alt="" /> Pending</p>
                                    : <p className="text-left font-bold text-red-500"><img className="w-8 inline-block mr-2" src={tron} alt="" /> Error</p>}
                            
                            <p className="text-right font-semibold">{amount} TRX</p>
                        </div>
                        <p onClick={() => setExpanded(true)} className="text-xs text-center pt-2 cursor-pointer">Expand Details</p>
                    </div>
            }
        </>
    )
}


export default WithdrawalHistory