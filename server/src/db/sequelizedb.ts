import { Sequelize } from "sequelize";
import 'dotenv/config'

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbPassword = process.env.DB_PASSWORD as string

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
        dialect: 'postgres',
        host: dbHost,
    }
)

export default sequelizeConnection