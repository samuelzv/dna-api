import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity()
@Unique(['dna'])
export class Mutation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dna: string; // coma separated strings

    @Column()
    hasMutation: boolean;
}
