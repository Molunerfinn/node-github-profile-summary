const router = require('koa-router')()
const api = require('../controllers/api')
const userToken = require('../middlewares/user-token')

router.get('/check-status/:username', api.checkUserIsStarringRepo)

router.get('/user-profile/:username', userToken, api.getUserData)

module.exports = router
