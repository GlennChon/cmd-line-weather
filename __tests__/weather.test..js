const weather = require('../weather')
const api = require('../api.js')

describe('Setup', () => {
  it("should set url type: 'q' ", () => {
    expect(weather.setQueryType('CityNameString')).toBe('q')
  })

  it("should set url type: 'zip' ", () => {
    expect(weather.setQueryType('12345')).toBe('zip')
  })
})

describe('API Call/Response', () => {
  it('should return location weather data object', async () => {
    const url = `${api.url}q=new%20york%20city&appid=${api.key}`
    await weather.getResp(url, 'new york city').then((weatherObj) => {
      expect.objectContaining({
        searchTerm: 'new york city',
        city: 'New York City',
        weather: expect.any(String),
        description: expect.any(String),
        time: expect.any(String),
        tempC: expect.any(String),
        tempF: expect.any(String)
      })
    })
  })

  it('should return N/A in weather data object', async () => {
    const url = `${api.url}q=test&appid=${api.key}`
    await weather.getResp(url, 'test').then((weatherObj) => {
      expect.objectContaining({
        searchTerm: 'test',
        city: 'N/A',
        weather: 'N/A',
        description: expect.any(String),
        time: 'N/A',
        tempC: 'N/A',
        tempF: 'N/A'
      })
    })
  })

  it('should return an array of weather data objects', async () => {
    const locationsArr = ['philadelphia', 'Boulder', 'CAIRO', 'n/a']
    await weather.getWeather(locationsArr).then(() => {
      expect.arrayContaining(
        expect.objectContaining({
          searchTerm: expect.any(String),
          city: expect.any(String),
          weather: expect.any(String),
          description: expect.any(String),
          time: expect.any(String),
          tempC: expect.any(String),
          tempF: expect.any(String)
        })
      )
    })
  })
})

describe('Conversions', () => {
  // const kelvinToF = (k) => (k * 1.8 - 459.67).toFixed(2)
  it('should return 373.3K to 212.27F temp conversion as string', async () => {
    expect(weather.kelvinToF(373.3)).toBe('212.27')
  })

  it('should return 373.3K to 100.15C temp conversion as string', async () => {
    expect(weather.kelvinToC(373.3)).toBe('100.15')
  })

  it('should return time in HH:mm format', async () => {
    expect(weather.getLocalTime(10800)).toMatch(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    )
  })
})
