import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appDataSource } from "./db/dataSource.js";
import { productsSeed } from "./db/seed.js";
import { Product } from "./entities/Product.js";
import { Sale } from "./entities/Sale.js";
import { SaleItem } from "./entities/SaleItem.js";
import {
  addToCart,
  buildCartDetails,
  clearCart,
  isCartEmpty,
  updateCart,
} from "./cartStore.js";
import {
  addToCartSchema,
  checkoutSchema,
  updateCartSchema,
} from "./schemas.js";
import { sendOrderConfirmationEmail } from "./mailer.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const backendDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(backendDir, "..", "public");

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(express.json({ limit: "100kb" }));
app.use(
  "/images",
  (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(publicDir, "images")),
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get(
  "/produtos",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = appDataSource.getRepository(Product);
      const products = await repository.find({ order: { id: "ASC" } });
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  "/carrinho",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const productRepository = appDataSource.getRepository(Product);
      const details = await buildCartDetails((id) =>
        productRepository.findOneBy({ id }),
      );
      const total = Number(
        details.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
      );

      res.json({
        items: details.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.subtotal,
        })),
        total,
      });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/carrinho",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = addToCartSchema.parse(req.body);
      const productRepository = appDataSource.getRepository(Product);
      const product = await productRepository.findOneBy({
        id: parsed.productId,
      });

      if (!product) {
        return res.status(404).json({ message: "Produto nao encontrado." });
      }

      addToCart(parsed.productId, parsed.quantity);
      return res
        .status(201)
        .json({ message: "Produto adicionado ao carrinho." });
    } catch (error) {
      next(error);
      return undefined;
    }
  },
);

app.put(
  "/carrinho",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = updateCartSchema.parse(req.body);
      updateCart(parsed.productId, parsed.quantity);
      return res.json({ message: "Carrinho atualizado." });
    } catch (error) {
      next(error);
      return undefined;
    }
  },
);

app.post(
  "/finalizar-compra",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isCartEmpty()) {
        return res.status(400).json({ message: "Carrinho vazio." });
      }

      const parsed = checkoutSchema.parse(req.body);
      const productRepository = appDataSource.getRepository(Product);
      const saleRepository = appDataSource.getRepository(Sale);
      const saleItemRepository = appDataSource.getRepository(SaleItem);

      const details = await buildCartDetails((id) =>
        productRepository.findOneBy({ id }),
      );
      const total = Number(
        details.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
      );

      const sale = saleRepository.create({
        customerEmail: parsed.email,
        total,
        items: [],
      });

      const savedSale = await saleRepository.save(sale);
      const saleItems = details.map((detail) =>
        saleItemRepository.create({
          sale: savedSale,
          product: detail.product,
          quantity: detail.quantity,
          unitPrice: detail.product.price,
          subtotal: detail.subtotal,
        }),
      );

      await saleItemRepository.save(saleItems);

      await sendOrderConfirmationEmail({
        email: parsed.email,
        saleId: savedSale.id,
        items: details.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        total,
      });

      clearCart();

      return res.status(201).json({
        message: "Compra finalizada com sucesso.",
        saleId: savedSale.id,
        total,
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },
);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error && typeof error === "object" && "issues" in error) {
    return res
      .status(400)
      .json({ message: "Dados invalidos.", details: error });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno no servidor." });
});

async function bootstrap(): Promise<void> {
  await appDataSource.initialize();

  const productRepository = appDataSource.getRepository(Product);
  const count = await productRepository.count();

  if (count === 0) {
    await productRepository.save(productsSeed);
    console.log("Produtos iniciais cadastrados.");
  } else {
    for (const seedProduct of productsSeed) {
      const existingProduct = await productRepository.findOneBy({
        name: seedProduct.name,
      });

      if (existingProduct) {
        await productRepository.update(existingProduct.id, seedProduct);
        continue;
      }

      await productRepository.save(seedProduct);
    }
  }

  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar API:", error);
  process.exit(1);
});
