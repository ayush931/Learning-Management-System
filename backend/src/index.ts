import app from './app';
import connectionToDB from './config/dbConnection';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

const PORT = process.env.PORT;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export default razorpay;

// connection of db and the port
app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is listening on ${PORT}`);
});
