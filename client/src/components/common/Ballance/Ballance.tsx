import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { userGetBalanceThunk } from "../../../redux/reducers/accountSlice"
import style from "./Ballance.module.css"

import vipTarifs from "../../../utils/vipTarifs.json"

const Ballance = () => {
    const balance = useAppSelector(state => state.account.balance)
    const email = useAppSelector(state => state.account.email)

    const [vipLevel, setVipLevel] = useState(0)

    useEffect(()=>{
        vipTarifs.slice(0).reverse().every(t => {
            if (balance >= t.balancerequired){
                // console.log("Your vip is"+t.vipLevel)
                setVipLevel(t.vipLevel)
                return false
            }
            return true
        })
       
    }, [])

    const dispatch = useAppDispatch()

    const updateBalance = () => {
        // console.log("updateBalance")
        triggerFade()
        dispatch(userGetBalanceThunk())
    }

    const [update, setUpdate] = useState(false)

    const triggerFade = () => {
        setUpdate(prevState => {
            return !prevState
        })
    }

    

    

    return (
        <div className=" flex text-left justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-xs">
            <div>
                <h2 className="text-gray-900 text-lg font-bold float-left pr-2">Total Ballance</h2>
                <span className="cursor-pointer" onClick={!update ? updateBalance : ()=>""}><FontAwesomeIcon onAnimationEnd={triggerFade} className={update ? style.updateImg : ''} color={`var(--color22)`} size="sm" icon={faRotate} /></span>
                <h3 className="mt-2 text-xl font-bold text-yellow-500 text-left">{`${balance.toFixed(2)} TRX`}</h3>
                <p className="text-xs font-semibold text-gray-400">{email}</p>
                {/* <button className="text-sm mt-6 px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg  tracking-wider hover:bg-yellow-300 outline-none">Get order</button> */}
                {/* <div onClick={updateBalance} className="absolute top-0 right-0 text-center cursor-pointer"><FontAwesomeIcon onAnimationEnd={triggerFade} className={update ? style.updateImg : ''} color={`var(--color6)`} size="sm" icon={faRotate} /></div> */}
            </div>
            <div
                className="bg-gradient-to-tr from-yellow-500 to-yellow-400 w-32 h-32  rounded-full shadow-2xl shadow-yellow-400 border-white  border-dashed border-2  flex justify-center items-center ">
                <div>
                    <h1 className="text-white text-2xl">VIP {vipLevel}</h1>
                </div>
            </div>
        </div>
    )
}

const NewBalance = () => {
    return (
        <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
            <div>
                <h2 className="text-gray-900 text-lg font-bold">Total Ballance</h2>
                <h3 className="mt-2 text-xl font-bold text-yellow-500 text-left">+ 150.000 ₭</h3>
                <p className="text-sm font-semibold text-gray-400">Last Transaction</p>
                <button className="text-sm mt-6 px-4 py-2 bg-yellow-400 text-white rounded-lg  tracking-wider hover:bg-yellow-300 outline-none">Add to cart</button>
            </div>
            <div
                className="bg-gradient-to-tr from-yellow-500 to-yellow-400 w-32 h-32  rounded-full shadow-2xl shadow-yellow-400 border-white  border-dashed border-2  flex justify-center items-center ">
                <div>
                    <h1 className="text-white text-2xl">Basic</h1>
                </div>
            </div>
        </div>
    )
}

export default Ballance