const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/db-config')
const Users = require('./users/user-model')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
    let user = req.body;


//validate the user

//hash the password
const hash = bcrypt.hashSync(user.password, 8);

//we override the password with the hash
user.password = hash;

Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error =>{
        res.status(500).json(error);
    })
});

server.post('/api/login', (req, res) => {
    let {username, password} = req.body;

    if (username && password){
        Users.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({message: `Welcom ${user.username}!`});
            }else{
                res.statusMessage(401).json({message:'You cannot pass!!'})
            }
        })
        .catch(error =>{
            res.status(500).json(error);
        })
    } else{
        res.status(400).json({message: 'please provide credentials'});
    }
});

server.get('/api/users', protected, (req, es) =>{
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(error => res.send(error))
});

server.get('/hash', (req, res) => {
    //read a password from the Authorization header
    const password = req.headers.authorization;

    if(password){
        //that 8 is how we slow don attackers tryingto pre-generate hashes
        const hash = bcrypt.hashSync(password, 10); //the 8 is the number of round 2^8
        //a good starting value is 15

        res.status(200).json({hash});
        //retun an object with the password hashed hashed using bcryptjs
    // { hash: '970(&(:OHKJHIY*HJKH(*^)*&YLKJBLKJGHIUGH(*P' }

    }else{
        res.status(400).json({message: 'please provide credentials'});
    }
});

//implement the protected middleware that will check for username and password
// in the headers and if valid, provide access to the endpoint
function protected(req, res, next){
    let {username, password} = req.headers;

    if(username && password ){
        Users.findBy({username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                next();
            } else {
                res.status(401).json({message: 'Incorrect user information'})
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
    } else {
        res.status(400).json({message: 'please provide credentials'});
    }
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n Running on port ${port}\n`));