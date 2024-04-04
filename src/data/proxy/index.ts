import { ProxyModel } from '../../db/proxy/index';

const getRandomProxy = async () => {
  const proxies = await ProxyModel.find();
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
};

export { getRandomProxy };
