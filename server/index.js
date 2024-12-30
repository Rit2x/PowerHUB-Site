module.exports = {
    API_KEY: 'api_key'
};

const express = require('express');
const a2s = require('a2s');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../publick')));
app.use(express.json());

app.get('/server-info', async (req, res) => {
    const apiKey = req.query.apiKey;

    if (apiKey !== config.API_KEY) {
        return res.status(403).json({ error: 'Неверный API ключ' });
    }

    try {
        const info = await a2s.info('62.122.213.87', 1337);
        res.json(info);
    } catch (error) {
        console.error('Ошибка при получении информации с сервера:', error);
        res.status(500).json({ error: 'Ошибка при получении информации с сервера' });
    }
});

app.get('/server-data', (req, res) => {
    const map = req.query.map;
    const maxPlayers = req.query.maxPlayers;
    const playerCount = req.query.playerCount;
    const playerNames = req.query.playerNames;
    const ctScore = req.query.ctScore;
    const tScore = req.query.tScore;

    console.log('Получены данные с сервера:');
    console.log(`Карта: ${map}`);
    console.log(`Максимум игроков: ${maxPlayers}`);
    console.log(`Текущее количество игроков: ${playerCount}`);
    console.log(`Имена игроков: ${playerNames}`);
    console.log(`Счет CT: ${ctScore}`);
    console.log(`Счет T: ${tScore}`);

    global.serverData = {
        map,
        maxPlayers,
        playerCount,
        playerNames: playerNames.split(','),
        ctScore,
        tScore
    };

    res.sendStatus(200);
});

app.get('/get-server-data', (req, res) => {
    if (!global.serverData) {
        return res.status(404).json({ error: 'Данные о сервере не найдены' });
    }

    res.json(global.serverData);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});