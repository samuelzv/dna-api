import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Mutation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Index()
    dna: string; // coma separated strings

    @Column()
    hasMutation: boolean;
}
