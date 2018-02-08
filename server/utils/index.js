require('dotenv').config({silent: true})
const cheerio = require('cheerio')
const axios = require('axios')

axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + process.env.GH_TOKEN
    config.baseURL = 'https://api.github.com/graphql'
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

const gqlSender = async (username, type, opt = {}) => {
  return axios.post('', {
    query: gqlQuery(username, type, opt)
  }).then(res => {
    return res.data.data
  })
}

const gqlQuery = (username, type, opt) => {
  switch (type) {
    case 'userInfo':
      return handleUserInfo(username)
    case 'userRepos':
      return handleUserRepos(username, opt.createdAt)
    case 'rateLimit':
      return handleRateLimit()
  }
}

const handleUserInfo = (username) => {
  const query = `
    {
      user(login: "${username}"){
        name
        createdAt
        email
        avatarUrl
        bio
        url
        starredRepositories(first: 100 orderBy: {field: STARRED_AT, direction: DESC}) {
          nodes {
            name
            owner {
              login
            }
          }
        }
      }
    }
  `
  return query
}

const handleUserRepos = (username, createdAt) => {
  const query = `
    {
      rateLimit {
        cost
        limit
        remaining
        resetAt
      }
      user(login: "${username}") {
        repositories(affiliations: [OWNER, COLLABORATOR], isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          edges {
            node {
              name
              stargazers {
                totalCount
              }
              forkCount
              primaryLanguage {
                name
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(since: "${createdAt}") {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  return query
}

const handleUserCommits = (commits) => {
  const $ = cheerio.load(commits)
  const contribution = []
  const parseSvg = $('.day')
  let total = 0
  let obj = {
    year: '',
    month: '',
    count: 0
  }
  let lastMonth = ''
  for (let i = 0; i < parseSvg.length; i++) {
    const dataCount = +$(parseSvg[i]).attr('data-count')
    const dataDate = $(parseSvg[i]).attr('data-date') // ex. 2017-01-23
    const dataYear = dataDate.slice(0, 4) // ex. 2017
    const dataMonth = dataDate.slice(5, 7) // ex. 01
    if (obj.month !== '' && obj.month !== dataMonth) {
      lastMonth = obj.month
      contribution.push(Object.assign({}, obj))
      obj.year = dataYear
      obj.month = dataMonth
      obj.count = dataCount
    } else {
      obj.count += dataCount
      obj.year = dataYear
      obj.month = dataMonth
    }
    total += dataCount
  }
  console.log(obj.month, lastMonth)
  if (obj.month !== lastMonth) {
    contribution.push(Object.assign({}, obj))
  }
  return {
    contribution,
    total
  }
}

const handleRateLimit = () => {
  const query = `
    rateLimit {
      remaining
      resetAt
    }
  `
  return query
}

module.exports = {
  gqlSender,
  handleUserInfo,
  handleUserCommits,
  handleUserRepos
}
