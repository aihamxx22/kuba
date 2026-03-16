const express = require('express');
const axios = require('axios');
const app = express();

// ÊÝÚםב דÚַבֹּ JSON
app.use(express.json());

// הÞ״ֹ ַבהוַםֹ ַבֶׁם׃םֹ - ַ׃ÊÞַָב ַב״בַָÊ זֵÚַֹֿ Êזּםווַ בÜ OpenAI
app.post('/v1/chat/completions', async (req, res) => {
    try {
        // ַבֽױזב Úבל API key דה ֳׁ׃ ַב״בָ
        const apiKey = req.headers.authorization;
        
        if (!apiKey) {
            return res.status(401).json({ error: 'ד״בזָ דÝÊַֽ API' });
        }

        // ֵÚַֹֿ Êזּםו ַב״בָ ֵבל OpenAI
        const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            data: req.body,
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        // ֵÚַֹֿ ַבֿׁ ֵבל ַבÚדםב
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: '־״ֳ Ýם ַב־ַֿד ַבזßםב', details: error.message });
        }
    }
});

// הÞ״ֹ הוַםֹ בבÊֽÞÞ דה Úדב ַב־ַֿד
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ַב־ַֿד ַבזßםב םÚדב' });
});

// ÊװÛםב ַב־ַֿד
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ַב־ַֿד ַבזßםב םÚדב Úבל ַבדהÝ׀ ${PORT}`);
});