import { useDispatch } from 'react-redux';
import { useAppDispatch, RootState } from './../store';
import { AuthResponseDataType, axiosGetBalance, axiosSetUserWallet, axiosSignIn, axiosSignUp, ISignInFormData, ISignUpFormData, axiosGetDepositHistory, IDepositHistoryResponseData, axiosGetTeamList, ITeamListData, axiosCompleteTask, axiosGetTaskCount, axiosIsAuth, axiosWithdrawal, axiosGetWithdrawalHistory, IWithdrawalHistoryResponseData, axiosGetCollect } from './../../api/api';
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { IProfileFormInput } from '../../components/Profile/ProfileForm';

type initStateType = {
    isAuth: boolean
    email: string
    fullname: string
    phoneNumber: string
    inviterId: number,
    balance: number,
    errorMessage: string,
    wallet: string,
    depositWallet: string,
    isLoading: boolean,
    refCode: number,
    depositHistory: IDepositHistoryResponseData [],
    withdrawalHistory: IWithdrawalHistoryResponseData[],
    teamList: ITeamListData[],
    reffReward: number,
    tasksCompleted: boolean,
    lostTimeToUpdate: number
}

const initState: initStateType = {
    isAuth: false,
    email: "mock@gmail.com",
    fullname: "Mock Mocky",
    phoneNumber: "123-4567-89",
    inviterId: 0,
    balance: 0,
    errorMessage: "",
    wallet: "",
    depositWallet: "",
    isLoading: false,
    refCode: 0,
    depositHistory: [],
    withdrawalHistory: [],
    teamList: [],
    reffReward: 0.0,
    tasksCompleted: false,
    lostTimeToUpdate: 0
}

const accountSlice = createSlice({
    name: "account",
    initialState: initState,
    reducers: {
        setAuthAC: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
        setUserData: (state, action: PayloadAction<AuthResponseDataType>) => {
            return { ...state, ...action.payload }
        },
        setResponseErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload
        },
        setUserBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setUserWallet: (state, action: PayloadAction<string>) => {
            state.wallet = action.payload
        },
        setUserDepositHistory: (state, action: PayloadAction<IDepositHistoryResponseData[]>) => {
            state.depositHistory = action.payload
        },
        setUserWithdrawalHistory: (state, action: PayloadAction<IWithdrawalHistoryResponseData[]>) => {
            state.withdrawalHistory = action.payload
        },
        setTeamList: (state, action: PayloadAction<ITeamListData[]>) => {
            state.teamList = action.payload
        },
        setReffReward: (state, action: PayloadAction<number>) => {
            state.reffReward = action.payload
        },
        setCompletedTasks: (state, action: PayloadAction<boolean>) => {
            state.tasksCompleted = action.payload
        },
        setLostTimeToUpdate: (state, action: PayloadAction<number>) => {
            state.lostTimeToUpdate = action.payload
        },
        resetUserData: (state) => {
            return { ...state, ...initState }
        },
    },
    // extraReducers(builder) {
    //     builder
    //         .addCase(userSignInThunkOther.fulfilled, (state, action) => {
    //             state.isAuth = true
    //             console.log(action)
    //         })
    // },
})

// export const userSignInThunkOther = createAsyncThunk(
//     'account/userSignInThunk',
//     async (formData: ISignInFormData) => {
//         console.log("account/userSignInThunk")
//         const response = await axiosSignIn(formData)
//         return response
//     }
// )

export const userSignInThunk = (formData: ISignInFormData) => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    const data = await axiosSignIn(formData)
    // console.log(data)
    // console.log(getState().account.balance)
    // здесь нужно выполнить необходимую нормализацию
    // и обработать ошибки
    if (data.resultCode === 0) {
        // console.log("data.source.data", data.source.data)
        dispatch(setAuthAC(true))
        dispatch(setUserData(data.source.data))
        dispatch(setResponseErrorMessage(""))
    } else {
        dispatch(setResponseErrorMessage(data.errorMessage))
    }
    dispatch(setIsLoading(false))

}
export const userSignUpThunk = (formData: ISignUpFormData) => async (dispatch: Dispatch) => {
    dispatch(setIsLoading(true))
    const data = await axiosSignUp(formData)
    // здесь нужно выполнить необходимую нормализацию
    // и обработать ошибки
    if (data.resultCode === 0) {
        dispatch(setAuthAC(true))
        dispatch(setUserData(data.source.data))
        dispatch(setResponseErrorMessage(""))
    }
    else {
        dispatch(setResponseErrorMessage(data.errorMessage))
    }
    dispatch(setIsLoading(false))
}

