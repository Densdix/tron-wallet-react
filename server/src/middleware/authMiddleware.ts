import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { TypedRequestUser } from "../controllers/accountController"

const authMiddleware: RequestHandler = (req: TypedRequestUser, res, next) => {
    if(req.method === 'OPTIONS'){
        next()
    }
    try {
        const token = req.headers.authorization?.split(' ')[1] //Bearer tokenkey
        if(!token){
            //Разобраться как вернуть 401 статус и обработать на клиенте
            return res.status(200).json({
                resultCode: 1,
                errorMessage: "No authorize",
                source: {}
            })
        }
        console.log("authMiddleware token: "+ token)   

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string)
        console.log("authMiddleware decoded token: "+ decoded)   
        req.user = decoded as Record<string, any>
        next()
    } catch (error) {
        //Разобраться как вернуть 401 статус и обработать на клиенте
        res.status(200).json({
            resultCode: 1,
            errorMessage: "No authorize",
            source: {}
        })
    }
}

export default authMiddleware