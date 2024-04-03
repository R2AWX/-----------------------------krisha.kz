"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./db/krisha/house/index");
const index_2 = require("./db/index");
const index_3 = require("./domains/config/index");
const parseHouse_1 = require("./domains/krisha/parseHouse");
// Подключение к MongoDB
(0, index_2.initDataBase)(index_3.mongoDbUri);
// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692601254';
(0, parseHouse_1.fetchAndParseApartment)(index_1.ApartmentModel, exampleUrl);
