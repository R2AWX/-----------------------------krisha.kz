"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbUri = void 0;
require('dotenv').config();
// Получение строки подключения к MongoDB из переменных окружения
const mongoDbUri = process.env.MONGODB_URI;
exports.mongoDbUri = mongoDbUri;
