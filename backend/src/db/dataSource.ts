import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/Product.js";
import { Sale } from "../entities/Sale.js";
import { SaleItem } from "../entities/SaleItem.js";

export const appDataSource = new DataSource({
  type: "better-sqlite3",
  database: "./database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Product, Sale, SaleItem],
});
