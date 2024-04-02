import { Category } from 'src/entity/category.enitity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  categoryId: string;

  @OneToOne(() => Report, (report) => report.faq)
  report: Report;

  @ManyToOne(() => Category, (category) => category.id)
  faq: Faq;
}
