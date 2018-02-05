const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const idMax = 10000
const PORT = process.env.PORT || 3001

morgan.token('data', (request, response) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms : '))
app.use(cors())

let persons = []

const userWithNameExists = (name) => {
    return false
}

const stripId = (request) => Number(request.params.id)

const randomId = () => Math.floor(Math.random() * idMax)

const validationErrors = (person) => {
    const errors = []
    if (!person.name || !person.number) {
        errors.push('Missing name or number. ')
    } else if (userWithNameExists(person.name)) {
        errors.push('Name must be unique')
    }
    return errors
}

const formatPerson = (person) => {
    return {
        id: person._id,
        name: person.name,
        number: person.number
    }
}

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(p => {
            res.json(p.map(formatPerson))
        })
})

app.post('/api/persons', (req, res) => {
    const data = {...req.body}
    const errors = validationErrors(data)
    if (errors.length === 0) {
        const person = new Person(data);
        person
            .save()
            .then(person => {
                res.json(person)
            })
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})