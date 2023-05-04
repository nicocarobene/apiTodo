import mongoose from 'mongoose'
import { MONGO_CONECT } from './Mongo_DB'

mongoose.connect(MONGO_CONECT)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  void mongoose.disconnect()
})
