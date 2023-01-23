import app from './app';
import mongoose from 'mongoose';
import { checkEnvironmentVariables } from '@hoangorg/common';

checkEnvironmentVariables(
  'MONGO_URI',
  'JWT_EXPIRES_IN',
  'REFRESH_EXPIRES_IN',
  'JWT_PUBLIC_KEY',
  'JWT_PRIVATE_KEY'
);

(async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongodb...');

    const port = 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
})();
