import app from './app';
import connectionToDB from './config/dbConnection';
import cloudinary from 'cloudinary';

const PORT = process.env.PORT;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
});

// connection of db and the port
app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is listening on ${PORT}`);
});
