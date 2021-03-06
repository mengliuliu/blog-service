// src/entity/user.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;
}
