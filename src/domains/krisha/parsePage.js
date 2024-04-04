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
const fetchAdIds = (pageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(pageUrl);
        const $ = cheerio_1.default.load(data);
        const adIds = [];
        // Предположим, что ID объявления содержится в атрибуте data-id элемента, который можно идентифицировать по классу .a-card
        $('.a-card').each((_, el) => {
            const id = $(el).attr('data-id');
            if (id)
                adIds.push(id);
        });
        return adIds;
    }
    catch (error) {
        console.error('Error fetching ad IDs:', error);
        return [];
    }
});
const fetchViews = (adIds) => __awaiter(void 0, void 0, void 0, function* () {
    const viewUrlBase = 'https://m.krisha.kz/ms/views/krisha/live/';
    const requests = adIds.map(id => axios_1.default.get(`${viewUrlBase}${id}/`));
    try {
        const responses = yield Promise.all(requests);
        return responses.map(response => response.data);
    }
    catch (error) {
        console.error('Error fetching views:', error);
        return [];
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const pageUrl = 'https://m.krisha.kz/prodazha/kvartiry/?page=2'; // Пример URL страницы с объявлениями
    const adIds = yield fetchAdIds(pageUrl);
    console.log('Fetched Ad IDs:', adIds);
    const viewsData = yield fetchViews(adIds);
    console.log('Views Data:', viewsData);
    return viewsData;
});
// Функция для обработки и вывода данных о просмотрах
const processAndViewData = (viewsData) => {
    viewsData.forEach((item) => {
        if (item.status === 'ok' && item.data) {
            // Получаем ID объявления как ключ объекта в data
            const adId = Object.keys(item.data)[0];
            // Получаем данные о просмотрах для этого объявления
            const viewInfo = item.data[adId];
            // Сложение nb_phone_views и nb_views
            const totalViews = (viewInfo.nb_phone_views || 0) + (viewInfo.nb_views || 0);
            console.log(`ID объявления: ${adId}, Информация о просмотрах: ${totalViews}`);
        }
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const viewsData = yield main();
    processAndViewData(viewsData);
}))();
