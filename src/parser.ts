import { initDataBase } from './db/index';
import { mongoDbUri } from './domains/config/index';
import { HouseService } from './data/krisha/index';
import { fetchAndParseApartment } from './domains/krisha/parseHouse';

// Подключение к MongoDB
initDataBase(mongoDbUri);

// Получает и сохраняет данные квартиры с указанного URL
const saveNewApartmentData = async (url: string) => {
  try {
    const apartmentData = await fetchAndParseApartment(url);
    await HouseService.saveHouse(apartmentData);
    console.log('Apartment data saved successfully.');
  } catch (error) {
    console.error('Error saving apartment data:', error);
  }
};

// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692601254';
saveNewApartmentData(exampleUrl);
