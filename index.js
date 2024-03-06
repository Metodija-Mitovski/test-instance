import express from 'express';

const api = express();

api.get('/api/test', (req, res) => {
    res.send('Test OK')
})

api.listen(3000, () => {
    console.log('Server is running on port 3000')
});