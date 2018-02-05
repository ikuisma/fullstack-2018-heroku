const mongoose = require('mongoose')

const dbuser = 'fullstack'
const dbpass = 'FullStackBroads'
const url = `mongodb://${dbuser}:${dbpass}@ds125388.mlab.com:25388/fullstack-persons`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    'name': String,
    'number': String
})

module.exports = Person