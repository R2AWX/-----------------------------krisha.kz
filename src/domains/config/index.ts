require('dotenv').config();

// Получение строки подключения к MongoDB из переменных окружения
const mongoDbUri = process.env.MONGODB_URI;

// Токен телеграмм-бота
const token = process.env.TELEGRAM_BOT_TOKEN;

export { mongoDbUri, token };
