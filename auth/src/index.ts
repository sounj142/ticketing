import mongoose from 'mongoose';
import app from './app';

async function applicationStart() {
  checkApplicationVariables();
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongodb.');

    const port = 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

applicationStart();

function checkApplicationVariables() {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error('Missing JWT_PRIVATE_KEY');
  }
  if (!process.env.JWT_PUBLIC_KEY) {
    throw new Error('Missing JWT_PUBLIC_KEY');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }
}
