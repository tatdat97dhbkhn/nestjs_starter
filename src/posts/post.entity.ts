import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import User from '../users/user.entity';
import Category from '../categories/category.entity';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('text', { array: true, nullable: true })
  public paragraphs: string[];

  @Column({ nullable: true })
  // @Transform((value) => {
  //   if (value !== null) {
  //     return value;
  //   }
  // })
  public category?: string;

  @Index()
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}
