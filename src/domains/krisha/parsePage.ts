import axios from 'axios';
import cheerio from 'cheerio';

const fetchAdIds = async (pageUrl: string): Promise<string[]> => {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);
    const adIds: string[] = [];

    // Предположим, что ID объявления содержится в атрибуте data-id элемента, который можно идентифицировать по классу .a-card
    $('.a-card').each((_, el) => {
      const id = $(el).attr('data-id');
      if (id) adIds.push(id);
    });

    return adIds;
  } catch (error) {
    console.error('Error fetching ad IDs:', error);
    return [];
  }
};

const fetchViews = async (adIds: string[]): Promise<any[]> => {
  const viewUrlBase = 'https://m.krisha.kz/ms/views/krisha/live/';
  const requests = adIds.map(id => axios.get(`${viewUrlBase}${id}/`));

  try {
    const responses = await Promise.all(requests);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error fetching views:', error);
    return [];
  }
};

const main = async () => {
  const pageUrl = 'https://m.krisha.kz/prodazha/kvartiry/?page=2'; // Пример URL страницы с объявлениями
  const adIds = await fetchAdIds(pageUrl);
  console.log('Fetched Ad IDs:', adIds);

  const viewsData = await fetchViews(adIds);
  console.log('Views Data:', viewsData);

  return viewsData;
};

// Функция для обработки и вывода данных о просмотрах
const processAndViewData = (viewsData: Array<{ status: string, data: any }>) => {
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

(async () => {
  const viewsData = await main();
  processAndViewData(viewsData);
})();
