const chalk = require('chalk')
const boxen = require('boxen')
const moment = require('moment')
const fetch = require('node-fetch')
const api = require('./api')

const getWeather = async () => {
  let inputValue = process.argv.slice(2)
  let requests = inputValue.map(async (val) => {
    const queryType = setQueryType(val)
    const urlVal = encodeURI(val)
    const url = `${api.url}${queryType}=${urlVal}&appid=${api.key}`
    return await getResp(url, val)
  })

  return Promise.allSettled(requests).then((responses) => {
    return responses.map((resp) => {
      return resp.value
    })
  })
}

const setQueryType = (val) => {
  if (val === undefined) {
  } else if (!isNaN(val)) {
    return 'zip'
  } else {
    return 'q'
  }
}

const getResp = async (url, val) => {
  return await fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        throw Error(`${res.statusText} for ${val}`)
      } else {
        return res.json()
      }
    })
    .then((json) => {
      if (json !== undefined) {
        return {
          searchTerm: val,
          city: json.name,
          weather: json.weather[0].main,
          description: json.weather[0].description,
          time: getLocalTime(json.timezone),
          tempC: kelvinToC(json.main.temp),
          tempF: kelvinToF(json.main.temp)
        }
      }
    })
    .catch((error) => {
      return {
        searchTerm: val,
        city: 'N/A',
        weather: 'N/A',
        description: error.message,
        time: 'N/A',
        tempC: 'N/A',
        tempF: 'N/A'
      }
    })
}

const kelvinToF = (k) => (k * 1.8 - 459.67).toFixed(2)

const kelvinToC = (k) => (k - 273.15).toFixed(2)

const getLocalTime = (UTCSecOffset) =>
  new moment().utc().add(UTCSecOffset, 's').format('HH[:]mm')

const displayWeather = async () => {
  let allLocations = await getWeather()
  console.log(allLocations)
}

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
