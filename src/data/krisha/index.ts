import { ApartmentModel } from '../../db/krisha/house/index';

class HouseService {
  public static async saveHouse(apartmentData: any): Promise<void> {
    try {
      const apartment = new ApartmentModel(apartmentData);
      await apartment.save();
      console.log('Apartment saved:', apartment);
    } catch (error) {
      console.error('Error saving apartment data:', error);
    }
  }
}

export { HouseService };
