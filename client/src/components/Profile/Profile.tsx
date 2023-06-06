import React, { useEffect, useState } from "react"
import style from "./Profile.module.css"
import user from "../Home/img/user.png"
import { ProfileForm } from "./ProfileForm"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { resetUserData } from "../../redux/reducers/accountSlice"
import { useOutletContext } from "react-router-dom"

const Profile = () => {

    const fullname = useAppSelector(state => state.account.fullname)
    const email = useAppSelector(state => state.account.email)
    //@ts-ignore
    const [theme, setTheme] = useOutletContext()

    const dispatch = useAppDispatch()

    const logOut = () => {
        localStorage.clear()
        dispatch(resetUserData())
    }

    return (
        <div className={style.mainContent}>
            <div className={style.contentWrapper}>
                <div className="w-full ml-auto mr-auto px-24 max-sm:px-2 text-center">
                    <div className="w-full flex">
                    <Toggle setTheme={setTheme} theme={theme}/>
                        <div className="w-1/2 text-end pr-2 cursor-pointer">
                            <FontAwesomeIcon icon={faRightFromBracket} size={"xl"} color={"grey"} onClick={logOut} />
                        </div>
                    </div>

                    <div className="mb-8">
                        <img className={style.userImg} src={user} alt="user" />
                        <p className="leading-3 mt-4">
                            <strong className="font-semibold">Fullname</strong>
                            <br />
                            <span className="text-xs mb-0">{fullname}</span>
                        </p>

                        <p className="leading-3 mt-2">
                            <strong className="font-semibold">Email</strong>
                            <br />
                            <span className="text-xs mb-0">{email}</span>
                        </p>
                    </div>
                    <div className="mb-6">
                        <ProfileForm />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

const Toggle:React.FC<{theme: any, setTheme: any}> = ({theme, setTheme}) => {
    const [enabled, setEnabled] = useState(theme === 'dark');

    const changeTheme =() => {
        if(theme === 'dark'){
            setTheme('light')
            setEnabled(false)
        }else{
            setTheme('dark')
            setEnabled(true)
        }
    }

    return (
        <div className="relative flex flex-col overflow-hidden w-1/2 pl-2">
            <div className="flex">
                <div className="inline-flex relative items-center mr-5 cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        readOnly
                    />
                    <div
                        onClick={changeTheme}
                        className="w-11 h-6 bg-gray-500 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                    ></div>
                    <span className="ml-2 text-sm font-medium text-[var(--color6)]">
                        Dark mode
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Profile