const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require ("body-parser")
const app = express()

const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"

const db = pgp(connectionString)
app.listen(4000, function(req,res){
    console.log("Server has started...")
})

app.use(bodyParser.urlencoded({extended: false}))

app.engine('mustache',mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.post('/delete-blog',function(req,res){
    let userid = req.body.userid
    db.none('DELETE FROM Posts WHERE userid = $1;',[userid])
    .then(function(){
        res.redirect('/blogs')
    })
    .catch(function(error){
        console.log(error)
    })
})

app.post('/blogs',function(req,res){

    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let blogscreated = req.body.blogscreated

   
     db.none('INSERT INTO Posts(firstname,lastname,blogscreated) VALUES($1,$2,$3)',[firstname,lastname,blogscreated])
    .then(function(){
        res.redirect('/blogs')
    })
    .catch(function(error){
        console.log(error)
    })

})

app.get('/blogs/new',function(req,res){
    res.render('new-blog')
})

app.get('/blogs',function(req,res){
db.any('SELECT firstname,lastname,blogscreated from Posts')
    .then(function(result){
        res.render('blogs',{blogs : result})
    })

})

