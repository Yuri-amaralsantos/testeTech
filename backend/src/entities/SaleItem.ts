import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale.js";
import { Product } from "./Product.js";

@Entity({ name: "sale_items" })
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: "CASCADE" })
  sale!: Sale;

  @ManyToOne(() => Product, { eager: true, onDelete: "RESTRICT" })
  product!: Product;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "real" })
  unitPrice!: number;

  @Column({ type: "real" })
  subtotal!: number;
}
