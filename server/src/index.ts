import express, { Express, Request, Response } from 'express';
import sequelize from './db/sequelizedb'
import 'dotenv/config'
import router from './routes';
import models from "./models/models"
//const models = require('./models/models')
import rateLimit from 'express-rate-limit'
const cors = require('cors')
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    // fullHost: 'https://api.trongrid.io',  // For Mainnet
    fullHost: 'https://api.shasta.trongrid.io',  // For Shasta testnet
});

const PORT = process.env.PORT || 5000

export const app = express()

const corsOptions = {
    origin: process.env.CORS,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 50, // Limit each IP to 100 requests per `window` (here, per 1 minute)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', router)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Working!' })
    console.log("app.get('/') success")
})

let bal = 0
const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

setInterval(async function () {
    const server = await models.Server.findAll()

    const lostTimeToUpdate = (timeInMilis: number) => {
        console.log("timeInMilis: "+timeInMilis)
        return new Date(timeInMilis).toISOString().slice(11, 19)
    }


    if (server && Object.keys(server).length === 0) {
        console.log("server table is empty")
        await models.Server.create({ lastUpdate: new Date() })
        console.log("server table is written")
    } else {


        // console.log(day)

        // console.log("server table has value") 
        const server = await models.Server.findOne({ order: [['createdAt', 'DESC']] })
        const lastUpdateDate = server?.lastUpdate
        const followingMinute = new Date(lastUpdateDate!.getTime() + 60000)

        if (lastUpdateDate!.getTime() + day < Date.now()) {
            // if (true) {
            console.log("time is expired")
            await models.Server.create({ lastUpdate: new Date(new Date().setMinutes(0, 0, 0)) })

            // const allUsers = await models.Accounts.findAll({ attributes: ['trxAddressBase58'] })
            const allUsers = await models.Accounts.findAll()
            allUsers.map(async (user) => {
                let delay = randomInteger(1000, 120000)
                setTimeout(async function () {
                    try {
                        console.log("Delay: " + delay)
                        const trxAccountBallance = await tronWeb.trx.getBalance(user.trxAddressBase58).then((result: any) => result / 1000000)
                        console.log(`${user.trxAddressBase58} : ${trxAccountBallance}`)
                        if (trxAccountBallance !== 0 || user.tasksCompleted === true) {
                            console.log("user updated tasks "+" "+user.email+" "+user.tasksCompleted)
                            await models.Accounts.update({ balance: trxAccountBallance, tasksCompleted: false }, { where: { trxAddressBase58: user.trxAddressBase58 } })
                        }
                    } catch (error) {
                        console.log("UPDATING ALL TRX WALLET BALANCES: " + error)
                    }
                }, delay)
            })
            console.log("User ballances was updated!");
        } else {
            console.log(lostTimeToUpdate((lastUpdateDate!.getTime() + day) - Date.now()))
        }

        // console.log("lastUpdateDate!.getTime()", lastUpdateDate!.getTime())
        // console.log("lastUpdateDate", lastUpdateDate)
        // console.log("followingMinute", followingMinute)
    }





    // models.Accounts.update({
    //     balance: bal++,
    // },
    // {
    //     where:{id: 1}
    // }
    // )

}, minute * 10);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()


