// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   senderId: number;

//   @Column()
//   senderRole: string; // 'admin', 'trainer', 'nutritionist', 'client'

//   @Column()
//   receiverId: number;

//   @Column()
//   receiverRole: string;

//   @Column()
//   content: string;

//   @Column({ default: false })
//   seen: boolean;

//   @CreateDateColumn()
//   timestamp: Date;
// }





import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderEmail: string;

  @Column()
  senderRole: string;

  @Column()
  receiverEmail: string;

  @Column()
  receiverRole: string;

  @Column()
  content: string;

  @Column({ default: false })
  seen: boolean;

  @CreateDateColumn()
  timestamp: Date;
}

