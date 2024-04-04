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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProxyForRequest = exports.proxies = void 0;
const index_1 = require("../../data/proxy/index");
const axios_1 = __importDefault(require("axios"));
const https_proxy_agent_1 = require("https-proxy-agent");
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
exports.proxies = proxies;
// Функция для получения случайного прокси из базы данных и модификации для axios
const useProxyForRequest = (url, ProxyModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Получение всех прокси из базы данных
        const proxies = yield ProxyModel.find();
        if (proxies.length === 0) {
            console.log('No proxies available.');
            return;
        }
        // Выбор случайного прокси
        const proxy = yield (0, index_1.getRandomProxy)();
        // Прокси
        const proxyConfig = {
            host: proxy.host,
            port: proxy.port,
            username: proxy.login,
            password: proxy.password
        };
        // Формирование строки URL прокси
        const proxyUrl = `http://${proxyConfig.username}:${proxyConfig.password}@${proxyConfig.host}:${proxyConfig.port}`;
        const httpsAgent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
        const axiosInstance = axios_1.default.create({ httpsAgent });
        // Сохранение экземпляра axios для выполнения запроса
        return axiosInstance.get(url);
    }
    catch (error) {
        console.error('Error using proxy for request:', error);
    }
});
exports.useProxyForRequest = useProxyForRequest;
