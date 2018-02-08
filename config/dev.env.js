'use strict'
require('dotenv').config({silent: true})
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KOA_PORT: `${process.env.KOA_PORT || 443}`
})
