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
exports.HouseService = void 0;
const index_1 = require("../../db/krisha/house/index");
class HouseService {
    static saveHouse(apartmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apartment = new index_1.ApartmentModel(apartmentData);
                yield apartment.save();
                console.log('Apartment saved:', apartment);
            }
            catch (error) {
                console.error('Error saving apartment data:', error);
            }
        });
    }
}
exports.HouseService = HouseService;
