import { Telegraf } from 'telegraf';
import { initDataBase } from './db/index';
import { User } from './db/user/index';
import { ProxyModel } from './db/proxy/index';
import { mongoDbUri, token } from './domains/config/index';
import { HouseService } from './data/krisha/index';
import { fetchAndParseApartment } from './domains/krisha/parseHouse';
import { handleStartCommand, sendAdvertisements } from './domains/bot/tgBot';
import { proxies, useProxyForRequest } from './domains/proxy/proxy';

// Подключение к MongoDB
initDataBase(mongoDbUri);

// Запуск бота
const bot = new Telegraf(token as string);
handleStartCommand(bot, User);
bot.launch();

// Сохранение прокси
proxies.forEach(async (proxyData) => {
  const proxy = new ProxyModel(proxyData);
  await proxy.save();
});

console.log('Proxies saved to the database');

// Подключение к странице, извлечение данных и отправка сообщения ботом
const saveNewApartmentData = async (url: string) => {
  try {
    // Получает и сохраняет данные квартиры с указанного URL
    const axiosInstance = useProxyForRequest(url, ProxyModel);
    const apartmentData = await fetchAndParseApartment(url, axiosInstance);
    await HouseService.saveHouse(apartmentData);

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
    Ссылка на объявление: https://krisha.kz/a/show/${apartmentData.id}`

    // Бот отправляет рассылку пользователям
    await sendAdvertisements(bot, User, messageText);
    console.log('Apartment data saved successfully.');
  } catch (error) {
    console.error('Error saving apartment data:', error);
  }
};


// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692703597';
saveNewApartmentData(exampleUrl);

// Включите обработку прерывания программы (Ctrl+C) и выхода
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
