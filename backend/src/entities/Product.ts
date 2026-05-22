import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", length: 120 })
  name!: string;

  @Column({ type: "text", length: 80, default: "uncategorized" })
  category!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "real" })
  price!: number;

  @Column({ type: "text", length: 255 })
  imageUrl!: string;
}
