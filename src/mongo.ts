import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import { MONGO_CONECT } from './mongoConect'

mongoose.connect(process.env.MONGO_CONECT as string)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  void mongoose.disconnect()
})
