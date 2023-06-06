import React, { useState } from "react";
import { SubmitHandler, useForm, ValidationRule } from "react-hook-form";
import { NavLink } from "react-router-dom";
import style from './Profile.module.css';
import eye from "../Login/img/eyeSolid.svg";
import eyeSlash from "../Login/img/eye.svg";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setResponseErrorMessage, userSetWalletThunk } from "../../redux/reducers/accountSlice";

export interface IProfileFormInput {
    name: string
    wallet: string
}

export const ProfileForm = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<IProfileFormInput>({ mode: "onSubmit" });

    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<IProfileFormInput> = formData => {
        dispatch(setResponseErrorMessage(""))
        dispatch(userSetWalletThunk(formData))
        // console.log(formData);
    }
    const emailPattern: ValidationRule<RegExp> = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const fullname = useAppSelector(state => state.account.fullname)
    const phoneNumber = useAppSelector(state => state.account.phoneNumber)
    const email = useAppSelector(state => state.account.email)
    const inviterId = useAppSelector(state => state.account.inviterId)
    const refCode = useAppSelector(state => state.account.refCode)
    const wallet = useAppSelector(state => state.account.wallet)
    const errorMessage = useAppSelector(state => state.account.errorMessage)

    const [tempWallet, setTempWallet] = useState("")
    const updateTempWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempWallet(e.target.value)
    }

    // label {
    //     position: absolute;
    //     top: 0;
    //     font-size: 12px;
    //     margin: -16px;
    //     padding: 2px 50px;
    //     background-color: teal;
    //     transition: top .2s ease-in-out, font-size .2s ease-in-out;
    //     border-radius: 6px;
    //   }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style['formGroup']}>
                <div className={style.inputGroup}>
                    <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">Fullname</label>
                    <input disabled
                        className={style['formControl']}
                        style={{ border: errors.name ? '2px solid red' : '' }}
                        type="text"
                        placeholder="Fullname"
                        value={fullname}
                        // {...register("name", { required: true })} 
                        />
                </div>

                <div className={style.inputGroup}>
                <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">Phone number</label>
                    <input disabled
                        className={style['formControl']}
                        type="text"
                        value={phoneNumber}
                        placeholder="Phone number" />
                </div>

                <div className={style.inputGroup}>
                <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">Email</label>
                    <input disabled
                        className={style['formControl']}
                        value={email}
                        type="text"
                        placeholder="Email" />
                </div>

                <div className={style.inputGroup}>
                <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">Refferal code</label>
                    <input disabled
                        className={style['formControl']}
                        value={refCode}
                        type="text"
                        placeholder="Refferal code" />
                </div>

                {/* <div className={style.inputGroup}>
                <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">Дата регистрации</label>
                    <input disabled
                        className={style['formControl']}
                        value={"11:18 07-12-2022 from db"}
                        type="text"
                        placeholder="Дата регистрации" />
                </div> */}

                <div className={style.inputGroup}>
                <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold">TRX adress</label>
                    <input disabled={wallet? true: false}
                        className={style['formControl']}
                        style={{ border: errors.wallet ? '2px solid red' : !wallet ? '2px solid crimson' : '' }}
                        type="text"
                        placeholder="TRX adress"
                        value={wallet ? wallet : tempWallet}
                        {...register("wallet", { required: true, onChange: updateTempWallet })} />
                </div>

                {wallet
                ? <div className="w-full mt-1 py-2 px-4 bg-green-500 text-white font-nunito rounded-md shadow-md">
                    ACCOUNT IS VERIFIED</div>
                : <button type="submit" className="w-full mt-1 py-2 px-4 bg-rose-500 text-white font-nunito rounded-md shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-75 cursor-pointer">
                    VERIFY ACCOUNT </button>}
                {errorMessage && <div className="text-center text-rose-600 font-semibold">{errorMessage}</div>}
            </div>
        </form>
    );
};
