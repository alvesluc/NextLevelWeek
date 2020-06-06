const express = require('express')
const nunjucks = require('nunjucks')
const server = express();

const db = require("./database/db")

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

nunjucks.configure('src/views', {
    express: server,
    noCache: true
})


server.get('/', (req, res) => {
    return res.render('index.html')
})

server.get('/create-point', (req, res) => {

    return res.render('create-point.html')
})

server.post("/save-point", (req, res) => {

    // req.body: O corpo do nosso formulário
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})

server.get('/search', (req, res) => {

    const search = req.query.search

    if (search == "") {
        return res.render('search-results.html', {})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}'%`, function(err, rows) {
        if (err) {
            return console.log(err)
        }
        return res.render('search-results.html', { places: rows })
    })

})

server.listen(3000)