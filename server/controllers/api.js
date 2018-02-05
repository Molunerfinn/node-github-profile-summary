require('dotenv').config({silent: true})
const jwt = require('jsonwebtoken')
const utils = require('../utils')
const axios = require('axios')
const JWT_SECRET = process.env.JWT_SECRET
let rateLimit = 5000
let createdAt = new Date()
console.log(rateLimit, createdAt)

/**
 *
 * @return boolean or token
 */
const checkUserIsStarringRepo = async (ctx) => {
  let token = null
  const username = ctx.params.username
  const res = await utils.gqlSender(username, 'userInfo')
  const success = res.user.starredRepositories.nodes.some(item => {
    return item.name === 'PicGo' && item.owner.login === 'Molunerfinn'
  })

  if (success) {
    token = jwt.sign({
      username,
      name: res.user.name,
      createdAt: res.user.createdAt,
      email: res.user.email,
      avatarUrl: res.user.avatarUrl,
      bio: res.user.bio,
      url: res.user.url
    }, JWT_SECRET)
  }

  ctx.body = {
    success,
    token
  }
}

/**
 *
 * @return userData
 */
const getUserData = async (ctx) => {
  const username = ctx.params.username
  let obj = {}
  obj.userInfo = ctx.token
  let results = await Promise.all(promiseQueue.map(item => item(username, ctx.token.createdAt)))
  for (let i in results) {
    obj[getLists[i]] = results[i]
  }
  ctx.body = {
    success: true,
    ...obj
  }
}

/**
 *
 * @param {String} username
 */
const getUsercommits = (username) => {
  return axios.get(`https://github.com/users/${username}/contributions`)
    .then(data => utils.handleUserCommits(data.data))
}

/**
 *
 * @param {String} username
 * @param {Date} createdAt
 */
const getUserRepos = async (username, createdAt) => {
  const res = await utils.gqlSender(username, 'userRepos', {createdAt})
  rateLimit = res.rateLimit.remaining
  return res.user.repositories
}

const getRateLimit = async () => {
  const res = await utils.gqlSender('', 'rateLimit')
  rateLimit = res.rateLimit.remaining
}

// For Promise.all()
const getLists = [
  'userRepo',
  'userCommits'
]

const promiseQueue = [
  getUserRepos,
  getUsercommits
]

module.exports = {
  checkUserIsStarringRepo,
  getUserData,
  getRateLimit
}
