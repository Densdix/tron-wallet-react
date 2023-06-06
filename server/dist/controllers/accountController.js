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
exports.getTasksCount = exports.completeTask = exports.getTeamList = exports.getDepisitHistory = exports.setWallet = exports.getBallance = exports.getAll = void 0;
require("dotenv/config");
const models_1 = __importDefault(require("../models/models"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accountsFirstRow_json_1 = __importDefault(require("../utils/initData/accountsFirstRow.json"));
const vipTarifs_json_1 = __importDefault(require("../utils/vipTarifs.json"));
const globals_1 = __importDefault(require("../utils/globals"));
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
    // fullHost: 'https://api.trongrid.io',  // For Mainnet
    fullHost: 'https://api.shasta.trongrid.io', // For Shasta testnet
});
const { Accounts, DepositHistory, Server, Referrals } = models_1.default;
const generateJwt = (id, email) => {
    return jsonwebtoken_1.default.sign({ id: id, email: email }, process.env.SECRET_KEY, { expiresIn: "24h" });
};
const registration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber, inviterId, fullname } = req.body;
    if (!email || !password) {
        return next(res.json({
            resultCode: 1,
            errorMessage: "Incorrect email or password",
            source: {}
        }));
    }
    const candidate = yield Accounts.findOne({ where: { email } });
    if (candidate) {
        return next(res.json({
            resultCode: 1,
            errorMessage: "User already exist",
            source: {}
        }));
    }
    if (email === accountsFirstRow_json_1.default.email) {
        console.log("accountsFirstRow init");
        const account = yield Accounts.create({
            email: email,
            password: accountsFirstRow_json_1.default.password,
            fullname: accountsFirstRow_json_1.default.fullname,
            phoneNumber: accountsFirstRow_json_1.default.phoneNumber,
            inviterId: accountsFirstRow_json_1.default.inviterId,
            trxPrivateKey: accountsFirstRow_json_1.default.trxPrivateKey,
            trxPublicKey: accountsFirstRow_json_1.default.trxPublicKey,
            trxAddressBase58: accountsFirstRow_json_1.default.trxAddressBase58
        });
        const jwtToken = generateJwt(account.id, account.email);
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
                    balance: account.balance + account.extraBalance,
                    wallet: account.wallet,
                    depositWallet: account.trxAddressBase58,
                    refCode: globals_1.default.getRefCodeFromId(account.id),
                    tasksCompleted: account.tasksCompleted
                }
            }
        });
    }
    const inviterExist = yield Accounts.findOne({ where: { id: globals_1.default.getIdFromRefCode(inviterId) } });
    const hashPassword = yield bcrypt_1.default.hash(password, 5);
    //const trxAccount: ItrxAccount = TronWeb.utils.accounts.generateAccount()
    const trxAccount = yield tronWeb.createAccount().then((result) => result);
    console.log(trxAccount);
    console.log(trxAccount.address);
    console.log(trxAccount.privateKey);
    console.log(trxAccount.publicKey);
    if (inviterExist) {
        const account = yield Accounts.create({
            email: email,
            password: hashPassword,
            fullname: fullname,
            phoneNumber: phoneNumber,
            inviterId: globals_1.default.getIdFromRefCode(inviterId),
            trxPrivateKey: trxAccount.privateKey,
            trxPublicKey: trxAccount.publicKey,
            trxAddressBase58: trxAccount.address.base58
        });
        const jwtToken = generateJwt(account.id, account.email);
        yield Referrals.create({
            ref: account.id,
            contact: globals_1.default.getIdFromRefCode(inviterId),
            lv: 1
        });
        yield Referrals.create({
            ref: account.id,
            contact: inviterExist.inviterId,
            lv: 2
        });
        const lv3Find = yield Accounts.findOne({ where: { id: inviterExist.inviterId } });
        if (lv3Find !== null) {
            yield Referrals.create({
                ref: account.id,
                contact: lv3Find.inviterId,
                lv: 3
            });
        }
        console.log("inviterExist: " + account.id);
        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    email: account.email,
                    fullname: account.fullname,
                    phoneNumber: account.phoneNumber,
                    inviterId: globals_1.default.getRefCodeFromId(account.inviterId),
                    balance: account.balance + account.extraBalance,
                    wallet: account.wallet,
                    depositWallet: account.trxAddressBase58,
                    refCode: globals_1.default.getRefCodeFromId(account.id),
                    tasksCompleted: account.tasksCompleted
                }
            }
        });
    }
    else {
        return next(res.json({
            resultCode: 1,
            errorMessage: "Invalid refferal code",
            source: {}
        }));
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield Accounts.findOne({ where: { email } });
    //console.log(allUsers)
    if (!user) {
        return next(res.json({
            resultCode: 1,
            errorMessage: "User not exist",
            source: {}
        }));
    }
    // const trxAccount = await tronWeb.trx.getAccount(user.trxAddressBase58).then((result: any) => result)
    // //check for empty object
    // if(trxAccount && Object.keys(trxAccount).length === 0 && Object.getPrototypeOf(trxAccount) === Object.prototype)
    //     console.log("Wallet is not activate")
    // else
    //     console.log(trxAccount)
    // const allUsers = await Accounts.findAll({attributes: ['trxAddressBase58']})
    // allUsers.map(u => console.log(u.trxAddressBase58))
    const trxAccountBallance = yield tronWeb.trx.getBalance(user.trxAddressBase58).then((result) => result / 1000000);
    console.log("trxAccountBallance", trxAccountBallance);
    let isBallanceUpdated = false;
    //for switch test network (|| true) NEED TO DELETE IN PROD!
    if (trxAccountBallance !== 0 || true) {
        yield Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: user.trxAddressBase58 } });
        isBallanceUpdated = true;
    }
    let comparePassword = bcrypt_1.default.compareSync(password, user.password);
    if (!comparePassword) {
        return next(res.json({
            resultCode: 1,
            errorMessage: "Incorrect email or password",
            source: {}
        }));
    }
    const jwtToken = generateJwt(user.id, user.email);
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
                balance: isBallanceUpdated ? trxAccountBallance + user.extraBalance : user.balance + user.extraBalance,
                wallet: user.wallet,
                depositWallet: user.trxAddressBase58,
                refCode: globals_1.default.getRefCodeFromId(user.id),
                tasksCompleted: user.tasksCompleted
            }
        }
    });
});
const check = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const user = yield Accounts.findOne({ where: { email } });
    if (!user) {
        return next(res.json({
            resultCode: 1,
            errorMessage: "User not exist",
            source: {}
        }));
    }
    const trxAccountBallance = yield tronWeb.trx.getBalance(user.trxAddressBase58).then((result) => result / 1000000);
    console.log("trxAccountBallance", trxAccountBallance);
    let isBallanceUpdated = false;
    //for switch test network (|| true) NEED TO DELETE IN PROD!
    if (trxAccountBallance !== 0 || true) {
        yield Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: user.trxAddressBase58 } });
        isBallanceUpdated = true;
    }
    const jwtToken = generateJwt(user.id, user.email);
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
                balance: isBallanceUpdated ? trxAccountBallance + user.extraBalance : user.balance + user.extraBalance,
                wallet: user.wallet,
                depositWallet: user.trxAddressBase58,
                refCode: globals_1.default.getRefCodeFromId(user.id),
                tasksCompleted: user.tasksCompleted
            }
        }
    });
});
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Accounts.findByPk(1);
    return res.json({
        resultCode: 0,
        data: account,
        errorMessage: ""
    });
});
exports.getAll = getAll;
const getBallance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    // const { email } = req.query
    const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    console.log("get from token email " + email);
    const account = yield Accounts.findOne({ where: { email: email } });
    const trxAccountBallance = yield tronWeb.trx.getBalance(account === null || account === void 0 ? void 0 : account.trxAddressBase58).then((result) => result / 1000000);
    console.log("trxAccountBallance", trxAccountBallance);
    let isBallanceUpdated = false;
    console.log("trxAccountBallance", trxAccountBallance);
    console.log("account?.balance", account === null || account === void 0 ? void 0 : account.balance);
    //for switch test network (|| true) NEED TO DELETE IN PROD!
    if (trxAccountBallance !== (account === null || account === void 0 ? void 0 : account.balance)) {
        console.log("ballance was updated");
        if (trxAccountBallance > (account === null || account === void 0 ? void 0 : account.balance)) {
            yield DepositHistory.create({ paymentAmount: trxAccountBallance - (account === null || account === void 0 ? void 0 : account.balance), accountId: account === null || account === void 0 ? void 0 : account.id });
            console.log("deposit history row was created");
        }
        yield Accounts.update({ balance: trxAccountBallance }, { where: { trxAddressBase58: account === null || account === void 0 ? void 0 : account.trxAddressBase58 } });
        isBallanceUpdated = true;
    }
    console.log((account === null || account === void 0 ? void 0 : account.email) + " " + (account === null || account === void 0 ? void 0 : account.balance));
    const jwtToken = generateJwt((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, (_d = req.user) === null || _d === void 0 ? void 0 : _d.email);
    return res.json({
        resultCode: 0,
        errorMessage: "",
        source: {
            token: jwtToken,
            data: {
                balance: isBallanceUpdated ? trxAccountBallance + (account === null || account === void 0 ? void 0 : account.fakeBalance) : (account === null || account === void 0 ? void 0 : account.balance) + (account === null || account === void 0 ? void 0 : account.fakeBalance),
            }
        }
    });
});
exports.getBallance = getBallance;
const setWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const { email, wallet } = req.body;
    console.log(`email: ${email} || wallet: ${wallet}`);
    const jwtToken = generateJwt((_e = req.user) === null || _e === void 0 ? void 0 : _e.id, (_f = req.user) === null || _f === void 0 ? void 0 : _f.email);
    if (tronWeb.isAddress(wallet)) {
        const isExistUserWallet = yield Accounts.findOne({ where: { wallet: wallet } });
        const isExistDepositWallet = yield Accounts.findOne({ where: { trxAddressBase58: wallet } });
        if (isExistUserWallet || isExistDepositWallet) {
            console.log("Adress already exist");
            return res.json({
                resultCode: 1,
                errorMessage: "Adress already exist",
                source: {}
            });
        }
        const user = yield Accounts.findOne({ where: { email: email } });
        yield Accounts.update({ wallet: wallet, fakeBalance: (user === null || user === void 0 ? void 0 : user.fakeBalance) + 10 }, { where: { email: email } });
        console.log("Adress was added and recieve bonus 10 trx,");
        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    wallet: wallet,
                }
            }
        });
    }
    else {
        console.log("Invalid adress");
        return res.json({
            resultCode: 1,
            errorMessage: "Invalid adress",
            source: {}
        });
    }
});
exports.setWallet = setWallet;
const getDepisitHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const { email } = req.query;
    const account = yield Accounts.findOne({ where: { email: email } });
    const depositRows = yield DepositHistory.findAll({ where: { accountId: account === null || account === void 0 ? void 0 : account.id } });
    const jwtToken = generateJwt((_g = req.user) === null || _g === void 0 ? void 0 : _g.id, (_h = req.user) === null || _h === void 0 ? void 0 : _h.email);
    const depositHistoryResponseData = [];
    //depositHistoryResponseData.push({amount: 1, createDate: new Date()})
    yield depositRows.map(deposit => depositHistoryResponseData.push({ amount: deposit.paymentAmount, createDate: deposit.createdAt }));
    console.log("123");
    console.log(depositHistoryResponseData);
    return res.json({
        resultCode: 0,
        errorMessage: "",
        source: {
            token: jwtToken,
            data: {
                depositHistory: depositHistoryResponseData,
            }
        }
    });
});
exports.getDepisitHistory = getDepisitHistory;
const getTeamList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    //const { email } = req.query
    const email = (_j = req.user) === null || _j === void 0 ? void 0 : _j.email;
    const account = yield Accounts.findOne({ where: { email: email } });
    const lv1List = yield Accounts.findAll({ where: { inviterId: account === null || account === void 0 ? void 0 : account.id } });
    const jwtToken = generateJwt((_k = req.user) === null || _k === void 0 ? void 0 : _k.id, (_l = req.user) === null || _l === void 0 ? void 0 : _l.email);
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
    const refList = yield Referrals.findAll({ where: { contact: account === null || account === void 0 ? void 0 : account.id } });
    let teamListArray = [];
    refList.map(user => teamListArray.push(user.ref));
    teamListArray.map(t => console.log(t));
    const teamList = yield Accounts.findAll({
        where: { id: teamListArray },
        order: [
            ['createdAt', 'ASC']
        ]
    });
    let teamListCompletedArray = [];
    yield teamList.map(ac => {
        refList.forEach(ref => {
            if (ac.id === ref.ref) {
                teamListCompletedArray.push({ id: ac.id, email: ac.email, fullName: ac.fullname, active: ac.wallet ? true : false, date: ac.createdAt, deposit: ac.balance, lv: ref.lv });
                console.log(`${ac.id}: ${ac.email}: ${ac.balance}: ${ac.phoneNumber} : ${ref.lv}: ${ac.wallet ? true : false} : ${ac.createdAt}`);
            }
        });
    });
    return res.json({
        resultCode: 0,
        errorMessage: "",
        source: {
            token: jwtToken,
            data: {
                teamList: teamListCompletedArray
            }
        }
    });
});
exports.getTeamList = getTeamList;
const completeTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    const { email } = req.query;
    const account = yield Accounts.findOne({ where: { email: email } });
    const jwtToken = generateJwt((_m = req.user) === null || _m === void 0 ? void 0 : _m.id, (_o = req.user) === null || _o === void 0 ? void 0 : _o.email);
    let priceForOneOrder = 0;
    yield vipTarifs_json_1.default.slice(0).reverse().every(t => {
        if (((account === null || account === void 0 ? void 0 : account.balance) + (account === null || account === void 0 ? void 0 : account.fakeBalance)) >= t.balancerequired) {
            console.log("Your vip is" + t.vipLevel);
            priceForOneOrder = t.priceForOneOrder;
            return false;
        }
        return true;
    });
    if ((account === null || account === void 0 ? void 0 : account.tasksCompleted) < 10) {
        yield models_1.default.Accounts.update({ tasksCompleted: (account === null || account === void 0 ? void 0 : account.tasksCompleted) + 1, fakeBalance: (account === null || account === void 0 ? void 0 : account.fakeBalance) + priceForOneOrder }, { where: { email: account === null || account === void 0 ? void 0 : account.email } });
        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    completedTasks: (account === null || account === void 0 ? void 0 : account.tasksCompleted) + 1
                }
            }
        });
    }
    else {
        return res.json({
            resultCode: 0,
            errorMessage: "",
            source: {
                token: jwtToken,
                data: {
                    completedTasks: account === null || account === void 0 ? void 0 : account.tasksCompleted
                }
            }
        });
    }
});
exports.completeTask = completeTask;
const getTasksCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q;
    const { email } = req.query;
    const account = yield Accounts.findOne({ where: { email: email } });
    const jwtToken = generateJwt((_p = req.user) === null || _p === void 0 ? void 0 : _p.id, (_q = req.user) === null || _q === void 0 ? void 0 : _q.email);
    return res.json({
        resultCode: 0,
        errorMessage: "",
        source: {
            token: jwtToken,
            data: {
                completedTasks: account === null || account === void 0 ? void 0 : account.tasksCompleted
            }
        }
    });
});
exports.getTasksCount = getTasksCount;
exports.default = {
    registration,
    login,
    check,
    getAll: exports.getAll,
    getBallance: exports.getBallance,
    setWallet: exports.setWallet,
    getDepisitHistory: exports.getDepisitHistory,
    getTeamList: exports.getTeamList,
    completeTask: exports.completeTask,
    getTasksCount: exports.getTasksCount
};
