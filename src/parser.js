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
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const index_1 = require("./db/index");
const index_2 = require("./db/user/index");
const index_3 = require("./domains/config/index");
const index_4 = require("./data/krisha/index");
const parseHouse_1 = require("./domains/krisha/parseHouse");
const tgBot_1 = require("./domains/user/tgBot");
// Подключение к MongoDB
(0, index_1.initDataBase)(index_3.mongoDbUri);
// Пример инициализации и использования
const bot = new telegraf_1.Telegraf(index_3.token);
(0, tgBot_1.handleStartCommand)(bot, index_2.User);
bot.launch();
const saveNewApartmentData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Получает и сохраняет данные квартиры с указанного URL
        const apartmentData = yield (0, parseHouse_1.fetchAndParseApartment)(url);
        yield index_4.HouseService.saveHouse(apartmentData);
        // Преобразование объекта в читаемую строку
        const messageText = ` 
    ID: ${apartmentData.id}
    Название: ${apartmentData.title}
    Цена: ${apartmentData.price} 〒;
    Тип дома: ${apartmentData.houseType}
    Год постройки: ${apartmentData.yearBuilt}
    Площадь: ${apartmentData.area}
    Тип санузла: ${apartmentData.bathroom}
    Ссылка на объявление: https://krisha.kz/a/show/${apartmentData.id}`;
        // Бот отправляет рассылку пользователям
        yield (0, tgBot_1.sendAdvertisements)(bot, index_2.User, messageText);
        console.log('Apartment data saved successfully.');
    }
    catch (error) {
        console.error('Error saving apartment data:', error);
    }
});
// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/681426253';
saveNewApartmentData(exampleUrl);
// Включите обработку прерывания программы (Ctrl+C) и выхода
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
