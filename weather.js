const chalk = require('chalk')
const boxen = require('boxen')
const moment = require('moment')
const fetch = require('node-fetch')
const api = require('./api')

const getWeather = async () => {}

const setQueryType = (val) => {}

const getResp = async (url, val) => {}

const kelvinToF = (k) => (k * 1.8 - 459.67).toFixed(2)

const kelvinToC = (k) => (k - 273.15).toFixed(2)

const getLocalTime = (UTCSecOffset) =>
  new moment().utc().add(UTCSecOffset, 's').format('HH[:]mm')

const displayWeather = async () => {}

displayWeather()
module.exports = {
  getWeather,
  setQueryType,
  getResp,
  kelvinToC,
  kelvinToF,
  getLocalTime,
  displayWeather
}
