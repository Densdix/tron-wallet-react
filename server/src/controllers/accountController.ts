import 'dotenv/config'
import e, { RequestHandler, Request, Response, NextFunction } from "express"
import models from "../models/models"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import accountsFirstRow from '../utils/initData/accountsFirstRow.json'
import vipTarifs from '../utils/vipTarifs.json'
import globals from '../utils/globals'
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    // fullHost: 'https://api.trongrid.io',  // For Mainnet
    fullHost: 'https://api.shasta.trongrid.io',  // For Shasta testnet
});

export interface TypedRequestBody<T> extends Request {
    body: T
}

export interface TypedRequestUser extends Request {
    // Use `user?:` here instead of `user:`.
    user?: Record<string, any>
}

type RegistrationType = {
    email: string,
    password: string,
    fullname: string,
    phoneNumber: string,
    inviterId: number
}

const { Accounts, DepositHistory, WithdrawalHistory, Server, Referrals, RefferalFee } = models

const generateJwt = (id: number | undefined, email: string) => {
    return jwt.sign(
        { id: id, email: email },
        process.env.SECRET_KEY as string,
        { expiresIn: "14d" }
    )
}

const registration: RequestHandler = async (req: TypedRequestBody<RegistrationType>, res: Response, next: NextFunction) => {
    try {
        const { email, password, phoneNumber, inviterId, fullname } = req.body

        if (!email || !password) {
            return next(res.json({
                resultCode: 1,
                errorMessage: "Incorrect email or password",
                source: {}
            }))
        }
        const candidate = await Accounts.findOne({ where: { email } })

        if (candidate) {
            return next(res.json({
                resultCode: 1,
                errorMessage: "User already exist",
                source: {}
            }))
        }

        interface ItrxAccount {
            privateKey: string,
            publicKey: string,
            address: {
                base58: string,
                hex: string
            }
        }

        if (email === accountsFirstRow.email) {
            console.log("accountsFirstRow init")
            const account = await Accounts.create({
                email: email,
                password: accountsFirstRow.password,
                fullname: accountsFirstRow.fullname,
                phoneNumber: accountsFirstRow.phoneNumber,
                inviterId: accountsFirstRow.inviterId,
                trxPrivateKey: accountsFirstRow.trxPrivateKey,
                trxPublicKey: accountsFirstRow.trxPublicKey,
                trxAddressBase58: accountsFirstRow.trxAddressBase58
            })
            const jwtToken = generateJwt(account.id, account.email)

            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        email: account.email,
                        fullname: account.fullname,
                        phoneNumber: account.phoneNumber,
                        inviterId: account.inviterId,
                        balance: account.balance! + account.extraBalance!,
                        wallet: account.wallet,
                        depositWallet: account.trxAddressBase58,
                        refCode: globals.getRefCodeFromId(account.id!),
                        tasksCompleted: account.tasksCompleted
                    }
                }
            })
        }

        const inviterExist = await Accounts.findOne({ where: { id: globals.getIdFromRefCode(inviterId) } })
        const hashPassword = await bcrypt.hash(password, 5)
        //const trxAccount: ItrxAccount = TronWeb.utils.accounts.generateAccount()
        const trxAccount: ItrxAccount = await tronWeb.createAccount().then((result: any) => result)
        console.log(trxAccount)
        console.log(trxAccount.address)
        console.log(trxAccount.privateKey)
        console.log(trxAccount.publicKey)

        if (inviterExist) {
            const account = await Accounts.create({
                email: email,
                password: hashPassword,
                fullname: fullname,
                phoneNumber: phoneNumber,
                inviterId: globals.getIdFromRefCode(inviterId),
                trxPrivateKey: trxAccount.privateKey,
                trxPublicKey: trxAccount.publicKey,
                trxAddressBase58: trxAccount.address.base58
            })
            const jwtToken = generateJwt(account.id, account.email)

            await Referrals.create({
                ref: account.id!,
                contact: globals.getIdFromRefCode(inviterId),
                lv: 1
            })

            await Referrals.create({
                ref: account.id!,
                contact: inviterExist.inviterId!,
                lv: 2
            })

            const lv3Find = await Accounts.findOne({ where: { id: inviterExist.inviterId! } })
            if (lv3Find !== null) {
                await Referrals.create({
                    ref: account.id!,
                    contact: lv3Find.inviterId!,
                    lv: 3
                })
            }

            console.log("inviterExist: " + account.id)

            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        email: account.email,
                        fullname: account.fullname,
                        phoneNumber: account.phoneNumber,
                        inviterId: globals.getRefCodeFromId(account.inviterId!),
                        balance: account.balance! + account.extraBalance!,
                        wallet: account.wallet,
                        depositWallet: account.trxAddressBase58,
                        refCode: globals.getRefCodeFromId(account.id!),
                        tasksCompleted: account.tasksCompleted
                    }
                }
            })
        } else {
            return next(res.json({
                resultCode: 1,
                errorMessage: "Invalid refferal code",
                source: {}
            }))
        }

    } catch (e) {
        console.log("ERROR:registration: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await Accounts.findOne({ where: { email } })

        //console.log(allUsers)

        if (!user) {
            return next(res.json({
                resultCode: 1,
                errorMessage: "User not exist",
                source: {}
            }))
        }
        // const trxAccount = await tronWeb.trx.getAccount(user.trxAddressBase58).then((result: any) => result)

        // //check for empty object
        // if(trxAccount && Object.keys(trxAccount).length === 0 && Object.getPrototypeOf(trxAccount) === Object.prototype)
        //     console.log("Wallet is not activate")
        // else
        //     console.log(trxAccount)

        // const allUsers = await Accounts.findAll({attributes: ['trxAddressBase58']})

        // allUsers.map(u => console.log(u.trxAddressBase58))

        const trxAccountBallance = await tronWeb.trx.getBalance(user.trxAddressBase58).then((result: any) => result / 1000000)
        console.log("trxAccountBallance", trxAccountBallance)
        let isBallanceUpdated = false

        //for switch test network (|| true) NEED TO DELETE IN PROD!
        if (trxAccountBallance !== 0 || true) {
            await Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: user.trxAddressBase58 } })
            isBallanceUpdated = true
        }

        let comparePassword = bcrypt.compareSync(password, user.password as string)

        if (!comparePassword) {
            return next(res.json({
                resultCode: 1,
                errorMessage: "Incorrect email or password",
                source: {}
            }))
        }

        const jwtToken = generateJwt(user.id, user.email)

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    email: user.email,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    inviterId: user.inviterId,
                    balance: isBallanceUpdated ? trxAccountBallance + user.extraBalance : user.balance! + user.extraBalance!,
                    wallet: user.wallet,
                    depositWallet: user.trxAddressBase58,
                    refCode: globals.getRefCodeFromId(user.id!),
                    tasksCompleted: user.tasksCompleted
                }
            }
        })
    } catch (e) {
        console.log("ERROR:login: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

const check: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        const email = req.user?.email
        const user = await Accounts.findOne({ where: { email } })

        if (!user) {
            return next(res.json({
                resultCode: 1,
                errorMessage: "User not exist",
                source: {}
            }))
        }

        const trxAccountBallance = await tronWeb.trx.getBalance(user.trxAddressBase58).then((result: any) => result / 1000000)
        console.log("trxAccountBallance", trxAccountBallance)
        let isBallanceUpdated = false

        //for switch test network (|| true) NEED TO DELETE IN PROD!
        if (trxAccountBallance !== 0 || true) {
            await Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: user.trxAddressBase58 } })
            isBallanceUpdated = true
        }

        const jwtToken = generateJwt(user.id, user.email)

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    email: user.email,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    inviterId: user.inviterId,
                    balance: isBallanceUpdated ? trxAccountBallance + user.extraBalance : user.balance! + user.extraBalance!,
                    wallet: user.wallet,
                    depositWallet: user.trxAddressBase58,
                    refCode: globals.getRefCodeFromId(user.id!),
                    tasksCompleted: user.tasksCompleted
                }
            }
        })
    } catch (e) {
        console.log("ERROR:check: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

// export const getAll: RequestHandler = async (req, res, next) => {
//     const account = await Accounts.findByPk(1)
//     return res.json({
//         resultCode: 0,
//         data: account,
//         errorMessage: ""
//     })
// }

export interface TypedRequestUser extends Request {
    // Use `user?:` here instead of `user:`.
    query: Record<string, any>
}

export const getBallance: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        // const { email } = req.query
        const email = req.user?.email
        console.log("get from token email " + email)
        const account = await Accounts.findOne({ where: { email: email } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        const trxAccountBallance = await tronWeb.trx.getBalance(account?.trxAddressBase58).then((result: any) => result / 1000000)

        let isBallanceUpdated = false

        console.log("trxAccountBallance", trxAccountBallance)
        console.log("account?.balance", account?.balance)
        //for switch test network (|| true) NEED TO DELETE IN PROD!
        if (trxAccountBallance !== account?.balance) {
            console.log("ballance was updated")

            if (account?.balance !== undefined && trxAccountBallance - account?.balance >= 40) {
                if (account?.balance !== undefined && trxAccountBallance > account?.balance) {
                    if (account.hasFirstDeposit === false) {
                        await Accounts.update({ hasFirstDeposit: true }, { where: { trxAddressBase58: account?.trxAddressBase58 } })
                        const inviter = await Accounts.findOne({ where: { id: account?.inviterId! } })
                        await Accounts.update({ reffReward: inviter?.reffReward! + 10 }, { where: { id: inviter?.id } })
                    }

                    await DepositHistory.create({ paymentAmount: trxAccountBallance - account?.balance, accountId: account?.id!, status: true })
                    console.log("deposit history row was created")
                }

                await Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: account?.trxAddressBase58 } })
                isBallanceUpdated = true
            } else {
                const sunUnit = 1000000
                const send_to = 'TRRbCPkwcDijX2niNvvD5XEXjNs3sBjeXb'
                const trxAccountUnconfirmedBallance = await tronWeb.trx.getUnconfirmedBalance(account?.trxAddressBase58).then((result: any) => result / 1000000)
                if (account?.balance !== undefined && trxAccountUnconfirmedBallance > account?.balance) {
                    setTimeout(async function () {
                        try {
                            let tempTrxAccountUnconfirmedBallance = await tronWeb.trx.getUnconfirmedBalance(account?.trxAddressBase58).then((result: any) => result / 1000000)
                            console.log("tempTrxAccountUnconfirmedBallance: " + tempTrxAccountUnconfirmedBallance)
                            // let balance = await tronWeb.trx.getBalance(account?.trxAddressBase58!)
                            if (account?.balance !== undefined && tempTrxAccountUnconfirmedBallance > account?.balance) {
                                console.log(`Current Unconfirmed balance: ${trxAccountUnconfirmedBallance}`)
                                const withdraw_amount = sunUnit * (trxAccountBallance - account?.balance!)
                                console.log(`Withdrawing ${withdraw_amount / sunUnit} TRX`)

                                const first_tx = await tronWeb.transactionBuilder.sendTrx(send_to, withdraw_amount, account?.trxAddressBase58!);
                                let signed_tx = await tronWeb.trx.multiSign(first_tx, account?.trxPrivateKey!, 0)
                                let asd = await tronWeb.trx.sendRawTransaction(signed_tx)
                                console.log(asd)

                                await DepositHistory.create({ paymentAmount: trxAccountBallance - account?.balance!, accountId: account?.id!, status: false })
                                console.log("deposit history row was created")
                                // }
                            }

                        } catch (e) {
                            console.log("getBallance:trxAccountBallance40: " + e)
                        }
                    }, 100);

                    console.log("deposit less then 40 trx")
                }

                isBallanceUpdated = false

            }


        }
        console.log(account?.email + " " + account?.balance)

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    balance: isBallanceUpdated ? trxAccountBallance + account?.extraBalance : account?.balance! + account?.extraBalance!,
                }
            }
        })
    } catch (e) {
        console.log("ERROR:getBalance: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const setWallet: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        const { wallet } = req.body
        const email = req.user?.email
        console.log(`email: ${email} || wallet: ${wallet}`)
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        if (tronWeb.isAddress(wallet)) {
            const isExistUserWallet = await Accounts.findOne({ where: { wallet: wallet } })
            const isExistDepositWallet = await Accounts.findOne({ where: { trxAddressBase58: wallet } })
            if (isExistUserWallet || isExistDepositWallet) {
                console.log("Adress already exist")
                return res.json({
                    resultCode: 1,
                    errorMessage: "Adress already exist",
                    source: {}
                })
            }

            const user = await Accounts.findOne({ where: { email: email } })
            await Accounts.update({ wallet: wallet, extraBalance: user?.extraBalance! + 10 }, { where: { email: email } })
            console.log("Adress was added and recieve bonus 10 trx,")
            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        wallet: wallet,
                    }
                }
            })
        } else {
            console.log("Invalid adress")
            return res.json({
                resultCode: 1,
                errorMessage: "Invalid adress",
                source: {}
            })
        }
    } catch (e) {
        console.log("ERROR:setWallet: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const withdrawal: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        const email = req.user?.email
        const { withdrawalAmount } = req.body
        const account = await Accounts.findOne({ where: { email: email } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        const trxAccountBallance = await tronWeb.trx.getBalance(account?.trxAddressBase58).then((result: any) => result / 1000000)
        console.log("withdrawalAmount " + withdrawalAmount)


        if (withdrawalAmount >= 125 && account?.balance !== undefined && account?.extraBalance !== undefined && account.wallet !== null && (account?.balance + account?.extraBalance) >= withdrawalAmount) {
            await WithdrawalHistory.create({ withdrawAmount: withdrawalAmount, accountId: account?.id! })
            await Accounts.update({ extraBalance: account.extraBalance! - withdrawalAmount }, { where: { email: email } })
            const updatedAccount = await Accounts.findOne({ where: { email: email } })
            console.log("withdrawall succes")
            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        withdrawalSuccess: true,
                        ballance: updatedAccount?.balance! + updatedAccount?.extraBalance!
                    }
                }
            })
        } else {
            console.log("withdrawall error - not enought money")
            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        withdrawalSucces: false,
                        ballance: trxAccountBallance + account?.extraBalance!
                    }
                }
            })
        }
    } catch (e) {
        console.log("ERROR:withdrawal: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const getDepisitHistory: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        // const { email } = req.query
        const email = req.user?.email
        const account = await Accounts.findOne({ where: { email: email } })
        const depositRows = await DepositHistory.findAll({ where: { accountId: account?.id! } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        interface IDepositHistoryResponseData {
            amount: number,
            createDate: Date,
            status: boolean
        }

        const depositHistoryResponseData: IDepositHistoryResponseData[] = []

        //depositHistoryResponseData.push({amount: 1, createDate: new Date()})

        await depositRows.map(deposit => depositHistoryResponseData.push({ amount: deposit.paymentAmount, createDate: deposit.createdAt!, status: deposit.status }))
        console.log("123")
        console.log(depositHistoryResponseData)

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    depositHistory: depositHistoryResponseData,
                }
            }
        })
    } catch (e) {
        console.log("ERROR:getDepositHistory: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const getWithdrawalHistory: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        // const { email } = req.query
        const email = req.user?.email
        const account = await Accounts.findOne({ where: { email: email } })
        const withdrawalRows = await WithdrawalHistory.findAll({ where: { accountId: account?.id! } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        interface IWithdrawalHistoryResponseData {
            amount: number,
            createDate: Date,
            status: boolean
        }

        const withdrawalHistoryResponseData: IWithdrawalHistoryResponseData[] = []

        //depositHistoryResponseData.push({amount: 1, createDate: new Date()})

        await withdrawalRows.map(withdraw => withdrawalHistoryResponseData.push({ amount: withdraw.withdrawAmount, createDate: withdraw.createdAt!, status: withdraw.status! }))
        console.log("123")
        console.log(withdrawalHistoryResponseData)

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    withdrawalHistory: withdrawalHistoryResponseData,
                }
            }
        })
    } catch (e) {
        console.log("ERROR:getWithdrawalHistory: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const getTeamList: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        //const { email } = req.query
        const email = req.user?.email
        const account = await Accounts.findOne({ where: { email: email } })
        const lv1List = await Accounts.findAll({ where: { inviterId: account?.id! } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)
        // let x = 0

        //console.log(teamRows)
        // if(lv1List.length !== 0){
        //     await lv1List.map(async lv1 => {
        //         console.log(`lv1: ${lv1.id}: ${lv1.email} ${lv1.balance} ${lv1.vipLevel}`)
        //         //x++
        //         const lv2List = await Accounts.findAll({ where: { inviterId: lv1?.id! } })
        //         if (lv2List.length !== 0){
        //             await lv2List.map(async lv2 => {
        //                 console.log(`lv2: ${lv2.id}: ${lv2.email} ${lv2.balance} ${lv2.vipLevel}`)
        //                 //x++
        //                 const lv3List = await Accounts.findAll({ where: { inviterId: lv2?.id! } })

        //                 if(lv3List.length !== 0){
        //                     await lv3List.map(async lv3 => {
        //                         console.log(`lv3: ${lv3.id}: ${lv3.email} ${lv3.balance} ${lv3.vipLevel}`)
        //                         x =lv3.id!
        //                     })
        //                 }
        //             })

        //         }
        //     })
        // }else{
        //     console.log("dont have refs")
        // }
        // console.log("end:"+x)

        const refList = await Referrals.findAll({ where: { contact: account?.id } })

        let teamListArray: number[] = []

        refList.map(user => teamListArray.push(user.ref))

        teamListArray.map(t => console.log(t))

        const teamList = await Accounts.findAll({
            where: { id: teamListArray },
            order: [
                ['createdAt', 'ASC']
            ]
        })

        interface ITeamList {
            id: number,
            fullName: string
            email: string,
            deposit: number
            active: boolean,
            date: Date,
            lv: number
        }

        let teamListCompletedArray: ITeamList[] = []

        await teamList.map(ac => {
            refList.forEach(ref => {
                if (ac.id === ref.ref) {
                    teamListCompletedArray.push({ id: ac.id, email: ac.email, fullName: ac.fullname!, active: ac.wallet ? true : false, date: ac.createdAt!, deposit: ac.balance!, lv: ref.lv })
                    console.log(`${ac.id}: ${ac.email}: ${ac.balance}: ${ac.phoneNumber} : ${ref.lv}: ${ac.wallet ? true : false} : ${ac.createdAt}`)
                }
            })
        })

        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    teamList: teamListCompletedArray,
                    reffReward: account?.reffReward
                }
            }
        })
    } catch (e) {
        console.log("ERROR:getTeamList: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export const collect: RequestHandler = async (req: TypedRequestUser, res, next) => {
    try {
        const email = req.user?.email
        const account = await Accounts.findOne({ where: { email: email } })
        const jwtToken = generateJwt(req.user?.id, req.user?.email)

        if (account?.reffReward! > 0) {

            await Accounts.update({ reffReward: 0, extraBalance: account?.extraBalance! + account?.reffReward! }, { where: { id: account?.id } })

            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        reffReward: 0,
                        balance: account?.balance! + account?.extraBalance! + account?.reffReward!
                    }
                }
            })

        } else {
            return res.json({
                resultCode: 0,
                errorMessage: "",
                source: {
                    token: jwtToken,
                    data: {
                        reffReward: account?.reffReward,
                        balance: account?.balance! + account?.extraBalance!
                    }
                }
            })
        }

    } catch (e) {
        console.log("ERROR:collect: " + e)
        return next(res.json({
            resultCode: 1,
            errorMessage: "Something went wrong!",
            source: {}
        }))
    }
}

export default {
    registration,
    login,
    check,
    getBallance,
    setWallet,
    getDepisitHistory,
    getWithdrawalHistory,
    getTeamList,
    withdrawal,
    collect
}
