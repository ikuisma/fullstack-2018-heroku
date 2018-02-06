const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const PORT = process.env.PORT || 3001

morgan.token('data', ( request ) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms : '))
app.use(cors())

const stripId = (request) => request.params.id

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(p => {
            res.json(p.map(Person.format))
        })
})

app.post('/api/persons', (req, res) => {
    const data = Object.assign({}, req.body)
    Person
        .findOne({ name: data.name })
        .then(person => {
            if (person) {
                return Promise.reject('Person with name already exists')
            } else {
                return data
            }
        })
        .then(data => {
            if (!data.name || !data.number) {
                return Promise.reject('Missing name or number')
            } else {
                return data
            }
        })
        .then(data => {
            const person = new Person(data)
            person
                .save()
                .then(Person.format)
                .then(person => {
                    res.json(person)
                })
        }).catch(error => {
            res.status(400).send({ error })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const id = stripId(req)
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    Person
        .findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch( () => {
            res.status(400).send({ error: 'malformatted id. ' })
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = stripId(req)
    Person.findById(id).then( person => {
        if (person) {
            res.json(Person.format(person))
        } else {
            res.status(404).end()
        }
    }).catch( () => {
        res.status(400).send({ error: 'malformatted id. ' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = stripId(req)
    Person
        .findByIdAndRemove(id)
        .then( () => {
            res.status(204).end()
        })
        .catch( () => {
            res.status(400).send({ error: 'malformatted id. ' })
        })
})

app.get('/info', (req, res) => {
    Person.find({})
        .then( persons => {
            res.send(`
                <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                <p>${new Date()}</p>
            `)
        })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})