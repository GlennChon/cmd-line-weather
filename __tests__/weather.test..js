const { setQueryType } = require('../weather')
// test file

describe('Setup', () => {
  it("Should set url type: 'q' ", () => {
    expect(setQueryType('CityNameString')).toBe('q')
  })

  it("Should set url type: 'zip' ", () => {
    expect(setQueryType('12345')).toBe('zip')
  })
})

// describe('API Call/Response', () => {
//   // getWeather,
//   // getResp,
// })
// describe('Conversions', () => {
//   // getLocalTime,
//   // kelvinToF,
//   // kelvinToC
// })
