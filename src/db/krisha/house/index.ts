import mongoose from 'mongoose';

// Определение модели для MongoDB
interface Apartment {
  id: number;
  title: string;
  price: number;
  houseType: string;
  yearBuilt: number;
  area: number;
  bathroom: string;
}

const apartmentSchema = new mongoose.Schema<Apartment>({
  id: Number,
  title: String,
  price: Number,
  houseType: String,
  yearBuilt: Number,
  area: Number,
  bathroom: String,
});

const ApartmentModel = mongoose.model<Apartment>('Apartment', apartmentSchema);

export { ApartmentModel };
