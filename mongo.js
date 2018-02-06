const mongoose = require('mongoose')

const dbuser = ''
const dbpass = ''
const url = `mongodb://${dbuser}:${dbpass}@ds125388.mlab.com:25388/fullstack-persons`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    'name': String,
    'number': String
})

const savePerson = (name, number) => {
    const person = new Person({ name, number })
    person.save().then(result => {mongoose.connection.close()})
}

const printPersons = () => {
    console.log('puhelinluettelo')
    Person.find({}).then(result => {
        result.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
    console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
    savePerson(name, number)
}

const main = () => {
    var personParams, name, number
    [ , , ...personParams] = process.argv
    if (personParams.length === 0) {
        printPersons()
    } else {
        [ name, number ] = personParams
        addPerson(name, number)
    }
}

main()