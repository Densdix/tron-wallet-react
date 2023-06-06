import { withdrawal } from './../../../server/src/controllers/accountController';
import axios, { AxiosResponse } from "axios";
import { IProfileFormInput } from "../components/Profile/ProfileForm";

const axInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})

axInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

export interface ISignInFormData {
    email: string,
    password: string
}

export interface ISignUpFormData {
    email: string,
    password: string,
    fullname: string,
    phoneNumber: string,
    inviterId: number
}

export type AuthResponseDataType = {
    email: string,
    fullname: string,
    phoneNumber: string,
    inviterId: number,
    balance: number
    wallet: string,
    depositWallet: string
    refCode: number
}

export const axiosSignIn = (formData: ISignInFormData) => {
    type SignInResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: AuthResponseDataType
        }
    }

    return axInstance.post('/accounts/login', {
        email: formData.email,
        password: formData.password
    }).then((res: AxiosResponse<SignInResponseType>) => {
        //axInstance.defaults.headers.
        localStorage.setItem("token", res.data.source.token!)
        // console.log('token: '+localStorage.getItem('token'))
        return res.data
    })
}

export const axiosSignUp = (formData: ISignUpFormData) => {
    type SignInResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: AuthResponseDataType
        }
    }

    return axInstance.post('/accounts/registration', {
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        phoneNumber: formData.phoneNumber,
        inviterId: formData.inviterId
    }).then((res: AxiosResponse<SignInResponseType>) => {
        //axInstance.defaults.headers.
        localStorage.setItem("token", res.data.source.token!)
        // console.log('reg token: '+localStorage.getItem('token'))
        return res.data
    })
}

export const axiosWithdrawal = (amount: number) => {
    type WithdrawalResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                withdrawalSuccess: boolean,
                ballance: number
            }
        }
    }

    return axInstance.post('/accounts/withdrawal', {
        withdrawalAmount: amount
    }).then((res: AxiosResponse<WithdrawalResponseType>) => {
        //axInstance.defaults.headers.
        return res.data
    })
}

export const axiosIsAuth = () => {
    type SignInResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: AuthResponseDataType
        }
    }

    // console.log("axiosIsAuth:"+localStorage.getItem('token'))

    axInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

    return axInstance.get(`/accounts/auth`).then((res: AxiosResponse<SignInResponseType>) => {
        return res.data
    })
}

export const axiosGetBalance = (email: string) => {
    type GetBalanceResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                balance: number
            }
        }
    }

    // console.log(email)

    // return axInstance.get(`/accounts/ballance?email=${email}`).then((res: AxiosResponse<GetBalanceResponseType>) => {
    //     return res.data
    // })
    return axInstance.get(`/accounts/ballance`).then((res: AxiosResponse<GetBalanceResponseType>) => {
        return res.data
    })
}

export const axiosSetUserWallet = (wallet: string) => {
    type SetWalletResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                wallet: string
            }
        }
    }

    return axInstance.post('/accounts/wallet', {
        wallet: wallet
    }).then((res: AxiosResponse<SetWalletResponseType>) => {
        //axInstance.defaults.headers.
        return res.data
    })

}

export interface IDepositHistoryResponseData {
    amount: number,
    createDate: Date,
    status: boolean
}

export const axiosGetDepositHistory = (email: string) => {
    type GetDepositHistoryResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                depositHistory: IDepositHistoryResponseData[]
            }
        }
    }

    // console.log(email)

    return axInstance.get(`/accounts/depositHistory`).then((res: AxiosResponse<GetDepositHistoryResponseType>) => {
        return res.data
    })
}

export interface IWithdrawalHistoryResponseData {
    amount: number,
    createDate: Date,
    status: boolean
}

export const axiosGetWithdrawalHistory = () => {
    type GetWithdrawalHistoryResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                withdrawalHistory: IWithdrawalHistoryResponseData[]
            }
        }
    }

    return axInstance.get(`/accounts/withdrawalHistory`).then((res: AxiosResponse<GetWithdrawalHistoryResponseType>) => {
        return res.data
    })
}



export interface ITeamListData {
    id: number,
    fullName: string
    email: string,
    deposit: number
    active: boolean,
    date: Date,
    lv: number
}

export const axiosGetTeamList = (email: string) => {
    type GetTeamListResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                teamList: ITeamListData[],
                reffReward: number
            }
        }
    }

    // console.log(email)

    return axInstance.get(`/accounts/teamlist`).then((res: AxiosResponse<GetTeamListResponseType>) => {
        return res.data
    })
}

export const axiosCompleteTask = (email: string) => {
    type CompleteTaskResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                completedTasks: boolean
            }
        }
    }

    return axInstance.get(`/accounts/task`).then((res: AxiosResponse<CompleteTaskResponseType>) => {
        return res.data
    })
}

export const axiosGetTaskCount = (email: string) => {
    type CompleteTaskResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                completedTasks: boolean
                lostTimeToUpdate: number
            }
        }
    }

    return axInstance.get(`/accounts/taskscount`).then((res: AxiosResponse<CompleteTaskResponseType>) => {
        return res.data
    })
}
export const axiosGetCollect = () => {
    type CollectResponseType = {
        resultCode: number
        errorMessage: string
        source: {
            token?: string
            data: {
                reffReward: number,
                balance: number
            }
        }
    }

    return axInstance.get(`/accounts/collect`).then((res: AxiosResponse<CollectResponseType>) => {
        return res.data
    })
}