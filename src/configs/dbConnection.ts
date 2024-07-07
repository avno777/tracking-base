import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { config } from './config'
import AuthService from '../services/auth.service'

dotenv.config()

const clientOption = {}

const DbConnection = (): void => {
  //const dbUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}?authSource=admin`
  const dbUrl = config.mongoose.url

  mongoose.connect(dbUrl, clientOption).catch((err) => {
    console.log(`Error connecting ${process.env.MONGODB_NAME} database:- ${err}`)
  })

  mongoose.connection.on('open', async () => {
    console.log(`Connected to ${process.env.MONGODB_NAME} database`)
  })

  mongoose.connection.on('disconnected', () => {
    console.log(`${process.env.MONGODB_NAME} database is disconnected.`)
  })

  mongoose.connection.on('error', (err) => {
    console.log(`Error: ${err}`)
  })
}

export default DbConnection
