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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdvertisements = exports.handleStartCommand = void 0;
// Функция для обработки команды /start
const handleStartCommand = (bot, UserModel) => {
    bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const chatId = ctx.chat.id.toString();
        const name = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name) !== null && _b !== void 0 ? _b : "Анонимный пользователь";
        try {
            // Проверяем, существует ли уже пользователь с таким chatId
            const existingUser = yield UserModel.findOne({ chatId });
            if (!existingUser) {
                // Если пользователя нет, создаём нового
                const newUser = new UserModel({ chatId, name });
                yield newUser.save();
                ctx.reply('Вы успешно подписались на рассылку объявлений!');
            }
            else {
                ctx.reply('Вы уже подписаны на рассылку.');
            }
        }
        catch (error) {
            console.error('Ошибка при попытке подписать пользователя:', error);
            ctx.reply('Произошла ошибка при попытке подписки. Попробуйте снова.');
        }
    }));
};
exports.handleStartCommand = handleStartCommand;
// Функция для рассылки объявлений
const sendAdvertisements = (bot, UserModel, advertisement) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Получаем всех пользователей из базы данных
        const users = yield UserModel.find();
        // Для каждого пользователя отправляем сообщение
        users.forEach((user) => {
            bot.telegram.sendMessage(user.chatId, `Новое объявление: ${advertisement}`);
        });
    }
    catch (error) {
        console.error('Ошибка при отправке объявлений:', error);
    }
});
exports.sendAdvertisements = sendAdvertisements;
