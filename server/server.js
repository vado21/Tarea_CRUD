//Eduardo Andre Martinez Romero A00819264
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const axios = require('axios');

const router = express.Router();

app.use(express.json())
app.use(cors())
app.use("/", router);
let pokemons = []
let types = {}

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    "_id": String,
    data: JSON
})
var user = mongoose.model('tipos', SomeModelSchema)

var BaseExistente = false;


mongoose.connect('mongodb://localhost:27017/Pokemon', { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connection.once('open', function() {
    console.log('connection has been made')
}).on('error', function(error) {
    console.log('error is:', error)
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

user.findById("Tipos", function(err, docs) {
    if (err) {
        console.log("Base de datos vacia");
    } else {
        if (docs == null) {
            console.log("Base de datos vacia");
            BaseExistente = false;
        } else {
            BaseExistente = true;
            console.log("Result : ", docs.data)
            types = docs.data
            console.log(types)
        }
    }
});


function processParams(req) {
    return Object.assign({}, req.body, req.params, req.query)
}
// crear something from data in body
app.get('/getall', async(req, res) => {
        res.send(types)
            //console.log(types)
    })
    //Metodo GET
app.get('/:type/:name', async(req, res) => {
    let params = processParams(req)
    let type = params.type
    let nombre = params.name
    let info = params.info
    if (type.toString() == "pokemon") {
        var Index = pokemons.findIndex(x => x.pokemonName === params.name.toString())
        if (Index == -1) {
            axios.get("https://pokeapi.co/api/v2/pokemon/" + params.name.toString())
                .then(response => {
                    const pokemon = response.data
                    let typeNames = []
                    pokemon.types.forEach((typeData) => {
                        typeNames.push(typeData.type.name)
                    })
                    var Imagenid = pokemon.id.toString()
                    var peso = parseFloat(pokemon.weight)
                    var altura = pokemon.height.toString()
                    var experiencia = pokemon.base_experience
                    const pad = '000';
                    var formattedIndex = pad.substring(0, pad.length - Imagenid.length) + Imagenid;
                    var url = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/" + formattedIndex.toString() + ".png";
                    pokemons.push({
                        id: Imagenid,
                        pokemonName: params.name,
                        weight: peso,
                        height: altura,
                        types: typeNames,
                        exp: experiencia,
                        image: url
                    })
                    Index = pokemons.findIndex(x => x.pokemonName === params.name.toString())
                    console.log(pokemons[Index])
                    res.send(pokemons[Index])
                    if (types[type.toString()] != null) {
                        if (types[type.toString()][nombre.toString()] != null) {
                            let objetoinfo = pokemons[Index]
                            types[type.toString()][nombre.toString()] = objetoinfo
                                //var DATA = { "_id": "Tipos", data: types }
                                //new user(DATA).save(function(err, doc) {})

                            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                                if (err) {
                                    //res.send(err)
                                } else {
                                    //res.send(result)
                                }
                            })

                        } else {
                            let objetoinfo = pokemons[Index]
                            types[type.toString()][nombre.toString()] = objetoinfo
                            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                                if (err) {
                                    //res.send(err);
                                } else {
                                    //res.send(result);
                                }
                            })
                        }
                    } else {
                        let objetoinfo = pokemons[Index]
                        let objetonombre = {}
                        let objetotipo = {}
                        objetonombre = objetoinfo
                        objetotipo[nombre.toString()] = objetonombre
                        types[type.toString()] = objetotipo

                        user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                            if (err) {
                                //res.send(err)
                            } else {
                                if (result == null) {
                                    var DATA = { "_id": "Tipos", data: types }
                                    new user(DATA).save(function(err, doc) {})
                                }
                                //res.send(result)
                            }
                        })

                    }
                    console.log(types)
                })
                .catch(error => {
                    console.log("El pokemon no existe")
                    res.send("El pokemon no existe")
                })
        } else {
            console.log("El pokemon si esta en el diccionario")
            res.send(pokemons[Index])
            console.log(types)
        }
    } else {
        if (types[type.toString()] != null) {
            if (types[type.toString()][nombre.toString()] != null) {
                console.log(types[type.toString()][nombre.toString()])
                res.send(types[type.toString()][nombre.toString()])
            } else {
                console.log("No existe el nombre")
            }
        } else {
            console.log("No existe el tipo")
        }
    }
})

