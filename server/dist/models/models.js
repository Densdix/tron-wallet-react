"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelizedb_1 = __importDefault(require("../db/sequelizedb"));
const sequelize_1 = require("sequelize");
const Server = sequelizedb_1.default.define('server', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lastUpdate: { type: sequelize_1.DataTypes.DATE }
});
const Accounts = sequelizedb_1.default.define('accounts', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: sequelize_1.DataTypes.STRING, unique: true },
    password: { type: sequelize_1.DataTypes.STRING },
    fullname: { type: sequelize_1.DataTypes.STRING },
    phoneNumber: { type: sequelize_1.DataTypes.STRING },
    vipLevel: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1 },
    balance: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0.0 },
    extraBalance: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0.0 },
    inviterId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1 },
    wallet: { type: sequelize_1.DataTypes.STRING },
    trxPrivateKey: { type: sequelize_1.DataTypes.STRING },
    trxPublicKey: { type: sequelize_1.DataTypes.STRING },
    trxAddressBase58: { type: sequelize_1.DataTypes.STRING },
    tasksCompleted: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 }
});
const DepositHistory = sequelizedb_1.default.define('depositHistory', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentAmount: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0.0 }
});
Accounts.hasMany(DepositHistory);
DepositHistory.belongsTo(Accounts);
const Referrals = sequelizedb_1.default.define('refferals', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ref: { type: sequelize_1.DataTypes.INTEGER },
    contact: { type: sequelize_1.DataTypes.INTEGER },
    lv: { type: sequelize_1.DataTypes.INTEGER },
});
exports.default = {
    Accounts,
    DepositHistory,
    Server,
    Referrals
};
