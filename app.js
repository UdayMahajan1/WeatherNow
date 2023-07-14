const express = require("express")
const port = 3000
const app = express()
const ejs = require('ejs')
const fetchData = require('./api/data')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

var initialCities = ["Mumbai", "London", "New York", "Moscow"]

app.get('/', (req, res) => {
    var initialData = []

    const getData = async () => {
        const promises = initialCities.map(async (cityName) => {
            return fetchData(cityName);
        })

        initialData.push(...await Promise.all(promises))
        res.render('index', { data: initialData })
    }

    getData()
})

app.post('/', async (req, res) => {
    
    var numbers = Object.keys(req.body)
    numbers.forEach((number) => {
        if( req.body[number] !== '' ) {
            initialCities[Number(number)] = req.body[number]
        }
    })
    res.redirect('/')
})

app.post('/resetCities', (req, res) => {
    initialCities = ["Mumbai", "London", "New York", "Moscow"]
    res.redirect('/')
})

app.listen(port, () => console.log(`Server is running on port ${port}`)) 