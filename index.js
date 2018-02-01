const express = require('express')
const app = express()

let persons = [
    {name: "Arto Hellas", number: "040-123456", id: 1},
    {name: "Martti Tienari", number: "040-123456", id: 2},
    {name: "Arto Järvinen", number: "040-123456", id: 3},
    {name: "Lea Kutvonen", number: "040-123456", id: 4}
]

stripId = (request) => Number(request.params.id)

app.get('/api/persons', (req, res) => {
    res.json(persons)
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

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}.`)