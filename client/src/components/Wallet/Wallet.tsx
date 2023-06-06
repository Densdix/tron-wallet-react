import { faFileInvoiceDollar, faSackDollar, faMoneyCheckDollar, faCircleExclamation, faChartPie } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import style from "./Wallet.module.css"
import negociacion from "./img/negociacion.png"
import Ballance from "../common/Ballance/Ballance"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import withdrawSvg from "../../images/ux-withdraw-light.svg"
import { SubmitHandler, useForm, ValidationRule } from "react-hook-form";
import { userInitWithdrawThunk } from "../../redux/reducers/accountSlice"

const Wallet = () => {
    const wallet = useAppSelector(state => state.account.wallet)
    const balance = useAppSelector(state => state.account.balance)


    return (
        <div className={style.mainContent}>
            <div className="mt-4">


                <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center mt-4">
                    {/* Balance */}
                    <div className="mt-4 mb-4">
                        <Ballance />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4">
                        <div>
                            <button className={style.btn}>
                                <NavLink to="/withdrawalhistory">
                                    <FontAwesomeIcon size="lg" icon={faFileInvoiceDollar} />
                                    <span className="pl-2 mb-0 text-base font-medium pt-1">History</span>
                                </NavLink>
                            </button>

                        </div>
                        <div>
                            <button className={style.btn}>
                                <NavLink to="/deposit">
                                    <FontAwesomeIcon size="lg" icon={faSackDollar} />
                                    <span className="pl-2 mb-0 text-base font-medium pt-1">Deposit</span>
                                </NavLink>
                            </button>

                        </div>
                    </div>

                    {/* Account is not verrified */}
                    {!wallet &&
                        <div className="mt-6">
                            <div className="rounded-xl p-3 mb-4 bg-gradient-to-r from-[#ff1010] to-[#ff0037]" >
                                <div className="flex m-1">
                                    <div className="w-2/12 pt-2" >
                                        <FontAwesomeIcon size="2x" color="white" icon={faCircleExclamation} />
                                    </div>
                                    <div className="w-10/12 text-left self-center pt-1 pl-2">
                                        <p className="text-white text-base font-bold">Your account is not verified</p>
                                        <p className="text-xs text-white font-poppins">Add your TRX wallet address in the "Profile" menu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="mt-8 text-left">
                        <h6 className="text-center">Withdrawal</h6>

                        <div>

                            {/* <div className="">
                                <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-nunito rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 cursor-pointer">
                                    Withdraw TRX</button>
                                <p style={{ color: "#ef4444" }} className="text-center">
                                    Withdrawals disabled on Sundays
                                    <br />
                                    ((GMT-6 [FLORIDA - USA]))
                                </p>
                            </div> */}
                            <WithdrawalForm wallet={wallet} balance={balance}  />
                        </div>

                    </div>

                    {/* <div className="mt-6 pb-20">
                        <img className="w-14 m-auto py-6" src={negociacion} alt="negociacion" />
                        <p>
                            <strong>WITHDRAWAL INFORMATION</strong>
                            <br />
                            - Minimum withdrawal 125 TRX.<br />
                            - 1 withdrawal every 24 hours.<br />
                            - Reception hours from 9:00 to 21:00.<br />
                            - Withdrawal from Monday to Saturday.<br />
                            - Processing time 20 minutes.<br />
                            - 17% fee for withdrawals.
                        </p>
                    </div> */}

                    <div className="flex items-center pb-20 mt-4">
                        <div className="w-full group relative mx-auto overflow-hidden rounded-[16px] bg-gray-300 p-[1px] transition-all duration-300 ease-in-out bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            <div className="animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-first:visible"></div>
                            <div className="relative rounded-[15px] bg-white p-6">
                                <div className="space-y-4">
                                    <img className="m-auto max-h-44" src={withdrawSvg} alt="" />
                                    <p className="text-lg font-semibold text-slate-800"><strong>WITHDRAWAL INFORMATION</strong></p>
                                    <p className="font-semibold text-gray-500">
                                        - Minimum withdrawal 1 TRX<br />
                                        - Unlimited withdrawals per day<br />
                                        - Withdrawal fee 1%<br />
                                    </p>
                                    <p className="font-md text-slate-500">Automatic withdrawal during 5 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export interface IWithdrawalFormInput {
    withdrawalAmount: number
}

const WithdrawalForm: React.FC<{ wallet: string, balance: number }> = ({ wallet, balance }) => {
    const [amount, setAmount] = useState("1")
    const { register, handleSubmit, formState: { errors } } = useForm<IWithdrawalFormInput>({ mode: "onSubmit" });
    const amountOnCange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<IWithdrawalFormInput> = formData => {
        dispatch(userInitWithdrawThunk(formData.withdrawalAmount))
        // dispatch(setResponseErrorMessage(""))
        // dispatch(userSetWalletThunk(formData))
        // console.log(formData);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto box-border rounded-[16px] w-full border bg-white p-4 mt-2">
                <div className="mb-0">
                    <div className="pb-4 relative flex wrap items-stretch w-full">
                        <span className="w-11 text-center bg-[#7765fe] block border-0 rounded-l-lg pt-1.5"><FontAwesomeIcon color="white" size="lg" icon={faMoneyCheckDollar} /></span>
                        <input disabled type="text" className={style.formControl} value={wallet} />
                    </div>
                </div>

                <div className="mt-1">
                    <div className="font-semibold">Withdraw Amount</div>
                    <div>
                        <input
                            pattern="[0-9]*"
                            className="mt-1 w-full rounded-[4px] border border-[#A0ABBB] p-2"
                            style={{ border: errors.withdrawalAmount ? '2px solid red' : '' }}
                            value={amount}
                            type="number"
                            placeholder="1" 
                            {...register("withdrawalAmount", { required: true, min: 1, max: balance , onChange: amountOnCange })}/>
                    </div>
                    {/* <div className="flex">
                        <div onClick={() => setAmount("125")} className="w-1/4 mr-1 text-center mt-[14px] cursor-pointer truncate rounded-[4px] p-3 bg-blue-500 text-white font-nunito shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ">125</div>
                        <div onClick={() => setAmount("200")} className="w-1/4 mr-1 text-center mt-[14px] cursor-pointer truncate rounded-[4px] p-3 bg-blue-500 text-white font-nunito shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ">200</div>
                        <div onClick={() => setAmount("300")} className="w-1/4 mr-1 text-center mt-[14px] cursor-pointer truncate rounded-[4px] p-3 bg-blue-500 text-white font-nunito shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ">300</div>
                        <div onClick={() => setAmount("400")} className="w-1/4 text-center mt-[14px] cursor-pointer truncate rounded-[4px] p-3 bg-blue-500 text-white font-nunito shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ">400</div>
                    </div> */}
                </div>
                {/* className="h-8 w-8 text-[#299D37]" */}
                <div className="mt-6">
                    <div className="font-semibold">Withdrawal Fee (1 %)</div>
                    <div className="mt-2">
                        <div className="flex w-full items-center justify-between bg-neutral-100 p-3 rounded-[4px]">
                            <div className="flex items-center gap-x-2">
                                <FontAwesomeIcon className="h-8 w-8 text-indigo-400" color="white" size="lg" icon={faChartPie} />

                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#299D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg> */}
                                <span className="font-semibold">Summary:</span>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <div className="text-[#64748B]">{!Number.isNaN(parseInt(amount)) ? (parseInt(amount) * 0.17).toFixed(2) : "0"}</div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                {/* <div className="mt-6">
                <div className="flex justify-between">
                    <span className="font-semibold text-[#191D23]">Receiving</span>
                    <div className="flex cursor-pointer items-center gap-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="font-semibold text-green-700">Add recipient</div>
                    </div>
                </div>
            </div> */}

                <div className="mt-6">
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-nunito rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 cursor-pointer">Withdraw {!Number.isNaN(parseInt(amount)) ? (parseInt(amount) - (parseInt(amount) * 0.17)).toFixed(2) : ""} TRX</button>
                </div>
                {errors.withdrawalAmount && errors.withdrawalAmount.type === "required" && <div className="pt-2 font-semibold text-xs w-full text-center text-red-500">Fill in withdrawal amount</div>}
                {errors.withdrawalAmount && errors.withdrawalAmount.type === "min" && <div className="pt-2 font-semibold text-xs w-full text-center text-red-500">The minimum withdrawal amount is 1 TRX</div>}
                {errors.withdrawalAmount && errors.withdrawalAmount.type === "max" && <div className="pt-2 font-semibold text-xs w-full text-center text-red-500">Available balance for withdrawal {balance} TRX</div>}
            </div>
        </form>
    )
}

export default Wallet