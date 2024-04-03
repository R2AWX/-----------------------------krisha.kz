import mongoose from 'mongoose';

// Подключение к MongoDB
const initDataBase = async (mongodb_uri: string | undefined) => {
  try {
    await mongoose.connect(mongodb_uri as string);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export { initDataBase };
