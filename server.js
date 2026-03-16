const express = require('express');
const axios = require('axios');
const app = express();

// ⭐ زيادة الحد الأقصى لحجم الطلب إلى 10 ميجابايت
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// نقطة النهاية الرئيسية - استقبال الطلبات وإعادة توجيهها لـ OpenAI
app.post('/v1/chat/completions', async (req, res) => {
    try {
        // الحصول على API key من رأس الطلب
        const apiKey = req.headers.authorization;
        
        if (!apiKey) {
            return res.status(401).json({ error: 'مطلوب مفتاح API' });
        }

        // إعادة توجيه الطلب إلى OpenAI
        const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            data: req.body,
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 60000,
            // ⭐ زيادة الحد الأقصى لحجم البيانات
            maxContentLength: 20 * 1024 * 1024, // 20 ميجابايت
            maxBodyLength: 20 * 1024 * 1024 // 20 ميجابايت
        });

        // إعادة الرد إلى العميل
        res.status(response.status).json(response.data);
    } catch (error) {
        // معالجة الأخطاء
        if (error.response) {
            // الخطأ من OpenAI
            res.status(error.response.status).json(error.response.data);
        } else {
            // خطأ في الاتصال
            res.status(500).json({ error: 'خطأ في الخادم الوكيل', details: error.message });
        }
    }
});

// نقطة نهاية للتحقق من عمل الخادم
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'الخادم الوكيل يعمل' });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الخادم الوكيل يعمل على المنفذ ${PORT}`);
});
