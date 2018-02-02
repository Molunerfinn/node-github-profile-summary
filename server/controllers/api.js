require('dotenv').config({silent: true})
const octokit = require('@octokit/rest')()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
octokit.authenticate({
  type: 'token',
  token: process.env.GH_TOKEN
})

const checkUserIsStarringRepo = async (ctx) => {
  let token = null
  const username = ctx.params.username
  const obj = {
    username,
    per_page: 100
  }
  try {
    const repos = await octokit.activity.getStarredReposForUser(obj)
    const success = repos.data.some(item => {
      return item.repo.full_name === 'Molunerfinn/PicGo'
    })

    if (success) {
      token = jwt.sign({
        username: username
      }, JWT_SECRET)
    }

    ctx.body = {
      success,
      token
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
  }
}

const getUserData = async (ctx) => {
  const username = ctx.params.username
  try {
    let userInfo = await octokit.users.getForUser({username})
    userInfo = handleUserInfo(userInfo)
    ctx.body = {
      success: true,
      userInfo
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
  }
}

const handleUserInfo = (info) => {
  const data = info.data
  return {
    avatar: data.avatar_url,
    loginName: data.login,
    name: data.name,
    repos: data.public_repos,
    followers: data.followers,
    home: data.html_url,
    email: data.email,
    joined: data.created_at.slice(0, 10)
  }
}

module.exports = {
  checkUserIsStarringRepo,
  getUserData
}
