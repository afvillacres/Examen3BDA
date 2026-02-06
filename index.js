const express = require('express');
const responseTime = require('response-time');
const { createClient } = require('redis');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(responseTime());

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error(' :C Error Redis:', err);
});

redisClient.connect()
    .then(() => console.log(' :D Conectado a Redis'))
    .catch(err => console.error(err));


//carga masiva de datos
app.post('/seed', async (req, res) => {
    const start = Date.now();
    const data = JSON.parse(fs.readFileSync('./data/tecnomega.json', 'utf8'));
    let total = 0;

    for (const collection in data) {
        for (const item of data[collection]) {
            const id = item.codigo || item.cedula;
            const key = `${collection}:${id}`;

            await redisClient.set(key, JSON.stringify(item));
            await redisClient.sAdd(`${collection}:index`, key);
            total++;
        }
    }

    const time = Date.now() - start;
    res.json({
        mensaje: 'Carga masiva completada',
        registros: total,
        tiempo_ms: time
    });
});


//carga de 1 registro
app.post('/:collection', async (req, res) => {
    const { collection } = req.params;
    const data = req.body;

    const id = data.codigo || data.cedula;
    const key = `${collection}:${id}`;

    await redisClient.set(key, JSON.stringify(data));
    await redisClient.sAdd(`${collection}:index`, key);

    res.json({ mensaje: 'Registro guardado', key });
});

//obtener un registro
app.get('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    const key = `${collection}:${id}`;

    const data = await redisClient.get(key);

    if (!data) {
        return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(JSON.parse(data));
});


//listar todos los registros de una colección
app.get('/:collection', async (req, res) => {
    const { collection } = req.params;
    const keys = await redisClient.sMembers(`${collection}:index`);

    const result = [];
    for (const key of keys) {
        const data = await redisClient.get(key);
        result.push(JSON.parse(data));
    }

    res.json(result);
});


//levantar el servidor :D
app.listen(PORT, () => {
    console.log(`API TecnoMega corriendo en http://localhost:${PORT}`);
});
