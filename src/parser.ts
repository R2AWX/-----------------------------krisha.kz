import { Telegraf } from 'telegraf';
import { initDataBase } from './db/index';
import { User } from './db/user/index';
import { mongoDbUri, token } from './domains/config/index';
import { HouseService } from './data/krisha/index';
import { fetchAndParseApartment } from './domains/krisha/parseHouse';
import { handleStartCommand, sendAdvertisements } from './domains/user/tgBot';

// Подключение к MongoDB
initDataBase(mongoDbUri);

// Пример инициализации и использования
const bot = new Telegraf(token as string);
handleStartCommand(bot, User);
bot.launch();

const saveNewApartmentData = async (url: string) => {
  try {
    // Получает и сохраняет данные квартиры с указанного URL
    const apartmentData = await fetchAndParseApartment(url);
    await HouseService.saveHouse(apartmentData);

    // Преобразование объекта в читаемую строку
    const messageText = ` 
    ID: ${apartmentData.id}
    Название: ${apartmentData.title}
    Цена: ${apartmentData.price} 〒;
    Тип дома: ${apartmentData.houseType}
    Год постройки: ${apartmentData.yearBuilt}
    Площадь: ${apartmentData.area}
    Тип санузла: ${apartmentData.bathroom}
    Ссылка на объявление: https://krisha.kz/a/show/${apartmentData.id}`

    // Бот отправляет рассылку пользователям
    await sendAdvertisements(bot, User, messageText);
    console.log('Apartment data saved successfully.');
  } catch (error) {
    console.error('Error saving apartment data:', error);
  }
};

// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/681426253';
saveNewApartmentData(exampleUrl);

// Включите обработку прерывания программы (Ctrl+C) и выхода
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));