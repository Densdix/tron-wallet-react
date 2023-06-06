import { Router } from "express"
import accountController from "../controllers/accountController"
import authMiddleware from "../middleware/authMiddleware"

const accountRoute = Router()

accountRoute.post('/registration', accountController.registration)
accountRoute.post('/login', accountController.login)
accountRoute.post('/wallet', authMiddleware, accountController.setWallet)
accountRoute.post('/withdrawal', authMiddleware, accountController.withdrawal)

accountRoute.get('/auth', authMiddleware, accountController.check)
accountRoute.get('/ballance', authMiddleware, accountController.getBallance)
accountRoute.get('/depositHistory', authMiddleware, accountController.getDepisitHistory)
accountRoute.get('/withdrawalHistory', authMiddleware, accountController.getWithdrawalHistory)
accountRoute.get('/teamlist', authMiddleware, accountController.getTeamList)
accountRoute.get('/collect', authMiddleware, accountController.collect)



export default accountRoute