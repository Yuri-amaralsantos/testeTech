import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Body,
} from "@nestjs/common";
import { ZodError } from "zod";
import { AppService } from "./app.service.js";
import {
  addToCartSchema,
  checkoutSchema,
  updateCartSchema,
} from "./schemas.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  health(): { ok: true } {
    return { ok: true };
  }

  @Get("produtos")
  getProducts() {
    return this.appService.getProducts();
  }

  @Get("carrinho")
  getCart() {
    return this.appService.getCart();
  }

  @Post("carrinho")
  async addToCart(@Body() body: unknown) {
    try {
      const parsed = addToCartSchema.parse(body);
      await this.appService.addToCart(parsed.productId, parsed.quantity);

      return { message: "Produto adicionado ao carrinho." };
    } catch (error) {
      this.rethrowValidationError(error);
    }
  }

  @Put("carrinho")
  async updateCart(@Body() body: unknown) {
    try {
      const parsed = updateCartSchema.parse(body);
      await this.appService.updateCart(parsed.productId, parsed.quantity);

      return { message: "Carrinho atualizado." };
    } catch (error) {
      this.rethrowValidationError(error);
    }
  }

  @Post("finalizar-compra")
  async finalizeCheckout(@Body() body: unknown) {
    try {
      const parsed = checkoutSchema.parse(body);
      return this.appService.finalizeCheckout(parsed.email);
    } catch (error) {
      this.rethrowValidationError(error);
    }
  }

  private rethrowValidationError(error: unknown): never {
    if (error instanceof ZodError) {
      throw new BadRequestException({
        message: "Dados invalidos.",
        details: error.issues,
      });
    }

    throw error;
  }
}
