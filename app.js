require('dotenv').config()
const express = require("express")
const port = 3000
const app = express()
const https = require('node:https')
const ejs = require('ejs')
const appKey = process.env.APP_KEY

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const initialCities = ["Mumbai", "London", "New York", "Moscow"]
    var initialData = []

    const fetchData = (cityName) => {
        return new Promise((res, rej) => {

            var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + appKey + "&units=metric"

            https.get(url, (resp) => {

                resp.on('data', (d) => {
                    var weatherData = JSON.parse(d)
                    if (resp.statusCode === 404) {
                        console.log("The city doesn't exist in our records. Sorry.")
                        rej(new Error("The city doesn't exist in our records. Sorry."))

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

    const getData = async () => {
        const promises = initialCities.map(async (cityName) => {
            return fetchData(cityName);
        })

        initialData.push(...await Promise.all(promises))
        console.log(initialData)

        res.render('index', { data: initialData })
    }

    getData()
})

app.post('/getWeather', (req, res) => {
    console.log(req.params)

    const cityName = req.body.cityName

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + appKey + "&units=metric"

    https.get(url, (resp) => {
        resp.on('data', (d) => {
            var weatherData = JSON.parse(d)
            if (resp.statusCode === 404) {
                res.send("The city doesn't exist in our records. Sorry.")
            } else {
                var temp = weatherData.main.temp
                var weatherDesc = weatherData.weather[0].description
                var icon = weatherData.weather[0].icon
                res.write("<h1>The temperature in " + cityName + " is " + temp + " degree celcius.</h1>")
                res.write("<p>Weather description : " + weatherDesc + "</p>")
                res.write("<img src = http://openweathermap.org/img/wn/" + icon + "@2x.png>")
                res.send()
                // console.log(weatherData) 
            }
        })
    }).on('error', (e) => {
        console.log(e)
    })
})

app.listen(port, () => console.log("Server is running on port 3000")) 