import {EntityRepository, Repository} from 'typeorm';
import {ConflictException, InternalServerErrorException, Logger} from '@nestjs/common';

import {Mutation} from './mutation.entity';
import {DNAResult} from './dna-result';

@EntityRepository(Mutation)
export class MutationRepository extends Repository<Mutation> {
    private readonly sequenceSeparator = ',';
    private logger = new Logger('MutationRepository');

    async saveMutationResult(dna: string[], hasMutation: boolean): Promise<void> {
        const mutation = new Mutation();

        // map the array of strings into a coma separated string
        mutation.dna = dna.join(this.sequenceSeparator);
        mutation.hasMutation = hasMutation;
        try {
            await mutation.save();
        } catch (error) {
            this.logger.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('DNA already exists');
            }

            throw new InternalServerErrorException();
        }
    }

    async findByDna(dna: string[]): Promise<DNAResult> {
        const found = await this.findOne({ dna : dna.join(this.sequenceSeparator) });
        return found ? { dna: found.dna.split(this.sequenceSeparator), hasMutation: found.hasMutation }  : null;
    }
}
