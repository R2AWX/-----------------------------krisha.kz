require('dotenv').config();

// Получение строки подключения к MongoDB из переменных окружения
const mongoDbUri = process.env.MONGODB_URI;

export {mongoDbUri};
