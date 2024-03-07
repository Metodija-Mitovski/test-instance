import express from 'express';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DATABASE;
const port = process.env.MYSQL_PORT;
const password = process.env.DB_PASSWORD;

const getConnection = async () => {
    try {

        const c = await mysql.createConnection({
            host: host,
            user: user,
            database: database,
            port: port,
            password: password
        })
        return c;
    } catch (error) {
        console.log(error)
    }
}

const getRedis = async () => {
    try {
        const client = await createClient()
            .on('error', err => console.log('Redis Client Error', err))
            .connect();
        return client;
    } catch (error) {
        console.log(error)
    }
}

const api = express();

api.get('/api/test-get', async (req, res) => {
    let conn = await getConnection();
    let mySqlRes = await conn.query('SELECT * FROM `test-table`');
    console.log('MYSQL RES', mySqlRes)
    conn.end();

    const redisClient = await getRedis();
    let redisName = await redisClient.get('name');
    console.log('REdis name', redisName)
    await redisClient.disconnect();
    res.send('Test OK')
})

api.post('/api/test-insert', async (req, res) => {
    let conn = await getConnection();
    let mySqlRes = await conn.query('INSERT INTO `test-table` (name) VALUES ("test-name-1"), ("test-name-2")');
    console.log('MYSQL RES', mySqlRes)

    const redisClient = await getRedis();
    let redisName = await redisClient.set('name', 'test-name')
    console.log('REdis name', redisName)
    await redisClient.disconnect();
    await conn.end()
    res.send('Test OK')
})

api.listen(3000, () => {
    console.log('Server is running on port 3000')
});