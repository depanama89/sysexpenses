import { cleanEnv, port, str } from "envalid";
export default cleanEnv(process.env, {
  POSTGRES_URL: str(),
  PORT: port(),
  JWT_SECRET: str(),
});
