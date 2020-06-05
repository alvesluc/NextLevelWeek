import express, { response } from 'express';

const app = express();

app.get('/users', (req,res) => {
    console.log('Listagem de usuários');
    res.json([
        'Lucas',
        'Talles',
        'Lael'
    ]);
});

app.listen(3333);