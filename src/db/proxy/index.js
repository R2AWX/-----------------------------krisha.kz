"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyModel = void 0;
const mongoose_1 = require("mongoose");
const proxySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    proxy: { type: String, required: true },
    host: { type: String, required: true },
    port: { type: Number, required: true },
});
const ProxyModel = (0, mongoose_1.model)('Proxy', proxySchema);
exports.ProxyModel = ProxyModel;
