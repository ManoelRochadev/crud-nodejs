require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import { routes } from './routes'

const app = express()

app.use(express.json())

app.use(routes)

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const mongoHost = 'containers-us-west-54.railway.app'
const mongoPort = 6792

mongoose
  .connect(`mongodb://${dbUser}:${dbPassword}@${mongoHost}:${mongoPort}`)
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(err => console.log(err))

app.listen(process.env.PORT || 3333, () => {
  console.log('Server started')
})
