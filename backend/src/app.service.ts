import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
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
import { sendOrderConfirmationEmail } from "./mailer.js";

@Injectable()
export class AppService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await appDataSource.initialize();

    const productRepository = appDataSource.getRepository(Product);
    const count = await productRepository.count();

    if (count === 0) {
      await productRepository.save(productsSeed);
      console.log("Produtos iniciais cadastrados.");
      return;
    }

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

  async getProducts() {
    const repository = appDataSource.getRepository(Product);
    return repository.find({ order: { id: "ASC" } });
  }

  async getCart() {
    const productRepository = appDataSource.getRepository(Product);
    const details = await buildCartDetails((id) =>
      productRepository.findOneBy({ id }),
    );
    const total = Number(
      details.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );

    return {
      items: details.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.subtotal,
      })),
      total,
    };
  }

  async addToCart(productId: number, quantity: number): Promise<void> {
    const productRepository = appDataSource.getRepository(Product);
    const product = await productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException("Produto nao encontrado.");
    }

    addToCart(productId, quantity);
  }

  async updateCart(productId: number, quantity: number): Promise<void> {
    updateCart(productId, quantity);
  }

  async finalizeCheckout(
    email: string,
  ): Promise<{ message: string; saleId: number; total: number }> {
    if (isCartEmpty()) {
      throw new BadRequestException("Carrinho vazio.");
    }

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
      customerEmail: email,
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
      email,
      saleId: savedSale.id,
      items: details.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      total,
    });

    clearCart();

    return {
      message: "Compra finalizada com sucesso.",
      saleId: savedSale.id,
      total,
    };
  }
}
