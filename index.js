const axios = require('axios')
const http = require('http')
const fs = require('fs')
const arreglo = [];
const PORT = process.env.PORT || 3000


/** 
1. Hacer uso de Async/Await para las funciones que consulten los endpoints de la
pokeapi.
 */

const pokemonesPromesas = [];
const pokemones = [];
async function pokemonesGet() {
const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150&offset=200')
return data.results
}



async function getFullData(name) {
const { data } = await
axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
return data
}

pokemonesGet().then((results) => {
results.forEach((p) => {
let pokemonName = p.name
pokemonesPromesas.push(getFullData(pokemonName))
})

/** 
2. Usar el Promise.all() para ejecutar y obtener la data de las funciones asíncronas
generando un nuevo arreglo con la data a entregar en el siguiente requerimiento.
*/

Promise.all(pokemonesPromesas).then((data) => {
//console.log(data[0].sprites.back_default);
   data.forEach((p) => {
//console.log(`${p.name} - foto: ${p.sprites.back_default}`);

pokemones.push({
nombre : p.name,
img : p.sprites.back_default
});
})
console.log(pokemones);
return pokemones; 
})
})


/** 
3. Disponibilizar la ruta http://localhost:3000/pokemones que devuelva un JSON con el
nombre y la url de una imagen de 150 pokemones, asi como verás en la siguiente
imagen.
 */

http.createServer((req, res) => {

if (req.url == '/') { 
    res.writeHead(200, { 'Content-Type': 'text/html' })

    fs.readFile('index.html', 'utf8', (err, data) => {
        res.end(data)
    });
}

if (req.url == '/pokemones') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
   
    res.write(JSON.stringify( pokemones ));
    res.end();

}


}).listen(PORT, () => console.log('Server on', process.pid));