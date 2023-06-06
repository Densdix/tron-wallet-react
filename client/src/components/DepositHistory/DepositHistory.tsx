import { faCheckDouble, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { IDepositHistoryResponseData } from "../../api/api"
import { userGetDepositHistoryThunk } from "../../redux/reducers/accountSlice"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import style from "./DepositHistory.module.css"
import tether from "./img/tether.svg"

const DepositHistory = () => {

    const dispatch = useAppDispatch()
    const depositHistory = useAppSelector(state => state.account.depositHistory)

    useEffect(() => {
        dispatch(userGetDepositHistoryThunk())
    }, [])

    const [hasDeposits, setHasDeposits] = useState(true)

    return (
        <div className={style.mainContent}>
            <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
                <div className="mt-5 pb-16">
                    <p className="text-sm font-semibold mb-5">History of your deposits</p>
                    {depositHistory.length === 0
                        ? <p>You have no deposits</p>

                        : <div>
                            {depositHistory.map(item => <DepositHistoryCard amount={item.amount} createDate={item.createDate} status={item.status} />)}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

const DepositHistoryCard: React.FC<IDepositHistoryResponseData> = ({ amount, createDate, status }) => {

    let correctDate = createDate.toString().split('.')[0].split('T')

    return (
        <div className="w-full ml-auto mr-auto px-4 max-sm:px-4 text-center">
            <div className="rounded-xl p-3 mb-4 px-4 bg-[var(--color9)] shadow-md">
                <div className="flex m-1">
                    <div className="w-10/12  text-left self-center pt-1">
                        <p className="text-sm font-bold text-gray-800">{amount} TRX</p>
                        <p className="text-xs  text-gray-800">{`${correctDate[0]} ${correctDate[1]}`}</p>
                        {status 
                        ? <p className="text-green-600 font-bold">Success</p>
                        : <p className="text-red-600 font-bold">Error (amount less then 40 TRX)</p>}
                    </div>
                    <div className="w-2/12 self-center mr-1">
                        {status
                            ? <FontAwesomeIcon color="#16a34a" size="lg" icon={faCheckDouble} />
                            : <FontAwesomeIcon color="#dc2626" size="lg" icon={faXmark} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DepositHistory