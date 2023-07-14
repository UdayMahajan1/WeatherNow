require('dotenv').config()
const https = require('node:https')
const appKey = process.env.APP_KEY

const fetchData = (cityName) => {
  return new Promise((res, rej) => {

      var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + appKey + "&units=metric"

      https.get(url, (resp) => {

          resp.on('data', (d) => {
              var weatherData = JSON.parse(d)
              if (resp.statusCode === 404) {
                  console.log("The city doesn't exist in our records. Sorry.")
                  data = {
                    cityName: `Not found the result for city name ${cityName}`,
                    temp: '',
                    weatherDesc: '',
                    icon: ''
                  }
                  res(data)

              } else {
                  var data = {
                      cityName: cityName,
                      temp: weatherData.main.temp,
                      weatherDesc: weatherData.weather[0].description,
                      icon: weatherData.weather[0].icon
                  }
                  res(data)
              }
          })
      }).on('error', (e) => {
          console.log(e)
      })

  })
}

module.exports = fetchData