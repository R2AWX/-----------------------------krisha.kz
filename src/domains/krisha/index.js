"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_1 = require("../../db/krisha/house/index");
const index_2 = require("../../db/index");
const index_3 = require("../config/index");
(0, index_2.initDataBase)(index_3.mongoDbUri);
// Вспомогательные функции
const extractNumber = (text) => {
    const cleanedText = text.replace(/\D+/g, '');
    return cleanedText ? parseInt(cleanedText, 10) : null;
};
const extractFloat = (text) => {
    const match = text.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : null;
};
// Функция для парсинга страницы
function fetchAndParseApartment(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            // Извлечение данных
            const id = parseInt(url.split('/').pop() || '0', 10);
            const title = $('h1').text().trim();
            const price = extractNumber($('.offer__price').text());
            const houseType = $('[data-name="flat.building"] .offer__advert-short-info').text().trim();
            const yearBuilt = extractNumber($('[data-name="house.year"] .offer__advert-short-info').text());
            const area = extractFloat($('[data-name="live.square"] .offer__advert-short-info').text());
            const bathroom = $('[data-name="flat.toilet"] .offer__advert-short-info').text().trim();
            // Создание и сохранение объекта в MongoDB
            const apartment = new index_1.ApartmentModel({ id, title, price, houseType, yearBuilt, area, bathroom });
            yield apartment.save();
            console.log('Apartment saved:', apartment);
        }
        catch (error) {
            console.error('Error fetching apartment data:', error);
        }
    });
}
// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692536989';
fetchAndParseApartment(exampleUrl);
