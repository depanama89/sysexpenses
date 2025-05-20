import app from "./app";
import { pool } from "./db/db";
import env from "./utils/validateEnv";

const PORT = env.PORT;

pool
  .connect()
  .then(() => console.log("connecté a Postgres serveur"))
  .catch((error) => console.error("Erreur de la connexion"));

app.listen(PORT, () => {
  console.log("Server is running on port : " + PORT);
});
