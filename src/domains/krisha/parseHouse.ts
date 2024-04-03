import axios from 'axios';
import cheerio from 'cheerio';
import { HouseService } from '../../data/krisha/index';

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
const fetchAndParseApartment = async (url: string): Promise<void> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Извлечение данных и их структурирование
    const apartmentData = {
      id: parseInt(url.split('/').pop() || '0', 10),
      title: $('h1').text().trim(),
      price: extractNumber($('.offer__price').text()),
      houseType: $('[data-name="flat.building"] .offer__advert-short-info').text().trim(),
      yearBuilt: extractNumber($('[data-name="house.year"] .offer__advert-short-info').text()),
      area: extractFloat($('[data-name="live.square"] .offer__advert-short-info').text()),
      bathroom: $('[data-name="flat.toilet"] .offer__advert-short-info').text().trim(),
    };

    // Сохранение данных
    await HouseService.saveHouse(apartmentData);
  } catch (error) {
    console.error('Error fetching apartment data:', error);
  }
};

export { fetchAndParseApartment };
