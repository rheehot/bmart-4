const jwt = require('jsonwebtoken')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const { FILE_PATH } = require('../../config/config')

require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? FILE_PATH.env_dev : FILE_PATH.env_prod,
})

function isLoggedIn(req, res, next) {
  // const token = req.headers.authorization.split(' ')[1]
  // if (!token) {
  //   res.status(StatusCodes.UNAUTHORIZED).json({ message: ReasonPhrases.UNAUTHORIZED })
  // }

  // const isValid = jwt.verify(token, process.env.JWT_SECRET)
  // if (!isValid) {
  //   res.status(StatusCodes.FORBIDDEN).json({ message: ReasonPhrases.FORBIDDEN })
  // }

  // const userId = jwt.decode(token).id
  // res.locals.userId = userId
  res.locals.userId = 2
  next()
}

module.exports = {
  isLoggedIn,
}
