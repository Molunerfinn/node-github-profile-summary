require('dotenv').config({silent: true})
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async (ctx, next) => {
  const token = ctx.request.header.authorization.slice(7)
  try {
    const userInfo = jwt.verify(token, JWT_SECRET)
    delete userInfo.iat
    ctx.token = userInfo
    await next()
  } catch (e) {
    console.log(e)
    ctx.body = {
      success: false,
      message: 'You need to star the repo~'
    }
  }
}
