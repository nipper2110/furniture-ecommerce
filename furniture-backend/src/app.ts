import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { handle, LanguageDetector } from "i18next-http-middleware";
import path from "path";

import { limiter } from "./middlewares/rateLimiter";
import routes from "./routes/v1";
// Tutorial for ejs
import viewRoutes from "./routes/v1/web/view";
import * as errorController from "./controllers/web/errorController";

export const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void,
  ) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorizarion header
};

app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(cors(corsOptions))
  .use(helmet())
  .use(compression())
  .use(limiter);

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json",
      ),
    },
    detection: {
      order: ["querystring", "cookies"],
      caches: ["cookie"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  });

app.use(handle(i18next));

app.use(routes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Server Error";
  const errorCode = error.code || "Error_Code";
  res.status(status).json({ message, error: errorCode });
});

// Tuto for ejs
app.use(express.static("public"));
app.use(viewRoutes);
//app.use(errorController.notFound);
