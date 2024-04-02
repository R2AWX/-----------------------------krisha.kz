"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApartmentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apartmentSchema = new mongoose_1.default.Schema({
    id: Number,
    title: String,
    price: Number,
    houseType: String,
    yearBuilt: Number,
    area: Number,
    bathroom: String,
});
const ApartmentModel = mongoose_1.default.model('Apartment', apartmentSchema);
exports.ApartmentModel = ApartmentModel;
