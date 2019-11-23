import {EntityRepository, Repository} from 'typeorm';
import {Mutation} from './mutation.entity';
import {ConflictException, InternalServerErrorException, Logger} from '@nestjs/common';

@EntityRepository(Mutation)
export class MutationRepository extends Repository<Mutation> {
    private logger = new Logger('MutationRepository');

    async saveDNAResults(dna: string[], hasMutation: boolean): Promise<void> {
        const mutation = new Mutation();

        // map the array of strings into a coma separated string
        mutation.dna = dna.join(',');
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
}
