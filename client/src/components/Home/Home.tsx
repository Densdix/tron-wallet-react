import React, { useEffect, useState } from "react"
import style from "./Home.module.css"
import user from "./img/user.png"
import tronLogo from "./img/tron.jpg"
import systemUpdate from "./img/systemUpdate.png"
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSackDollar, faMoneyBillTransfer, faPeopleGroup, faPaperPlane, faLandmark, faFileInvoiceDollar, faDollar } from "@fortawesome/free-solid-svg-icons"
import Transactions from "./Transactions"
import { useDispatch, useSelector } from "react-redux"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import Ballance from "../common/Ballance/Ballance"
import FAQ from "../FAQ/FAQ"
import { userIsAuthThunk } from "../../redux/reducers/accountSlice"

const Home = () => {
    const navigate = useNavigate();

    const email = useAppSelector(state => state.account.email)
    const fullname = useAppSelector(state => state.account.fullname)
    const phoneNumber = useAppSelector(state => state.account.phoneNumber)
    const inviterId = useAppSelector(state => state.account.inviterId)
    const balance = useAppSelector(state => state.account.balance)
    const wallet = useAppSelector(state => state.account.wallet)
    const refCode = useAppSelector(state => state.account.refCode)

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
            navigator.clipboard.writeText(`${window.location.origin}/?cod=${refCode}`)
            setCopySuccess(true)
            // console.log("setCopySuccess")
        }
        
      }

    // console.log("Profile RENDER")
    return (
        <div className={style.mainContent}>
            <div className={style.contentWrapper}>

                <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
                <div className="rounded-md p-2 bg-gradient-to-r from-[#ff1010] to-[#ff0037] mb-2 mt-4"><p className="font-bold">This site was created for educational purposes and not for commercial use.</p></div>
                    {/* Header */}
                    {/* Balance */}
                    <div className="mt-4 mb-5">
                        <Ballance />
                    </div>
                    {/* <div className="grid grid-cols-3 mt-5 mb-5">
                        <div className="">
                            <img className={style.userImg} src={user} alt="user" />
                        </div>
                        <div className="col-span-2">
                            <p className="leading-3 mb-4">
                                <strong className="font-semibold">Имя</strong>
                                <br />
                                <span className="text-xs mb-0">{fullname}</span>
                            </p>

                            <p className="leading-3 mb-4">
                                <strong className="font-semibold">Электронная почта</strong>
                                <br />
                                <span className="text-xs mb-0">{email}</span>
                            </p>
                        </div>
                    </div> */}

                    {/* Service Items */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                            <button onClick={() => navigate('deposit')} className="w-full cursor-pointer">
                                <div className="widget w-full p-1.5 rounded-full bg-white border-l-4 border-green-500 shadow-md">
                                    <div className="flex items-center">
                                        <div className="icon w-12 p-2 bg-green-500 text-white rounded-full">
                                            <FontAwesomeIcon color="white" size="lg" icon={faSackDollar} />
                                        </div>
                                        <div className="text-center w-full font-semibold text-base pr-3">Deposit</div>
                                    </div>
                                </div>
                            </button>
                            {/* <div className={style.card}>
                                <NavLink to="/deposit">
                                    <FontAwesomeIcon color={`var(--color6)`} size="xl" icon={faSackDollar} />
                                    <p className="mb-0 text-xs">Депозит</p>
                                </NavLink>
                            </div> */}
                        </div>
                        <button onClick={() => navigate('wallet')} className="w-full cursor-pointer">
                            <div className="widget w-full p-1.5 rounded-full bg-white border-l-4 border-indigo-500 shadow-md">
                                <div className="flex items-center">
                                    <div className="icon w-12 p-2 bg-indigo-500 text-white rounded-full">
                                        <FontAwesomeIcon color="white" size="lg" icon={faMoneyBillTransfer} />
                                    </div>
                                    <div className="text-center w-full font-semibold text-base pr-3">Withdraw</div>
                                </div>
                            </div>
                        </button>
                        {/* <div>
                            <div className={style.card}>
                                <NavLink to="/wallet">
                                    <FontAwesomeIcon color={`var(--color6)`} size="xl" icon={faMoneyBillTransfer} />
                                    <p className="mb-0 text-xs">Вывод</p>
                                </NavLink>
                            </div>
                        </div> */}
                        <button onClick={() => navigate('withdrawalhistory')} className="w-full cursor-pointer">
                            <div className="widget w-full p-1.5 rounded-full bg-white border-l-4 border-amber-500 shadow-md">
                                <div className="flex items-center">
                                    <div className="icon w-12 p-2 bg-amber-500 text-white rounded-full">
                                        <FontAwesomeIcon color="white" size="lg" icon={faFileInvoiceDollar} />
                                    </div>
                                    <div className="text-center w-full font-semibold text-base pr-3">Withdrawal History</div>
                                </div>
                            </div>
                        </button>
                        {/* <div>
                            <div className={style.card}>
                                <NavLink to="/team">
                                    <FontAwesomeIcon color={`var(--color6)`} size="xl" icon={faPeopleGroup} />
                                    <p className="mb-0 text-xs">Команда</p>
                                </NavLink>
                            </div>
                        </div> */}
                        <button onClick={() => navigate('deposithistory')} className="w-full cursor-pointer">
                            <div className="widget w-full p-1.5 rounded-full bg-white border-l-4 border-sky-500 shadow-md">
                                <div className="flex items-center">
                                    <div className="icon w-12 p-2 bg-sky-500 text-white rounded-full">
                                        <FontAwesomeIcon color="white" size="lg" icon={faLandmark} />
                                    </div>
                                    <div className="text-center w-full font-semibold text-base pr-3">Deposit History</div>
                                </div>
                            </div>
                        </button>
                        {/* <div>
                            <div className={style.card}>
                                <NavLink to="/telegram">
                                    <FontAwesomeIcon color={`var(--color6)`} size="xl" icon={faPaperPlane} />
                                    <p className="mb-0 text-xs">Поддержка</p>
                                </NavLink>
                            </div>
                        </div> */}
                    </div>

                    {/* Account is not verrified */}
                    {!wallet &&
                        <div className="mt-6">
                            <div className="rounded-md p-2 mb-3 bg-gradient-to-r from-[#ff1010] to-[#ff0037]" >
                                <div className="m-1">
                                    <div className="text-center pt-1 pl-2">
                                        <p className="text-white">Link your wallet to activate account</p>
                                        <NavLink to="/profile">
                                            <p className="text-white mb-0 text-sm font-bold">Click here</p>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {/* Other Elements In 1 Column By Row */}
                    <div className="grid grid-rows-1">
                        {/* Referal Code Input */}
                        <div className="mb-0">
                            <div className="pt-4 pb-6 relative flex wrap items-stretch w-full text-left">
                                <div className={style.formControl}>{`${window.location.origin}/?cod=${refCode}`}</div>
                                <div>
                                    <button style={copySuccess ? {background: `#33f37d`}: {}} onClick={copyToClipboard} className={style.copy}>{copySuccess? "COPIED" : "COPY"}</button>
                                </div>
                            </div>
                        </div>

                        {/* Telegram Support */}
                        {/* <div className="mb-5">
                            <div className={style.helperItem}>
                                <div className="flex m-1">
                                    <div className="w-1/12 " >
                                        <img className="w-8 m-auto" src={telegram} alt="telegram" />
                                    </div>
                                    <div className="w-8/12 text-left self-center">
                                        <span className="text-xs font-bold text-cyan-600 pl-3">ТЕЛЕГРАМ ПОДДЕРЖКА</span>
                                    </div>
                                    <div className="w-3/12 self-center mr-1">
                                        <a className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs p-1.5 rounded block w-full text-center" href="#">ПЕРЕЙТИ</a>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* Payment History */}
                        <div className="mb-5">
                            <div className={style.helperItem}>
                                <div className="flex m-1">
                                    <div className="w-1/12 " >
                                        <FontAwesomeIcon color={`var(--color6)`} size="lg" icon={faFileInvoiceDollar} />
                                    </div>
                                    <div className="w-8/12 text-left self-center">
                                        <span className="text-xs font-bold text-orange-500 pl-3">WITHDRAWAL HISTORY</span>
                                    </div>
                                    <div className="w-3/12 self-center mr-1">
                                        <Link to="/withdrawalhistory" className="bg-gradient-to-r from-orange-500 to-orange-700 text-white text-xs p-1.5 rounded block w-full text-center">VIEW</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Withdrawl History */}
                        <div className="pb-5">
                            <div className={style.helperItem}>
                                <div className="flex m-1">
                                    <div className="w-1/12 " >
                                        <FontAwesomeIcon color={`var(--color6)`} size="lg" icon={faLandmark} />
                                    </div>
                                    <div className="w-8/12 text-left self-center">
                                        <span className="text-xs font-bold text-violet-500 pl-3">DEPOSIT HISTORY</span>
                                    </div>
                                    <div className="w-3/12 self-center mr-1">
                                        <Link to="/deposithistory" className="bg-gradient-to-r from-violet-500 to-violet-700 text-white text-xs p-1.5 rounded block w-full text-center">VIEW</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Site details*/}
                        <div className="mb-5">
                            <div className="rounded-md py-4 px-1 border-solid border-2 border-[var(--color6)]">
                                <div>
                                    <img className="w-64 rounded-md m-auto" src={tronLogo} alt="creator" />
                                    <div className="text-center">
                                        <p className="mb-1 mt-1 font-semibold">Site datails</p>
                                        <p className="mb-0 italic">This site uses TRON Shasta Testnet</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="mb-5">
                            <div className="rounded-md py-4 px-1 border-solid border-2 border-[var(--color6)]">
                                <FAQ />
                            </div>
                        </div> */}
                        {/* Project Updates */}
                        <div className="mb-5">
                            <div className="rounded-md py-4 px-1 border-solid border-2 border-red-500">
                                <a href="#">
                                    <div>
                                        <img className="w-12 h-auto max-w-full m-auto" src={systemUpdate} alt="systemUpdate" />
                                        <p className="text-center text-xs underline font-semibold pb-3">PET PROJECT UPDATES</p>
                                        <p className="mb-0 font-medium text-xs">
                                            <strong>09.04.2023</strong><br />
                                            - Refferal system. <br />
                                            <strong>10.04.2023</strong><br />
                                            - Updated Dark Mode<br />
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Transactions */}
                    <Transactions />

                </div>

            </div>
        </div>
    )
}



// const TransactionCard = () => {
//     return (

//     )
// }

export default Home