"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./db/index");
const index_2 = require("./domains/config/index");
const parseHouse_1 = require("./domains/krisha/parseHouse");
// Подключение к MongoDB
(0, index_1.initDataBase)(index_2.mongoDbUri);
// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692601254';
(0, parseHouse_1.fetchAndParseApartment)(exampleUrl);
