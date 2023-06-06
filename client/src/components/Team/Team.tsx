import React, { useEffect, useState } from "react"
import style from "./Team.module.css"
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { userGetTeamListThunk, userInitCollectThunk } from "../../redux/reducers/accountSlice"
import { ITeamListData } from "../../api/api"
import vipTarifs from '../../utils/vipTarifs.json'

const Team = (props: any) => {

    const dispatch = useAppDispatch()
    const teamList = useAppSelector(state => state.account.teamList)
    const reffReward = useAppSelector(state => state.account.reffReward)
    const balance = useAppSelector(state => state.account.balance)
    const refCode = useAppSelector(state => state.account.refCode)

    const [lvArrayCount, setLVCount] = useState([0, 0, 0])

    const [vipLevel, setVipLevel] = useState(0)

    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        let timer = setTimeout(() => setCopySuccess(false), 2000)
        return () => {
            clearTimeout(timer);
        }
    }, [copySuccess])

    const copyToClipboard = () => {
        // console.log("copyToClipboard")
        if (copySuccess === false) {
            navigator.clipboard.writeText(`${window.location.origin}/?cod=${refCode}`)
            setCopySuccess(true)
            // console.log("setCopySuccess")
        }

    }

    const initCollect = () => {
        dispatch(userInitCollectThunk())
    }

    useEffect(() => {
        dispatch(userGetTeamListThunk())
        vipTarifs.slice(0).reverse().every(t => {
            if (balance >= t.balancerequired) {
                // console.log("Your vip is" + t.vipLevel)
                setVipLevel(t.vipLevel)
                return false
            }
            return true
        })
    }, [])

    useEffect(() => {

        let lv1: number = 0
        let lv2: number = 0
        let lv3: number = 0

        teamList.forEach(function (ac, idx, array) {
            if (ac.lv === 1) {
                lv1++
            } else if (ac.lv === 2) {
                lv2++
            } else {
                lv3++
            }
            if (idx === array.length - 1) {
                // console.log("data", [lv1, lv2, lv3])
                setLVCount([lv1, lv2, lv3])
            }
        })
    }, [teamList])

    // console.log(props)

    return (
        <div className={style.mainContent}>
            <div className="mt-4 relative">
                <div className="w-full ml-auto mr-auto px-24 max-sm:px-4 text-center">
                    <div className="grid grid-rows-1">
                        
                        {/* <div className="mb-5 p-3 border border-dashed border-[var(--color6)]">
                            <div><p>Url de invitación</p></div>
                            <div className="pt-4 pb-6 relative flex wrap items-stretch w-full">
                                <input type="text" className={style.formControl} value="https://videocityworld.com/?cod=34603" />
                                <div>
                                    <button className={style.copy}>КОПИРОВАТЬ</button>
                                </div>
                            </div>

                        </div> */}

                        <div className="flex flex-col gap-4 bg-white rounded-lg pt-2 " >
                            <h2 className="text-indigo-500 font-semibold tracking-wider text-2xl pt-4">VIP {vipLevel}</h2>
                            <div className="w-full h-auto pb-4 flex flex-row justify-between divide-x divide-solid divide-gray-400">
                                <div className="relative flex-1 flex flex-col gap-2 px-4">
                                    <h4 className="text-gray-500 text-base font-semibold tracking-wider">LV1</h4>
                                    <h3 className="text-gray-700 text-4xl font-bold">{lvArrayCount.at(0)}</h3>
                                    <div className="right-0 mr-2 absolute bg-gradient-to-r from-indigo-500 to-sky-600 rounded-md font-semibold text-xs text-gray-100 p-1">{vipTarifs.at(vipLevel - 1)?.referalBenefits.A}%</div>
                                </div>
                                <div className="relative flex-1 flex flex-col gap-2 px-4">
                                    <h4 className="text-gray-500 text-base font-semibold tracking-wider">LV2</h4>
                                    <h3 className="text-gray-700 text-4xl font-bold">{lvArrayCount.at(1)}</h3>
                                    <div className="right-0 mr-2 absolute bg-gradient-to-r from-indigo-500 to-sky-600 rounded-md font-semibold text-xs text-gray-100 p-1">{vipTarifs.at(vipLevel - 1)?.referalBenefits.B}%</div>
                                </div>
                                <div className="relative flex-1 flex flex-col gap-2 px-4">
                                    <h4 className="text-gray-500 text-base font-semibold tracking-wider">LV3</h4>
                                    <h3 className="text-gray-700 text-4xl font-bold">{lvArrayCount.at(2)}</h3>
                                    <div className="right-0 mr-2 absolute bg-gradient-to-r from-indigo-500 to-sky-600 rounded-md font-semibold text-xs text-gray-100 p-1">{vipTarifs.at(vipLevel - 1)?.referalBenefits.C}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg border border-dashed border-[var(--color6)] mt-4">
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <p>Commissions from your team</p>
                                    <p>
                                        <span className="text-xs">TRX</span> {reffReward.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <button onClick={reffReward > 0 ? initCollect : () => console.log("err") } className={reffReward > 0 ? style.teamBtn : style.teamBtnDisabled}>Collect</button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 text-left pl-4 text-sm"><span className="bg-gradient-to-r from-indigo-500 to-sky-600 text-white font-semibold rounded-t-lg p-1">Invitation link</span></div>
                        <div className="pb-4 relative flex wrap items-stretch w-full text-left">
                        <div className={style.formControl}>{`${window.location.origin}/?cod=${refCode}`}</div>
                            <div>
                                <button style={copySuccess ? { background: `#33f37d` } : {}} onClick={copyToClipboard} className={style.copy}>{copySuccess ? "COPIED" : "COPY"}</button>
                            </div>
                        </div>

                        <div className="grid relative mb-0.5">
                            <div className="w-full bg-white rounded-sm py-1 pr-1 pl-4" >
                                <p className="text-xs text-left font-normal text-gray-500 leading-1">Invite friends to join and make their first deposit to get <span className="font-semibold">1 TRX</span> for each friend</p>

                                <div className="bg-gradient-to-r from-indigo-400 to-blue-400 group-hover:bg-blue-600 h-full w-2 absolute top-0 left-0"> </div>

                            </div>
                        </div>


                        <div className="mt-5 text-left text-lg">
                            <h5 className="pb-1 text-center">Team</h5>
                        </div>

                        <div className="text-left pb-16">
                            {teamList.map(ac => <TeamCard active={ac.active} lv={ac.lv} date={ac.date} deposit={ac.deposit} email={ac.email} fullName={ac.fullName} id={ac.id} key={ac.id} />)}
                            {/* <TeamCard isTeammateActive={true} level={1} />
                            <TeamCard isTeammateActive={false} level={2} />
                            <TeamCard isTeammateActive={true} level={1} />
                            <TeamCard isTeammateActive={true} level={2} />
                            <TeamCard isTeammateActive={false} level={1} />
                            <TeamCard isTeammateActive={true} level={3} />
                            <TeamCard isTeammateActive={true} level={3} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// interface ITeamCard {
//     isTeammateActive: boolean
//     level: number
// }

const formattedDate = (date: Date) => {
    let d = new Date(date)
    let cd = (num: number) => num.toString().padStart(2, "0")
    return d.getFullYear() + "/" + cd(d.getMonth() + 1) + "/" + cd(d.getDate()) +
        " " + cd(d.getHours()) + ":" + cd(d.getMinutes())
}

const TeamCard: React.FC<ITeamListData> = ({ active, lv, email, date, deposit, fullName }) => {
    return (
        <div className="shadow rounded-lg py-3 px-5 bg-white mb-2">
            <div className="grid grid-cols-2">

                <h1 className="text-left font-nunito text-slate-900">{fullName}</h1>
                <p className="text-right text-slate-900"><span className="bg-indigo-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1">{`LV${lv}`}</span><span className="bg-orange-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1">{`${deposit} TRX`}</span> {formattedDate(date).toString()} </p>
                <p className="text-left text-slate-900">{email}</p>
                {active
                    ? <div className="text-right mb-0 text-green-500 font-bold">ACTIVE</div>
                    : <div className="text-right mb-0 text-red-500 font-bold">INACTIVE</div>}
            </div>




        </div>
    )
}

export default Team