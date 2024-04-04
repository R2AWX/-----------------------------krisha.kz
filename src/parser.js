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
const telegraf_1 = require("telegraf");
const index_1 = require("./db/index");
const index_2 = require("./db/user/index");
const index_3 = require("./db/proxy/index");
const index_4 = require("./domains/config/index");
const index_5 = require("./data/krisha/index");
const parseHouse_1 = require("./domains/krisha/parseHouse");
const tgBot_1 = require("./domains/bot/tgBot");
const proxy_1 = require("./domains/proxy/proxy");
// Подключение к MongoDB
(0, index_1.initDataBase)(index_4.mongoDbUri);
// Запуск бота
const bot = new telegraf_1.Telegraf(index_4.token);
(0, tgBot_1.handleStartCommand)(bot, index_2.User);
bot.launch();
// Сохранение прокси
proxy_1.proxies.forEach((proxyData) => __awaiter(void 0, void 0, void 0, function* () {
    const proxy = new index_3.ProxyModel(proxyData);
    yield proxy.save();
}));
console.log('Proxies saved to the database');
// Подключение к странице, извлечение данных и отправка сообщения ботом
const fetchAndProcessAdById = (adId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = `https://krisha.kz/a/show/${adId}`;
    try {
        // Получает и сохраняет данные квартиры с указанного URL
        const axiosInstance = yield (0, proxy_1.useProxyForRequest)(url, index_3.ProxyModel);
        const apartmentData = yield (0, parseHouse_1.fetchAndParseApartment)(url, axiosInstance);
        yield index_5.HouseService.saveHouse(apartmentData);
        // Форматирование цены
        const formattedPrice = apartmentData.price.toLocaleString('ru-RU');
        // Преобразование объекта в читаемую строку
        const messageText = ` 
    ID: ${apartmentData.id}
    Название: ${apartmentData.title}
    Цена: ${formattedPrice} 〒
    Тип дома: ${apartmentData.houseType}
    Год постройки: ${apartmentData.yearBuilt}
    Площадь: ${apartmentData.area} м²
    Тип санузла: ${apartmentData.bathroom}
    Ссылка на объявление: https://krisha.kz/a/show/${apartmentData.id}`;
        // Бот отправляет рассылку пользователям
        yield (0, tgBot_1.sendAdvertisements)(bot, index_2.User, messageText);
        console.log('Данные успешно разосланы.');
        return true;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            console.log(`Объявление с ID: ${adId} не найдено.`);
            return false;
        }
        else {
            console.error(`Ошибка при обработке объявления с ID: ${adId}:`, error);
            return false;
        }
    }
});
// Функция для последовательного поиска и обработки новых объявлений
const processNewAds = (startId) => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = startId;
    let notFoundCount = 0; // Счётчик подряд идущих ошибок 404
    while (notFoundCount < 10) { // Продолжаем, пока не встретим 10 ошибок 404 подряд
        const adFound = yield fetchAndProcessAdById(currentId);
        if (adFound) {
            notFoundCount = 0; // Сброс счётчика, если объявление найдено
        }
        else {
            notFoundCount++; // Увеличиваем счётчик, если объявление не найдено
        }
        currentId++; // Переходим к следующему ID
    }
    console.log(`Поиск новых объявлений завершен. Последний проверенный ID: ${currentId - 1}`);
});
// Запуск обработки с определенного ID
const startFromId = 692728184; // Начальный ID для поиска новых объявлений
processNewAds(startFromId);
// Включите обработку прерывания программы (Ctrl+C) и выхода
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
