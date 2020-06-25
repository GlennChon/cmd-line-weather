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

const centerPadding = (text, totalPadLength) => {
  const padding = Array(totalPadLength).fill('\xa0').join('')
  return padding + text + padding
}

const rightFill = (text, totalPadLength) => {
  const textLength = text.length
  if (textLength <= totalPadLength) {
    const padding = Array(totalPadLength - textLength)
      .fill('\xa0')
      .join('')
    return text + padding
  } else {
    return text
  }
}

const displayWeather = async () => {
  let allLocations = await getWeather()

  if (allLocations.length > 0) {
    console.log(
      boxen(
        `${chalk.yellow.bold('Current Weather')}\n\n${centerPadding(
          'Search Term',
          8
        )}|${centerPadding('City', 10)}|${centerPadding(
          'Weather',
          5
        )}|${centerPadding('Description', 8)}|${centerPadding('Time', 3)}`,
        {
          padding: { top: 1, right: 0, bottom: 1, left: 0 },
          margin: 0,
          borderStyle: 'double',
          borderColor: 'blueBright',
          align: 'center'
        }
      )
    )
    allLocations.map((loc) => {
      const searchTerm = '  ' + loc.searchTerm
      const city = loc.city
      const weather = loc.weather
      const description = loc.description
      const time = loc.time.toString()
      console.log(
        chalk.green(
          rightFill(searchTerm, 30) +
            rightFill(city, 25) +
            rightFill(weather, 18) +
            rightFill(description, 28) +
            rightFill(time, 10) +
            '\n'
        )
      )
    })
  }
}
displayWeather()
module.exports = {
  displayWeather,
  getWeather,
  setQueryType,
  getResp,
  getLocalTime,
  kelvinToF,
  kelvinToC
}
