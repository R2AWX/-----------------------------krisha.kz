import { getRandomProxy } from '../../data/proxy/index';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { HttpsProxyAgent } from "https-proxy-agent";
import url from "url";

const proxies = [
  {
    name: "ProxyScout 1",
    login: "test",
    password: "test",
    proxy: "http://46.101.124.11:8022",
    host: "46.101.124.11",
    port: 8022,
  },
  {
    name: "ProxyScout 2",
    login: "test",
    password: "test",
    proxy: "http://46.101.124.11:8050",
    host: "46.101.124.11",
    port: 8050,
  }
];

// Функция для получения случайного прокси из базы данных и модификации для axios
const useProxyForRequest = async (url: string, ProxyModel: Model<any>) => {
  try {
    // Получение всех прокси из базы данных
    const proxies = await ProxyModel.find();
    if (proxies.length === 0) {
      console.log('No proxies available.');
      return;
    }

    // Выбор случайного прокси
    const proxy = await getRandomProxy();

    // Прокси
    const proxyConfig = {
      host: proxy.host,
      port: proxy.port,
      username: proxy.login,
      password: proxy.password
    };

    // Формирование строки URL прокси
    const proxyUrl = `http://${proxyConfig.username}:${proxyConfig.password}@${proxyConfig.host}:${proxyConfig.port}`;

    const httpsAgent = new HttpsProxyAgent(proxyUrl);
    const axiosInstance: AxiosInstance = axios.create({ httpsAgent });

    // Сохранение экземпляра axios для выполнения запроса
    return axiosInstance.get(url);
  } catch (error) {
    console.error('Error using proxy for request:', error);
  }
};

export { proxies, useProxyForRequest };
