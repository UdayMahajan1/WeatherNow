const express = require("express")
const port = 3000
const app = express()
const ejs = require('ejs')
const fetchData = require('./api/data')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const initialCities = ["Mumbai", "London", "New York", "Moscow"]
    var initialData = []

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

app.post('/getWeather', async (req, res) => {
    const cityName = req.body.cityName
    const data = await fetchData(cityName)
    res.render('getWeather', { city: data })
})

app.listen(port, () => console.log(`Server is running on port ${port}`)) 