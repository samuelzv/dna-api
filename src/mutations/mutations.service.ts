import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {SequenceContext, MovementDirection, Statistics} from './mutations.models';
import {SequenceMatrix } from './sequence-matrix';
import {MutationRepository} from './mutation.repository';
import {AppConfig, appConfig} from '../config/app-config';

@Injectable()
export class MutationsService {
    private logger: Logger;

    constructor(@InjectRepository(MutationRepository) private mutationRepository: MutationRepository) {
        this.logger = new Logger('MutationsService');
    }

    /**
     * Get a boolean indicating that dna has mutation
     * Whether dna already exists in database it just returns the saved result
     * After getting the mutation result, save this one to the database
     * @param dna
     * @param configParams
     */
    async hasMutation(dna: string[], configParams: AppConfig = appConfig): Promise<boolean> {
        const config: AppConfig  = configParams;

        // Search for a previously registered dna
        const foundDna = await this.mutationRepository.findByDna(dna);
        if (foundDna) {
            // break process and return the saved result
            return foundDna.hasMutation;
        }

        const hasMutationResult =  this.getMutationResult(dna, config);

        // save results to db
        await this.mutationRepository.saveMutationResult(dna, hasMutationResult);

        return hasMutationResult;
    }

    /**
     *  Determines if the dna sequences matches the number of repeated sequences
     *  to know that dna has mutations
     * @param dna
     * @param config
     */
    getMutationResult(dna: string[], config: AppConfig) {
        // Directions to iterate over the matrix
        const movements = [
            MovementDirection.Horizontal,
            MovementDirection.Vertical,
            MovementDirection.DiagonalForward,
            MovementDirection.DiagonalBack,
        ];

        // walk the matrix iterating by the four movement directions
        // we don't need walking all over the matrix, just having the required mutations stop the iteration
        // that is why having mutations required it just return the accumulator rather calling the function
        const mutations = movements.reduce((accumulator: number, current: MovementDirection) => {
            return accumulator >= config.mutationsRequired ?
                accumulator :
                accumulator + this.countMutations(dna, config.repeatedSequences, current);
        }, 0);

        return mutations >= config.mutationsRequired;
    }

    /**
     * Returns the number of mutations found iterating the sequence matrix heading certain direction
     * @param dna
     * @param repeatedSequences
     * @param direction
     */
    countMutations(dna: string[], repeatedSequences: number, direction: MovementDirection): number {
        let mutations = 0;
        let matches = 1;
        const matrix = new SequenceMatrix(dna);

        /**
         * Visitor function applied to every matrix sequence item
         * isolates the logic to know if the current sequence is equal to the next one
         * based upon the type of movement (horizontal, vertical, diagonal)
         * @param context
         */
        const visitor =  (context: SequenceContext): number => {
            const current = matrix.getSequence(context);
            const neighbour = matrix.getNeighbourSequence(context, direction);
            if (current.sequence === neighbour.sequence && matches < repeatedSequences) {
                ++matches;
                return visitor(neighbour);
            } else {
                if (matches === repeatedSequences) {
                    mutations += 1;
                }
                matches = 1;
            }

            return matches;
        };

        matrix.walk(visitor, direction);
        this.logger.log(`Direction: ${direction}: Mutations: ${mutations}`);

        return mutations;
    }

    /**
     * Get statistic results counting matched mutations
     * @return Statistics
     */
    async getStatistics(): Promise<Statistics> {
        return this.mutationRepository.getStatistics();
    }
}