// crear something from data in body
app.post('/:type/:name', async(req, res) => {
    let params = processParams(req)
    let type = params.type
    let nombre = params.name
    let info = params.informacion
    console.log("Aqui va la info")
    console.log(info)
    if (type.toString() == "pokemon") {
        var Index = pokemons.findIndex(x => x.pokemonName === params.name.toString())
        if (Index == -1) {
            axios.get("https://pokeapi.co/api/v2/pokemon/" + params.name.toString())
                .then(response => {
                    const pokemon = response.data
                    let typeNames = []
                    pokemon.types.forEach((typeData) => {
                        typeNames.push(typeData.type.name)
                    })
                    var Imagenid = pokemon.id.toString()
                    var peso = parseFloat(pokemon.weight)
                    var altura = pokemon.height.toString()
                    var experiencia = pokemon.base_experience
                    const pad = '000';
                    var formattedIndex = pad.substring(0, pad.length - Imagenid.length) + Imagenid;
                    var url = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/" + formattedIndex.toString() + ".png";
                    pokemons.push({
                        id: Imagenid,
                        pokemonName: params.name,
                        weight: peso,
                        height: altura,
                        types: typeNames,
                        exp: experiencia,
                        image: url
                    })
                    Index = pokemons.findIndex(x => x.pokemonName === params.name.toString())
                    console.log(pokemons[Index])
                    res.send(pokemons[Index])
                    if (types[type.toString()] != null) {
                        if (types[type.toString()][nombre.toString()] != null) {
                            let objetoinfo = pokemons[Index]
                            types[type.toString()][nombre.toString()] = objetoinfo
                            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                                if (err) {
                                    //res.send(err)
                                } else {
                                    //res.send(result)
                                }
                            })
                        } else {
                            let objetoinfo = pokemons[Index]
                            types[type.toString()][nombre.toString()] = objetoinfo
                            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                                if (err) {
                                    //res.send(err)
                                } else {
                                    if (result == null) {
                                        var DATA = { "_id": "Tipos", data: types }
                                        new user(DATA).save(function(err, doc) {})
                                    }
                                    //res.send(result)
                                }
                            })
                        }
                    } else {
                        let objetoinfo = pokemons[Index]
                        let objetonombre = {}
                        let objetotipo = {}
                        objetonombre = objetoinfo
                        objetotipo[nombre.toString()] = objetonombre
                        types[type.toString()] = objetotipo

                        if (BaseExistente == true) {
                            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                                if (err) {
                                    //res.send(err)

                                } else {
                                    //res.send(result)
                                }
                            })
                        } else {
                            BaseExistente = true;
                            var DATA = { "_id": "Tipos", data: types }
                            new user(DATA).save(function(err, doc) {})
                        }
                        console.log("ENTROO AQUI")

                    }
                    console.log(types)
                })
                .catch(error => {
                    console.log("El pokemon no existe")
                    res.send("El pokemon no existe")
                })
        } else {
            console.log("El pokemon si esta en el diccionario")
            res.send(pokemons[Index])
            console.log(types)
        }

    } else if (types[type.toString()] != null) {
        if (types[type.toString()][nombre.toString()] != null) {
            let objetoinfo = { information: info }
            types[type.toString()][nombre.toString()] = objetoinfo
            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                if (err) {
                    //res.send(err)
                } else {
                    //res.send(result)
                }
            })
            res.send("se guardo")
        } else {
            let objetoinfo = { information: info }
            types[type.toString()][nombre.toString()] = objetoinfo
            if (BaseExistente == true) {
                user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                    if (err) {
                        //res.send(err)

                    } else {
                        //res.send(result)
                    }
                })
                res.send("se guardo")
            } else {
                BaseExistente = true;
                var DATA = { "_id": "Tipos", data: types }
                new user(DATA).save(function(err, doc) {})
                res.send("se guardo")
            }

        }
    } else {
        let objetoinfo = { information: info }
        let objetonombre = {}
        let objetotipo = {}
        objetonombre = objetoinfo
        objetotipo[nombre.toString()] = objetonombre
        types[type.toString()] = objetotipo
        if (BaseExistente == true) {
            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                if (err) {
                    //res.send(err)

                } else {
                    //res.send(result)
                }
            })
            res.send("se guardo")
        } else {
            BaseExistente = true;
            var DATA = { "_id": "Tipos", data: types }
            new user(DATA).save(function(err, doc) {})
            res.send("se guardo")
        }
        console.log("AQUI")
    }
    console.log(types)
})




app.put('/:type/:name', async(req, res) => {
    let params = processParams(req)
    let type = params.type
    let nombre = params.name
    let info = params.info
    if (types[type.toString()] != null) {
        if (types[type.toString()][nombre.toString()] != null) {
            let objetoinfo = { information: "informacion-actualizada" }
            types[type.toString()][nombre.toString()] = objetoinfo
            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                if (err) {
                    //res.send(err)
                } else {
                    //res.send(result)
                }
            })
        } else {
            console.log("No existe la informacion")
        }
    } else {
        console.log("No existe la informacion")
    }
    console.log(types)
})

app.delete('/:type/:name', async(req, res) => {
    let params = processParams(req)
    let type = params.type
    let nombre = params.name
    let info = params.info
    if (types[type.toString()] != null) {
        if (types[type.toString()][nombre.toString()] != null) {
            delete types[type.toString()][nombre.toString()]
            user.findByIdAndUpdate({ "_id": "Tipos" }, { data: types }, function(err, result) {
                if (err) {
                    //res.send(err)
                } else {
                    //res.send(result)
                }

            })
        } else {
            console.log("No existe la informacion")
        }
    } else {
        console.log("No existe la informacion")
    }
    console.log(types)
})

app.listen(3003)