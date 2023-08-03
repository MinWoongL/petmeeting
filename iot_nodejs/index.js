// redis
const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: '6379'
    },
    username: '',
    password: ''
});

client.on('error', err => console.log('Redis Server Error', err));

// express
const express = require('express');
const app = express();

// constrants
const PORT = process.env.PORT || 3010;

app.get('/:iot_command', async (req, res) => {
    res_value = client.get('iot' + req.params.iot_command, (err, reply) => {
        console.log(reply);
    })
    res.send(res_value);
});

app.listen(PORT, () => console.log('Listening on port', PORT));