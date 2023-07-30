import mongoose, { ConnectOptions } from 'mongoose';

interface CustomConnectOptions extends ConnectOptions {
  useNewUrlParser: boolean;
}

const connectiondb = async () => {
  try {
    await mongoose.connect(process.env.MONOGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as CustomConnectOptions);
    console.log('Database is connected');
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectiondb;
