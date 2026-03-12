const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

//Register code
const bcrypt = require("bcrypt")

app.post("/register", async (req, res) => {

const username = req.body.username
const password = req.body.password

const hashedPassword = await bcrypt.hash(password, 10)

db.run(
"INSERT INTO users (username, password) VALUES (?, ?)",
[username, hashedPassword],
function(err){

if(err){
res.status(500).json(err)
return
}

res.json({message:"User created"})
})

})


//Add Login API
const jwt = require("jsonwebtoken")

const SECRET = "mysecretkey"

app.post("/login", (req, res) => {

const username = req.body.username
const password = req.body.password

db.get(
"SELECT * FROM users WHERE username = ?",
[username],
async (err, user)=>{

if(!user){
res.status(401).json({message:"User not found"})
return
}

const valid = await bcrypt.compare(password, user.password)

if(!valid){
res.status(401).json({message:"Invalid password"})
return
}

const token = jwt.sign({id:user.id}, SECRET)

res.json({token})

})

})
// Register API

const bcrypt = require("bcrypt")

app.post("/register", async (req, res) => {

const username = req.body.username
const password = req.body.password

const hashedPassword = await bcrypt.hash(password, 10)

db.run(
"INSERT INTO users (username, password) VALUES (?, ?)",
[username, hashedPassword],
function(err){

if(err){
res.status(500).json(err)
return
}

res.json({message:"User created"})
})

})



// Create table
db.run(`
CREATE TABLE IF NOT EXISTS meters (
id INTEGER PRIMARY KEY AUTOINCREMENT,
meterId TEXT,
previous INTEGER,
current INTEGER,
usage INTEGER
)
`);

//Create Login table
db.run(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
`)

//Technician Deshboard

db.run(`
CREATE TABLE IF NOT EXISTS jobs (
id INTEGER PRIMARY KEY AUTOINCREMENT,
technician TEXT,
location TEXT,
status TEXT
)
`)


// Get all meters
app.get("/meters", (req, res) => {

db.all("SELECT * FROM meters", [], (err, rows) => {

if(err){
res.status(500).json(err)
return
}

res.json(rows)

})

});

// Add meter reading
app.post("/meters", (req, res) => {

const meterId = req.body.meterId
const previous = req.body.previous
const current = req.body.current
const usage = current - previous

db.run(
"INSERT INTO meters (meterId, previous, current, usage) VALUES (?, ?, ?, ?)",
[meterId, previous, current, usage],
function(err){

if(err){
res.status(500).json(err)
return
}

res.json({
id: this.lastID,
meterId,
previous,
current,
usage
})

})

});

app.listen(3000, () => {
console.log("Server running on http://localhost:3000")
});

app.post("/jobs",(req,res)=>{

const technician = req.body.technician
const location = req.body.location
const status = "pending"

db.run(
"INSERT INTO jobs (technician,location,status) VALUES (?,?,?)",
[technician,location,status],
function(err){

res.json({id:this.lastID})

})

})