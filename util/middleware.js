const jwt = require("jsonwebtoken");
const {SECRET} = require("./config");
const { isValid } = require("../models/session");
const error = require("jsonwebtoken/lib/JsonWebTokenError");
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === "SequelizeDatabaseError") {
    response.status(400).send({ error: error.message })
  }

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      if (!(await isValid(token))) {
        return res.status(401).send({ error: 'token invalid' })
      }
    } catch {
      return res.status(401).json({error: 'token invalid'})
    }
  } else {
    return res.status(401).json({error: 'token missing'})
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }