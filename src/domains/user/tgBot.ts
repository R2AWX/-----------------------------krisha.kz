import { Telegraf, Context } from 'telegraf';
import { Model } from 'mongoose';

// Функция для обработки команды /start
const handleStartCommand = (bot: Telegraf<Context>, UserModel: Model<any>) => {
  bot.start(async (ctx) => {
    const chatId = ctx.chat.id.toString();
    const name = ctx.from?.first_name ?? "Анонимный пользователь";

    try {
      // Проверяем, существует ли уже пользователь с таким chatId
      const existingUser = await UserModel.findOne({ chatId });
      if (!existingUser) {
        // Если пользователя нет, создаём нового
        const newUser = new UserModel({ chatId, name });
        await newUser.save();
        ctx.reply('Вы успешно подписались на рассылку объявлений!');
      } else {
        ctx.reply('Вы уже подписаны на рассылку.');
      }
    } catch (error) {
      console.error('Ошибка при попытке подписать пользователя:', error);
      ctx.reply('Произошла ошибка при попытке подписки. Попробуйте снова.');
    }
  });
};

// Функция для рассылки объявлений
const sendAdvertisements = async (bot: Telegraf<Context>, UserModel: Model<any>, advertisement: string) => {
  try {
    // Получаем всех пользователей из базы данных
    const users = await UserModel.find();
    // Для каждого пользователя отправляем сообщение
    users.forEach((user) => {
      bot.telegram.sendMessage(user.chatId, `Новое объявление: ${advertisement}`);
    });
  } catch (error) {
    console.error('Ошибка при отправке объявлений:', error);
  }
};

export { handleStartCommand, sendAdvertisements };
