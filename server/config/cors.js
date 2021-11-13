import cors from "cors";
import { BASE_CLIENT_URL } from "../constants";

export default (app) => {
  app.use(
    cors({
      origin: BASE_CLIENT_URL,
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    })
  );
};
