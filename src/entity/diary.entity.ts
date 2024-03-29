import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Emotion } from './emotion.like.entity';
import { Image } from './image.entity';
import { Like } from './like.entity';
import { BookMark } from './mark.entity';
import { Report } from './report.entity';
import { UserEntity } from './user.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn() // DB 저장 순서
  id: number;

  @Column() // 제목
  title: string;

  @Column() // prompt 입력 내용
  contents: string;

  @Column() // 일기 날짜
  date: string;

  @Column() //감정
  emotion: string;

  @Column() // 날씨
  weather: string;

  @Column({ type: 'tinyint', default: 0 }) // 일기 작성여부 확인. 기본값 0
  isWrite: boolean;

  @Column({ type: 'tinyint', default: 0 }) // 일기 공개여부 확인 ->0은 나만 보기
  isPublic: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn() // 게시글 생성일
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.diary, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => Like, (like) => like.diary, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToOne(() => Image)
  @JoinTable()
  image: Image;

  @OneToMany(() => BookMark, (bookmark) => bookmark.diary, {
    onDelete: 'CASCADE',
  })
  bookmarks: BookMark[];

  @OneToMany(() => Emotion, (emotions) => emotions.diary, {
    onDelete: 'CASCADE',
  })
  emotions: Emotion[];

  @OneToMany(() => Report, (report) => report.diary)
  report: Report[];
}
