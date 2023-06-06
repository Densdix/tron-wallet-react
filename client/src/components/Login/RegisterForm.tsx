import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, ValidationRule } from "react-hook-form";
import { NavLink } from "react-router-dom";
import style from './Login.module.css';
import eye from "../Login/img/eyeSolid.svg";
import eyeSlash from "../Login/img/eye.svg";
import { ISignUpFormData } from "../../api/api";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setResponseErrorMessage, userSignUpThunk } from "../../redux/reducers/accountSlice";

interface IRegisterForm {
    setIsAuthForm: React.Dispatch<React.SetStateAction<boolean>>
    cod: number | null
}

export const RegisterForm: React.FC<IRegisterForm> = ({ setIsAuthForm, cod }) => {
    const [passwordShown, setPasswordShown] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ISignUpFormData>({ mode: "onSubmit" });
    const emailPattern: ValidationRule<RegExp> = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phonePattern: ValidationRule<RegExp> = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/i;
    const passwordPattern: ValidationRule<RegExp> = /^[A-Za-z\d]{6,}$/i;
    const dispatch = useAppDispatch()
    const errorMessageFromServer = useAppSelector(state => state.account.errorMessage)
    const onSubmit: SubmitHandler<ISignUpFormData> = formData => {
        formData = { ...formData, inviterId: Number(formData.inviterId) }
        // console.log(formData)
        dispatch(userSignUpThunk(formData))
    }

    const swapToLoginForm = () => {
        dispatch(setResponseErrorMessage(""))
        setIsAuthForm(true)
    }

    return (
        <div>
            <div className={style.title_section}>
                <h5>Registration</h5>
                <p>Use your personal data.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={style['formGroup']}>

                    <div className={style.inputGroup}>
                        <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">Full name</label>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.fullname ? '2px solid red' : '' }}
                            type="text"
                            placeholder="Full name"

                            {...register("fullname", { required: true })} />
                    </div>

                    <div className={style.inputGroup}>
                        <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">Phone number</label>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.phoneNumber ? '2px solid red' : '' }}
                            type="text"
                            placeholder="Phone number"

                            {...register("phoneNumber", { required: true, pattern: phonePattern })} />
                    </div>

                    <div className={style.inputGroup}>
                        <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">Email</label>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.email ? '2px solid red' : '' }}
                            type="text"
                            placeholder="Email"

                            {...register("email", { required: true, pattern: emailPattern })} />
                    </div>

                    <div className={style.inputGroup}>
                        <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">Password</label>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.password ? '2px solid red' : '' }}
                            type="text"
                            placeholder="Password"

                            {...register("password", { required: true, pattern: passwordPattern })} />
                    </div>

                    <div className={style.inputGroup}>

                        <label className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ml-3">Inviter code</label>

                        {cod ? <input
                            className={style['formControl']}
                            style={{ border: errors.inviterId ? '2px solid red' : '' }}
                            type="number"
                            placeholder="Inviter code"
                            defaultValue={cod!}
                            {...register("inviterId", { required: true })} />

                            : <input
                                className={style['formControl']}
                                style={{ border: errors.inviterId ? '2px solid red' : '' }}
                                type="number"
                                placeholder="Inviter code"
                                {...register("inviterId", { required: true })} />}

                    </div>


                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-nunito rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 cursor-pointer">
                        {/* <NavLink to="/profile">ЗАРЕГЕСТРИРОВАТЬСЯ</NavLink> */}SIGN UP
                    </button>
                    {errors.email && errors.email.type === "required" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Fill in required fields</div>}
                    {errors.email && errors.email.type === "pattern" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Incorrect email format</div>}
                    {errors.phoneNumber && errors.phoneNumber.type === "pattern" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Incorrect phone format</div>}
                    {errors.password && errors.password.type === "pattern" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Incorrect password format</div>}
                </div>
            </form>
            {errorMessageFromServer && <div className="text-center text-rose-600 font-semibold">{errorMessageFromServer}</div>}
            <div className={style['form-group']}>
                <p>
                    <span>Do you already have an account? </span>
                    <span><a onClick={swapToLoginForm} className="text-blue-500 font-bold hover:text-blue-600" href="#">Start now!</a></span>
                </p>
            </div>
        </div>

    );
};
