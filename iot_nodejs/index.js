// redis
const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: 'i9a203.p.ssafy.io',
        port: '6379'
    },
    username: '',
    password: ''
});
client.on('connect', () => {
    console.info('Redis connected!');
});
client.on('error', (err) => {
    console.log('Redis Server Error', err)
});
client.connect().then();

// express
const express = require('express');
const app = express();

// constrants
const PORT = process.env.PORT || 3010;

app.get('/iot/:iot_command', async (req, res) => {
    console.log('GET /' + req.params.iot_command);
    res_value = client.get('iot' + req.params.iot_command, (err, reply) => {
        console.log(reply);
    });
    res.send(res_value);
});

app.get('/default', async (req, res) => {
    console.log('DEFAULT /' + req.params.iot_command);
    res_value = client.get('iot1_toy', (err, reply) => {
        console.log(reply);
    });
    console.log('initinal value: ' + res_value);
    res_value = client.set('iot1_toy', '5');
    res_value = client.get('iot1_toy', (err, reply) => {
        console.log(reply);
    });
    console.log('changed value: ' + res_value);
    res.send(res_value);
    console.log('END');
});

app.listen(PORT, () => console.log('Listening on port', PORT));