require("dotenv").config(() => {
  if (process.env.NODE_ENV === "production")
    return { path: '.env.production' }
  else if (process.env.NODE_ENV === "development")
    return { path: '.env.development' }
  else return
})

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const { routers } = require('./routes')
const { triggerJobs } = require("./jobs")

triggerJobs()

const PORT = (process.env.PORT || 4000)
const WHITELIST_ORIGIN = ['https://fxethers.com', 'http://127.0.0.1']

// mongoose connect
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('MongoDB connected'))
  .catch(console.error)

app.use(cors({ origin: WHITELIST_ORIGIN }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// router
routers(app)
app.use(express.static('public'))
// app.use('metadata/pictures/file', express.static('public/pictures/items'))
// app.use('account/avatars', express.static('public/pictures/avatars'))

// catch 404 and forward to error handler
app.use((_req, _res, next) => next(createError(404)))

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.status(404).json('404 Not found')
})

app.listen(PORT, () => {
  console.log('Server is running on Port:', PORT)
})
