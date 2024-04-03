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
exports.fetchAndParseApartment = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
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
const fetchAndParseApartment = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url);
        const $ = cheerio_1.default.load(data);
        // Извлечение данных и их структурирование
        return {
            id: parseInt(url.split('/').pop() || '0', 10),
            title: $('h1').text().trim(),
            price: extractNumber($('.offer__price').text()),
            houseType: $('[data-name="flat.building"] .offer__advert-short-info').text().trim(),
            yearBuilt: extractNumber($('[data-name="house.year"] .offer__advert-short-info').text()),
            area: extractFloat($('[data-name="live.square"] .offer__advert-short-info').text()),
            bathroom: $('[data-name="flat.toilet"] .offer__advert-short-info').text().trim(),
        };
    }
    catch (error) {
        console.error('Error fetching apartment data:', error);
        throw error;
    }
});
exports.fetchAndParseApartment = fetchAndParseApartment;
