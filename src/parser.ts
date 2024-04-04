import axios from 'axios';
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
const fetchAndProcessAdById = async (adId: number) => {
  const url = `https://krisha.kz/a/show/${adId}`;
  try {
    // Получает и сохраняет данные квартиры с указанного URL
    const axiosInstance = await useProxyForRequest(url, ProxyModel);
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

    console.log('Данные успешно разосланы.');

    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`Объявление с ID: ${adId} не найдено.`);
      return false;
    } else {
      console.error(`Ошибка при обработке объявления с ID: ${adId}:`, error);
      return false;
    }
  }
};

// Функция для последовательного поиска и обработки новых объявлений
const processNewAds = async (startId: number) => {
  let currentId = startId;
  let notFoundCount = 0; // Счётчик подряд идущих ошибок 404

  while (notFoundCount < 10) { // Продолжаем, пока не встретим 10 ошибок 404 подряд
    const adFound = await fetchAndProcessAdById(currentId);
    if (adFound) {
      notFoundCount = 0; // Сброс счётчика, если объявление найдено
    } else {
      notFoundCount++; // Увеличиваем счётчик, если объявление не найдено
    }
    currentId++; // Переходим к следующему ID
  }

  console.log(`Поиск новых объявлений завершен. Последний проверенный ID: ${currentId - 1}`);
};

// Запуск обработки с определенного ID
const startFromId = 692728184; // Начальный ID для поиска новых объявлений
processNewAds(startFromId);

// Включите обработку прерывания программы (Ctrl+C) и выхода
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
