const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

const idMax = 10000
const port = 3001

morgan.token('data', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms : '))
app.use(bodyParser.json())

let persons = [
    {name: "Arto Hellas", number: "040-123456", id: 1},
    {name: "Martti Tienari", number: "040-123456", id: 2},
    {name: "Arto Järvinen", number: "040-123456", id: 3},
    {name: "Lea Kutvonen", number: "040-123456", id: 4}
]

const stripId = (request) => Number(request.params.id)

const randomId = () => Math.floor(Math.random() * idMax)

const validationErrors = (person) => {
    const errors = []
    if (!person.name || !person.number) {
        errors.push('Missing name or number. ')
    } else if (persons.find(p => p.name == person.name)) {
        errors.push('Name must be unique')
    }
    return errors
}


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    const errors = validationErrors(person)
    if (errors.length === 0) {
        person.id = randomId()
        persons = persons.concat(person)
        res.json(person)
    } else {
        res.status(400).json({errors})
    }
})

app.get('/api/persons/:id', (req, res) => {
    const id = stripId(req)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    id = stripId(req)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`
        <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>
    `)
})

app.listen(port)
console.log(`Server running on port ${port}.`)