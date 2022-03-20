// src/entity/article.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
  })
  title: string;

  @Column("text")
  content: string;

  @Column("datetime")
  createTime: Date;

  @Column({
    type: "boolean",
    default: false,
  })
  is_delete: boolean;

  @Column({
    type: "int",
    default: 0,
  })
  view_count: number;

  @Column({
    type: "int",
    default: 0,
  })
  like_count: number;

  @Column({
    type: "int",
    default: 0,
  })
  comment_count: number;
}
