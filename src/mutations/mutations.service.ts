import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import * as config from 'config';
import {SequenceContext, MovementDirection} from './mutations.models';
import {SequenceMatrix } from './sequence-matrix';
import {MutationRepository} from './mutation.repository';

// get the app settings from the configuration file
const appConfig = config.has('app') ? config.get('app') : null;

@Injectable()
export class MutationsService {
    private logger: Logger;

    constructor(@InjectRepository(MutationRepository) private mutationRepository: MutationRepository) {
        this.logger = new Logger('MutationsService');
    }

    /**
     *  Determine if the dna sequences matches the number of repeated sequences
     *  to determine that dna has mutations
     * @param dna
     * @param configParams
     */
    async hasMutation(dna: string[], configParams = null): Promise<boolean> {
        const { repeatedSequences, mutationsRequired, saveResults } = configParams || appConfig;

        // Search for a previously registered dna
        const foundDna = await this.mutationRepository.findByDna(dna);

        if (foundDna) {
            // break process and return the saved result
            this.logger.debug('Taken from db');
            return foundDna.hasMutation;
        }

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
            return accumulator >= mutationsRequired ? accumulator : accumulator + this.countMutations(dna, repeatedSequences, current);
        }, 0);

        const hasMutationResult = mutations >= mutationsRequired;
        // save results to db
        if (saveResults) {
            await this.mutationRepository.saveMutationResult(dna, hasMutationResult);
        }

        return hasMutationResult;
    }

    /**
     * Returns the number of mutations found iterating the sequence matrix heading certain direction
     * @param dna
     * @param repeatedSequencesToMutation
     * @param direction
     */
    countMutations(dna: string[], repeatedSequencesToMutation: number, direction: MovementDirection): number {
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
            if (current.sequence === neighbour.sequence && matches < repeatedSequencesToMutation) {
                ++matches;
                return visitor(neighbour);
            } else {
                if (matches === repeatedSequencesToMutation) {
                    mutations += 1;
                }
                matches = 1;
            }

            return matches;
        };

        matrix.walk(visitor, direction);

        return mutations;
    }
}
