const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');


const app = express();

const DB = monk('localhost/alaTwitter');

const userMessages = DB.get('userMessages');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hi you there man'})
});

app.get('/userMessages', (req, res) => {
    userMessages
        .find()
        .then( userMessages => {
            res.json(userMessages);
        })
});

function isValidMessage(userMessage) {
        return userMessage.name && userMessage.name.toString().trim() !=='' &&
        userMessage.message && userMessage.message.toString().trim() !=='';
}

app.use(rateLimit({
    windowMs: 3*1000, // 3 sec
    max: 1 // limit each 1 post in 3 sec
}));

app.post('/userMessages', (req, res) => {
    if(isValidMessage(req.body)) {
     // insert into mongo DB
        const userMessage = {
            name: filter.clean(req.body.name.toString()),          // filter clean text from bad words
            message: filter.clean(req.body.message.toString()),    // filter clean text from bad words
            created: new Date()
        };

        userMessages
            .insert(userMessage)
            .then(createUserMessage => {
                res.json(createUserMessage);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Message required!'
        })
    }
});

app.listen(5000, () => {
    console.log('5000 listening...');
});
