import axios from 'axios';
import cheerio from 'cheerio';
import {ApartmentModel} from '../../db/krisha/house/index'; /* нарушение методологии! */
import {initDataBase} from '../../db/index'; /* нарушение методологии! */
import {mongoDbUri} from '../config/index';

// Подключение к MongoDB
initDataBase(mongoDbUri);

// Вспомогательные функции
const extractNumber = (text: string): number | null => {
  const cleanedText = text.replace(/\D+/g, '');
  return cleanedText ? parseInt(cleanedText, 10) : null;
};

const extractFloat = (text: string): number | null => {
  const match = text.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
};

// Функция для парсинга страницы
async function fetchAndParseApartment(url: string): Promise<void> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Извлечение данных
    const id = parseInt(url.split('/').pop() || '0', 10);
    const title = $('h1').text().trim();
    const price = extractNumber($('.offer__price').text());
    const houseType = $('[data-name="flat.building"] .offer__advert-short-info').text().trim();
    const yearBuilt = extractNumber($('[data-name="house.year"] .offer__advert-short-info').text());
    const area = extractFloat($('[data-name="live.square"] .offer__advert-short-info').text());
    const bathroom = $('[data-name="flat.toilet"] .offer__advert-short-info').text().trim();

    // Создание и сохранение объекта в MongoDB
    const apartment = new ApartmentModel({ id, title, price, houseType, yearBuilt, area, bathroom });
    await apartment.save();

    console.log('Apartment saved:', apartment);
  } catch (error) {
    console.error('Error fetching apartment data:', error);
  }
}

// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692536989';
fetchAndParseApartment(exampleUrl);
