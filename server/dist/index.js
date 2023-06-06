"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const sequelizedb_1 = __importDefault(require("./db/sequelizedb"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const models_1 = __importDefault(require("./models/models"));
//const models = require('./models/models')
const cors = require('cors');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    // fullHost: 'https://api.trongrid.io',  // For Mainnet
    fullHost: 'https://api.shasta.trongrid.io', // For Shasta testnet
});
const PORT = process.env.PORT || 5000;
exports.app = (0, express_1.default)();
const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: process.env.CORS,
    credentials: true,
    optionSuccessStatus: 200
};
exports.app.use(cors(corsOptions));
exports.app.use(express_1.default.json());
exports.app.use('/api', routes_1.default);
exports.app.get('/', (req, res) => {
    res.status(200).json({ message: 'Working!' });
});
let bal = 0;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
setInterval(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const server = yield models_1.default.Server.findAll();
        const lostTimeToUpdate = (timeInMilis) => {
            return new Date(timeInMilis).toISOString().slice(11, 19);
        };
        if (server && Object.keys(server).length === 0) {
            console.log("server table is empty");
            yield models_1.default.Server.create({ lastUpdate: new Date() });
            console.log("server table is written");
        }
        else {
            // console.log(day)
            // console.log("server table has value") 
            const server = yield models_1.default.Server.findOne({ order: [['createdAt', 'DESC']] });
            const lastUpdateDate = server === null || server === void 0 ? void 0 : server.lastUpdate;
            const followingMinute = new Date(lastUpdateDate.getTime() + 60000);
            if (lastUpdateDate.getTime() + day < Date.now()) {
                // if (true) {
                console.log("time is expired");
                yield models_1.default.Server.create({ lastUpdate: new Date(new Date().setMinutes(0, 0, 0)) });
                const allUsers = yield models_1.default.Accounts.findAll({ attributes: ['trxAddressBase58'] });
                allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                    let delay = randomInteger(1000, 120000);
                    setTimeout(function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                console.log("Delay: " + delay);
                                const trxAccountBallance = yield tronWeb.trx.getBalance(user.trxAddressBase58).then((result) => result / 1000000);
                                console.log(`${user.trxAddressBase58} : ${trxAccountBallance}`);
                                if (trxAccountBallance !== 0 || user.tasksCompleted !== 0) {
                                    yield models_1.default.Accounts.update({ balance: trxAccountBallance, tasksCompleted: 0 }, { where: { trxAddressBase58: user.trxAddressBase58 } });
                                }
                            }
                            catch (error) {
                                console.log("UPDATING ALL TRX WALLET BALANCES: " + error);
                            }
                        });
                    }, delay);
                }));
                console.log("User ballances was updated!");
            }
            else {
                console.log(lostTimeToUpdate((lastUpdateDate.getTime() + day) - Date.now()));
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
    });
}, minute * 10);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelizedb_1.default.authenticate();
        yield sequelizedb_1.default.sync();
        exports.app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