export const userIsAuthThunk = () => async (dispatch: Dispatch) => {
    
    dispatch(setIsLoading(true))
    const data = await axiosIsAuth()
    // здесь нужно выполнить необходимую нормализацию
    // и обработать ошибки
    
    if (data.resultCode === 0) {
        dispatch(setAuthAC(true))
        dispatch(setUserData(data.source.data))
        dispatch(setResponseErrorMessage(""))
    }
    else {
        dispatch(setResponseErrorMessage(data.errorMessage))
    }
    dispatch(setIsLoading(false))
}

export const userGetBalanceThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    // console.log(getState().account.email)
    const data = await axiosGetBalance(getState().account.email)
    
    if(data.resultCode === 0){
        dispatch(setUserBalance(data.source.data.balance))
        dispatch(setResponseErrorMessage(""))
    }else if(data.resultCode === 1 && data.errorMessage === "No authorize"){
        dispatch(resetUserData())
        localStorage.clear()
        // console.log("userGetBalanceThunk resetUserData")
    }else{
        // console.log("userGetBalanceThunk ERROR")
    }
}

export const userSetWalletThunk = (formData: IProfileFormInput) => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    // console.log(getState().account.email)
    const data = await axiosSetUserWallet(formData.wallet)
    if(data.resultCode === 0){
        dispatch(setUserWallet(data.source.data.wallet))
        dispatch(setResponseErrorMessage(""))
    }else{
        dispatch(setResponseErrorMessage(data.errorMessage))
        // console.log("userGetBalanceThunk ERROR")
    }
    dispatch(setIsLoading(false))
}

export const userGetDepositHistoryThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    // console.log(getState().account.email)
    const data = await axiosGetDepositHistory(getState().account.email)
    
    if(data.resultCode === 0){
        dispatch(setUserDepositHistory(data.source.data.depositHistory))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userGetBalanceThunk ERROR")
    }
    dispatch(setIsLoading(false))
}

export const userGetWithdrawalHistoryThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    const data = await axiosGetWithdrawalHistory()
    
    if(data.resultCode === 0){
        dispatch(setUserWithdrawalHistory(data.source.data.withdrawalHistory))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userGetBalanceThunk ERROR")
    }
    dispatch(setIsLoading(false))
}

export const userGetTeamListThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    // console.log(getState().account.email)
    const data = await axiosGetTeamList(getState().account.email)

    // console.log(data.source.data.teamList)
    
    if(data.resultCode === 0){
        dispatch(setTeamList(data.source.data.teamList))
        dispatch(setReffReward(data.source.data.reffReward))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userGetTeamListThunk ERROR")
    }
    dispatch(setIsLoading(false))
}

export const userCompleteTaskThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    // console.log(getState().account.email)
    const data = await axiosCompleteTask(getState().account.email)
    // console.log(data.source.data.completedTasks)

    if(data.resultCode === 0){
        dispatch(setCompletedTasks(data.source.data.completedTasks))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userCompleteTaskThunk ERROR")
    }
}

export const userGetTaskCountThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    // console.log(getState().account.email)
    const data = await axiosGetTaskCount(getState().account.email)
    // console.log(data.source.data.completedTasks)

    if(data.resultCode === 0){
        dispatch(setCompletedTasks(data.source.data.completedTasks))
        dispatch(setLostTimeToUpdate(data.source.data.lostTimeToUpdate))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userGetTaskCountThunk ERROR")
    }
}

export const userInitWithdrawThunk = (amount: number) => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setIsLoading(true))
    // console.log(getState().account.email)
    const data = await axiosWithdrawal(amount)
    // console.log(data)
    if(data.resultCode === 0){
        dispatch(setUserBalance(data.source.data.ballance))
        dispatch(setResponseErrorMessage(""))
    }else{
        dispatch(setResponseErrorMessage(data.errorMessage))
        // console.log("userInitWithdrawThunk ERROR")
    }

    dispatch(setIsLoading(false))
}

export const userInitCollectThunk = () => async (dispatch: Dispatch, getState: () => RootState) => {
    // console.log(getState().account.email)
    dispatch(setIsLoading(true))
    const data = await axiosGetCollect()
    // console.log(data.source.data.completedTasks)

    if(data.resultCode === 0){
        dispatch(setReffReward(data.source.data.reffReward))
        dispatch(setUserBalance(data.source.data.balance))
        dispatch(setResponseErrorMessage(""))
    }else{
        // console.log("userGetTaskCountThunk ERROR")
    }
    dispatch(setIsLoading(false))
}



export const {
    setAuthAC, 
    setUserData, 
    setResponseErrorMessage, 
    setUserBalance, 
    setIsLoading, 
    setUserWallet, 
    setUserDepositHistory, 
    setTeamList, 
    setCompletedTasks, 
    resetUserData, 
    setUserWithdrawalHistory, 
    setLostTimeToUpdate,
    setReffReward} = accountSlice.actions

export default accountSlice.reducer