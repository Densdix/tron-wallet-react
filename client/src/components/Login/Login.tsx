import React, { useEffect, useState } from "react"
import style from './Login.module.css'
import '../../App.css';
import classNames from "classnames";
// import logo from "../../images/logo.png"
import logo from "../../images/tron-wallet-logo.png"
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../redux/store";
import { Navigate, useLocation } from "react-router-dom";
import Preloader from "../common/Preloader/Preloader";

//qIWd8RBIUHWZo8Xo
//INSERT into accounts (login, "password") values ('test1', 'test2')

const Login = () => {
    const isLogged = useSelector((state: RootState) => state.account.isAuth)
    const isLoading = useAppSelector(state => state.account.isLoading)

    const [isAuthForm, setIsAuthForm] = useState(true)
    const { state } = useLocation();

    useEffect(() => {
        // console.log("STATE:"+state)
        if (state === null) {
            // console.log("null")
        } else {
            setIsAuthForm(false)
            // console.log(state)
        }
    }, [])

    return (
        <>
            {!isLogged
                ? <main className={style.mainContent}>
                    <div className={style['content-wrapper']}>
                        <Header />
                        <div className={style.loginWrapper}>
                            <div className="w-full ml-auto mr-auto px-24 max-sm:px-2">
                                {isAuthForm ? <LoginForm setIsAuthForm={setIsAuthForm} /> : <RegisterForm setIsAuthForm={setIsAuthForm} cod={state? state : null} />}
                            </div>
                        </div>
                    </div>
                    {isLoading && <Preloader />}
                </main>
                : <Navigate to="/" />}
        </>

    )
}

const Header = () => {
    return (
        <div className={style.headerPage}>
            <div className="w-full ml-auto mr-auto pl-3 pr-3">
                <div className="pt-24 pb-16">
                    <div className="text-center">
                        <img className="w-64 mt-9 mb-8 mx-auto" src={logo} alt="logo" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login