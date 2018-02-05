const mongoose = require('mongoose')

const dbuser = 'fullstack'
const dbpass = 'FullStackBroads'
const url = `mongodb://${dbuser}:${dbpass}@ds125388.mlab.com:25388/fullstack-persons`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    'name': String,
    'number': String
})

personSchema.statics.format = (person) => ({        
    id: person._id,
    name: person.name,
    number: person.number
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person