import React, { useEffect, useState } from "react"
import style from "./Vip.module.css"
import vipImg from "./img/vip.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom"
import Ballance from "../common/Ballance/Ballance"
import vipTarifs from '../../utils/vipTarifs.json'
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { userGetTaskCountThunk } from "../../redux/reducers/accountSlice"

const Vip = () => {
    
    const balance = useAppSelector(state => state.account.balance)
    const [vipLevelsAvailable, setVipLevel] = useState(0)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        vipTarifs.slice(0).reverse().every(t => {
            if (balance >= t.balancerequired){
                // console.log("Your vip is"+t.vipLevel)
                setVipLevel(t.vipLevel)
                return false
            }
            return true
        })
       dispatch(userGetTaskCountThunk())
    }, [])

    // const vipLevelsAvailable = 2

    const vipColors = [
        { gradientFrom: "#1e293b", gradientTo: "#0f172a" },
        { gradientFrom: "#0284c7", gradientTo: "#0f172a" },
        { gradientFrom: "#0369a1", gradientTo: "#0f172a" },
        { gradientFrom: "#075985", gradientTo: "#0f172a" },
        { gradientFrom: "#1d4ed8", gradientTo: "#0f172a" },
        { gradientFrom: "#1e40af", gradientTo: "#0f172a" },
        { gradientFrom: "#4338ca", gradientTo: "#0f172a" },
        { gradientFrom: "#3730a3", gradientTo: "#0f172a" },
        { gradientFrom: "#a21caf", gradientTo: "#0f172a" },
        { gradientFrom: "#86198f", gradientTo: "#0f172a" }
    ]

    return (
        <div className={style.mainContent}>
            <div className="mt-4">
                {/* Balance */}
                <div className="mb-4 px-24 max-sm:px-4">
                    <Ballance />
                </div>
                <div className="pb-16">

                    {vipTarifs.map(item => <VipCard 
                        key={item.vipLevel}
                        vipNumber={item.vipLevel}
                        vipLevelAvailable={vipLevelsAvailable}
                        investSumm={`${item.balancerequired} TRX`}
                        lv1ReffFee={item.referalBenefits.A}
                        lv2ReffFee={item.referalBenefits.B}
                        lv3ReffFee={item.referalBenefits.C}
                        gradientFrom={vipColors.at(item.vipLevel)?.gradientFrom!}
                        gradientTo={vipColors.at(item.vipLevel)?.gradientTo!} />)}

                    {/* <VipCard vipNumber={1} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 10.00"} videoAvaliable={3} reward={"$ 0.23"} gradientFrom={"#1e293b"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={2} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 20.00"} videoAvaliable={4} reward={"$ 0.42"} gradientFrom={"#0284c7"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={3} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 45.00"} videoAvaliable={4} reward={"$ 0.95"} gradientFrom={"#0369a1"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={4} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 70.00"} videoAvaliable={4} reward={"$ 1.47"} gradientFrom={"#075985"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={5} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 110.00"} videoAvaliable={5} reward={"$ 2.53"} gradientFrom={"#1d4ed8"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={6} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 250.00"} videoAvaliable={5} reward={"$ 5.75"} gradientFrom={"#1e40af"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={7} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 670.00"} videoAvaliable={6} reward={"$ 15.41"} gradientFrom={"#4338ca"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={8} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 1150.00"} videoAvaliable={6} reward={"$ 29.90"} gradientFrom={"#3730a3"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={9} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 2203.00"} videoAvaliable={6} reward={"$ 57.28"} gradientFrom={"#a21caf"} gradientTo={"#0f172a"} />
                    <VipCard vipNumber={10} vipLevelsAvailable={vipLevelsAvailable} investSumm={"$ 4105.00"} videoAvaliable={7} reward={"$ 107.90"} gradientFrom={"#86198f"} gradientTo={"#0f172a"} /> */}
                </div>

            </div>
        </div>
    )
}

interface IVipCard {
    vipNumber: number
    vipLevelAvailable: number
    investSumm: string
    lv1ReffFee: number
    lv2ReffFee: number
    lv3ReffFee: number
    gradientFrom: string
    gradientTo: string
}

