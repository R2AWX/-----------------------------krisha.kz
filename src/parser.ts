import { initDataBase } from './db/index';
import { mongoDbUri } from './domains/config/index';
import { fetchAndParseApartment } from './domains/krisha/parseHouse';

// Подключение к MongoDB
initDataBase(mongoDbUri);

// Пример использования
const exampleUrl = 'https://krisha.kz/a/show/692601254';
fetchAndParseApartment(exampleUrl);
