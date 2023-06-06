import sequelize from '../db/sequelizedb'
import { DataTypes, Model } from "sequelize";
import { BuildOptions } from 'typescript';

export interface IServer {
    id?: number,
    lastUpdate: Date
}

interface ServerInstance extends Model<IServer>, IServer {}

type ServerModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ServerInstance
}

const Server = sequelize.define('server', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    lastUpdate: {type: DataTypes.DATE}
}) as ServerModelStatic

export interface IAccounts {
    id?: number,
    email: string,
    password: string,
    fullname?: string,
    phoneNumber?: string,
    vipLevel?: number,
    balance?: number,
    extraBalance?: number,
    inviterId?: number,
    wallet?: string,
    trxPrivateKey: string,
    trxPublicKey: string,
    trxAddressBase58: string,
    tasksCompleted?: boolean,
    hasFirstDeposit?: boolean,
    reffReward?: number,
    createdAt?: Date
}
interface AccountsInstance extends Model<IAccounts>, IAccounts {}

type AccountsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): AccountsInstance
}

const Accounts = sequelize.define('accounts', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    fullname: {type: DataTypes.STRING},
    phoneNumber: {type: DataTypes.STRING},
    vipLevel: {type: DataTypes.INTEGER, defaultValue: 1},
    balance: {type: DataTypes.FLOAT, defaultValue: 0.0},
    extraBalance: {type: DataTypes.FLOAT, defaultValue: 0.0},
    inviterId: {type: DataTypes.INTEGER, defaultValue: 1},
    wallet: {type: DataTypes.STRING},
    trxPrivateKey: {type: DataTypes.STRING},
    trxPublicKey: {type: DataTypes.STRING},
    trxAddressBase58: {type: DataTypes.STRING},
    tasksCompleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    hasFirstDeposit: {type: DataTypes.BOOLEAN, defaultValue: false},
    reffReward: {type: DataTypes.FLOAT, defaultValue: 0.0}

}) as AccountsModelStatic

export interface IDepositHistory {
    id?: number,
    paymentAmount: number,
    status: boolean
    accountId: number,
    createdAt? : Date
}
interface DepositHistoryInstance extends Model<IDepositHistory>, IDepositHistory {}

type DepositHistoryModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DepositHistoryInstance
}

const DepositHistory = sequelize.define('depositHistory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    paymentAmount: {type: DataTypes.FLOAT, defaultValue: 0.0},
    status: {type: DataTypes.BOOLEAN}
}) as DepositHistoryModelStatic

Accounts.hasMany(DepositHistory)
DepositHistory.belongsTo(Accounts)

export interface IWithdrawalHistory {
    id?: number,
    withdrawAmount: number,
    status?: boolean
    accountId: number,
    createdAt? : Date
}

interface WithdrawalHistoryInstance extends Model<IWithdrawalHistory>, IWithdrawalHistory {}

type WithdrawalHistoryModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): WithdrawalHistoryInstance
}

const WithdrawalHistory = sequelize.define('withdrawalHistory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    withdrawAmount: {type: DataTypes.FLOAT, defaultValue: 0.0},
    status: {type: DataTypes.BOOLEAN}
}) as WithdrawalHistoryModelStatic

Accounts.hasMany(WithdrawalHistory)
WithdrawalHistory.belongsTo(Accounts)


export interface IReferrals {
    id?: number,
    ref: number,
    contact: number,
    lv: number,
    createdAt? : Date
}

interface ReferralsInstance extends Model<IReferrals>, IReferrals {}

type ReferralsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ReferralsInstance
}

const Referrals = sequelize.define('refferals', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    ref: {type: DataTypes.INTEGER},
    contact: {type: DataTypes.INTEGER},
    lv: {type: DataTypes.INTEGER},
}) as ReferralsModelStatic

export interface IRefferalFee {
    id?: number,
    refId: number,
    refEmail: string,
    contact: number,
    lv: number,
    fee: number,
    createdAt? : Date
}

interface RefferalFeeInstance extends Model<IRefferalFee>, IRefferalFee {}

type RefferalFeeModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): RefferalFeeInstance
}

const RefferalFee = sequelize.define('refferalFee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refId: {type: DataTypes.INTEGER},
    refEmail: {type: DataTypes.STRING},
    contact: {type: DataTypes.INTEGER},
    lv: {type: DataTypes.INTEGER},
    fee: {type: DataTypes.FLOAT}
}) as RefferalFeeModelStatic


export default {
    Accounts,
    DepositHistory,
    WithdrawalHistory,
    Server,
    Referrals,
    RefferalFee
}
