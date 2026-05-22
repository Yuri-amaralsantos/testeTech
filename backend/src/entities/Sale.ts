import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SaleItem } from "./SaleItem.js";

@Entity({ name: "sales" })
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", length: 160 })
  customerEmail!: string;

  @Column({ type: "real" })
  total!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items!: SaleItem[];
}
