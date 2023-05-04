import mongoose from 'mongoose'
import { MONGO_CONECT } from './mongoConect'

mongoose.connect(MONGO_CONECT as string)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  void mongoose.disconnect()
})
