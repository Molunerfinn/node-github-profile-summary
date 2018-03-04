'use strict'
require('dotenv').config({silent: true})
module.exports = {
  NODE_ENV: '"production"',
  KOA_PORT: `${process.env.KOA_PORT || 443}`,
  HTTPS: `${process.env.HTTPS}`
}
