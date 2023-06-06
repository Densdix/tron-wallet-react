import React, { useState } from "react";
import { SubmitHandler, useForm, ValidationRule } from "react-hook-form";
import { NavLink } from "react-router-dom";
import style from './Login.module.css';
import eye from "../Login/img/eyeSolid.svg";
import eyeSlash from "../Login/img/eye.svg";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setAuthAC, setResponseErrorMessage, userGetTaskCountThunk, userSignInThunk } from "../../redux/reducers/accountSlice";
import { ISignInFormData } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import preloader from "../../images/preloader.svg"

// interface IFormInput {
//     email: string;
//     password: string;
// }

interface ILoginForm {
    setIsAuthForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginForm: React.FC<ILoginForm> = ({setIsAuthForm}) => {
    const [passwordShown, setPasswordShown] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ISignInFormData>({ mode: "onSubmit" });
    
    const emailPattern: ValidationRule<RegExp> = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<ISignInFormData> = (formData: ISignInFormData) => {
        // console.log(formData)
        dispatch(userSignInThunk(formData))
    };

    const swapToRegisterForm = () => {
        dispatch(setResponseErrorMessage(""))
        setIsAuthForm(false)
    }

    const errorMessageFromServer = useAppSelector(state => state.account.errorMessage)
    //const dispatch = useAppDispatch()

    return (
        <div>
            <div className={style.title_section}>
                <h5>Login</h5>
                <p>Log in to the platform using your credentials.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={style['formGroup']}>
                    
                    <div className={style.inputGroup}>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.email ? '2px solid red' : '' }}
                            type="email"
                            placeholder="Email"

                            {...register("email", { required: true, pattern: emailPattern })} />
                    </div>

                    {errors.password && errors.password.type === "required" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Заполните обязательные поля</div>}
                    <div className={style['inputGroup']}>
                        <input
                            className={style['formControl']}
                            style={{ border: errors.password ? '2px solid red' : '' }}
                            type={passwordShown ? "text" : "password"}
                            placeholder="Password"
                            {...register("password", { required: true })} />
                        <button type="button" className={style.pipi} onClick={() => setPasswordShown(!passwordShown)}>
                            <img className="w-5 fill-red-900" src={passwordShown ? eyeSlash : eye} alt="" />
                        </button>
                    </div>
                    <div className="relative mb-4 text-center">
                        <a className="text-gray-400 hover:text-blue-500" href="#">Forgot the password?</a>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-nunito rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 cursor-pointer">
                        {/* <NavLink to="/">ВОЙТИ</NavLink> */}
                        SIGN IN
                        {/* <img className="w-6 m-auto text-gray-200" src={preloader} alt="preloader" /> */}
                    </button>
                    {errors.email && errors.email.type === "required" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Заполните обязательные поля</div>}
                    {errors.email && errors.email.type === "pattern" && <div className="mb-1 font-semibold text-xs w-full text-center text-red-500">Некорректный формат почты</div>}
                </div>
            </form>
            {errorMessageFromServer && <div className="text-center text-rose-600 font-semibold">{errorMessageFromServer}</div>}
            <div className={style['form-group']}>
                <p>
                    <span>Are you new? </span>
                    <span><a onClick={swapToRegisterForm} className="text-blue-500 font-bold hover:text-blue-600" href="#">Register now!</a></span>
                </p>
            </div>
        </div>

    );
};
