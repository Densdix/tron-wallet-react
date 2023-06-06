import {Router} from "express"
import accountRoute from './accountRoute'

const router = Router()

router.use('/accounts', accountRoute)

export default router