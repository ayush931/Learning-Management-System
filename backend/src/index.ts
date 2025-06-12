import app from "./app";
import connectionToDB from "./config/dbConnection";

const PORT = process.env.PORT;

// connection of db and the port
app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is listening on ${PORT}`);
});
