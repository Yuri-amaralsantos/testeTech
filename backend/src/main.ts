import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: false });
  const port = Number(process.env.PORT ?? 3001);
  const publicDir = path.join(process.cwd(), "public");

  app.use(helmet());
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    }),
  );
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
  app.use(
    "/images",
    (_req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(publicDir, "images")),
  );

  await app.listen(port);
  console.log(`API rodando em http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar API:", error);
  process.exit(1);
});