const VipCard: React.FC<IVipCard> = ({ vipNumber, vipLevelAvailable, investSumm, lv1ReffFee, lv2ReffFee, lv3ReffFee, gradientFrom, gradientTo }) => {
    const navigate = useNavigate()
    let isActive = false
    let isPassed = false
    if (vipLevelAvailable === vipNumber) {
        isActive = true
    }
    if(vipNumber < vipLevelAvailable){
        isPassed = true
    }

    const activeVipStyle = {
        backgroundImage: `linear-gradient(to right, ${gradientFrom},${gradientTo}`,
        boxShadow: isActive ? '0px 0px 5px 4px #FF9919' : ''
    }

    return (
        <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
            <div className="grid grid-rows-1">
                <div>{isActive &&
                    <p className={classNames(style.arrowRight, style.bounceInRight, "right-14 max-sm:right-4 bg")}><Link state={{ vipNumber: vipNumber }} to="/vip"><FontAwesomeIcon color={"orange"} size="sm" icon={faChevronRight} /></Link></p>}
                    <div style={activeVipStyle} className="rounded-xl p-3 mb-4 px-5">
                        <div className="flex m-1">
                            <div className="w-2/12 " >
                                <img className="w-12" src={vipImg} alt="vipImg" />
                            </div>
                            <div className="w-2/12  text-left self-center pt-1">
                                <p className="text-3xl font-semibold text-white">{vipNumber}</p>
                            </div>
                            <div className="w-8/12 self-center mr-1">
                                {isActive
                                    ? <Link state={{ vipNumber: vipNumber }} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs p-1.5 rounded-full block w-full text-center font-nunito" to="/vip">CURRENT VIP</Link>
                                    : isPassed ? <button disabled onClick={() => console.log("Reduce balance to buy current vip")} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs p-1.5 rounded-full block w-full text-center font-nunito">PASSED</button> 
                                    : <button onClick={() => navigate('/deposit')} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs p-1.5 rounded-full block w-full text-center font-nunito">DEPOSIT BALANCE</button>
                                }
                            </div>
                        </div>

                        <div className="container mx-auto">
                            <div className="-mx-4 flex flex-wrap">
                                <div className="w-full px-4 ">
                                    <div className="max-w-full overflow-x-auto rounded-md">
                                        <table className="w-full table-auto">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-blue-500 to-teal-500  text-center">
                                                    <th
                                                        className="text-xs py-1 px-2 font-semibold text-white leading-3"
                                                    >
                                                        Required Amount
                                                    </th>
                                                    <th
                                                        className="text-xs py-1 px-2 font-semibold text-white leading-3"
                                                    >
                                                        Withdrawal Fee (%)
                                                    </th>
                                                    <th
                                                        className=" text-xs py-1 px-2 font-semibold text-white leading-3"
                                                    >
                                                        Refferal Fee A (%)
                                                    </th>
                                                    <th
                                                        className="text-xs py-1 px-2 font-semibold text-white leading-3"
                                                    >
                                                        Refferal Fee B (%)
                                                    </th>
                                                    <th
                                                        className="text-xs py-1 px-2 font-semibold text-white leading-3"
                                                    >
                                                        Refferal Fee C (%)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        className="text-dark py-1 border-b border-[#E8E8E8] bg-[#F3F6FF]  text-center text-xs font-medium"
                                                    >
                                                        {investSumm}
                                                    </td>
                                                    <td
                                                        className="text-dark py-1 border-b border-[#E8E8E8] bg-white  text-center text-xs font-medium"
                                                    >
                                                        1
                                                    </td>
                                                    <td
                                                        className="text-dark py-1 border-b border-[#E8E8E8] bg-[#F3F6FF]  text-center text-xs font-medium"
                                                    >
                                                        {lv1ReffFee}
                                                    </td>
                                                    <td
                                                        className="text-dark py-1 border-b border-[#E8E8E8] bg-white text-center text-xs font-medium"
                                                    >
                                                        {lv2ReffFee}
                                                    </td>
                                                    <td
                                                        className="text-dark py-1 border-b border-[#E8E8E8] bg-white text-center text-xs font-medium"
                                                    >
                                                        {lv3ReffFee}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Vip