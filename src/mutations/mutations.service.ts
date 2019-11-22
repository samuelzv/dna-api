import { Injectable, Logger } from '@nestjs/common';
import * as config from 'config';

import { SequenceContext, SequenceWalkerMovement } from './mutations.models';
import { SequenceMatrix } from './sequence-matrix';

// get the app settings from the configuration file
const appConfig = config.has('app') ? config.get('app') : null;

@Injectable()
export class MutationsService {
    private logger: Logger = new Logger('MutationsService');

    /**
     *  Determine if the dna sequences matches the number of repetead sequences
     *  to determine that dna has mutations
     * @param dna
     * @param configParams
     */
    hasMutations(dna: string[], configParams = null): boolean {
        const { repeatedSequences, mutationsRequired } = configParams || appConfig;

        const movements = [
            SequenceWalkerMovement.Horizontal,
            SequenceWalkerMovement.Vertical,
            SequenceWalkerMovement.DiagonalForward,
            SequenceWalkerMovement.DiagonalBack,
        ];

        // walk the matrix iterating by the four movement directions
        // having the required mutations stop the iteration, just return the current accumulator
        const mutations = movements.reduce((accumulator: number, current: SequenceWalkerMovement) => {
            return accumulator >= mutationsRequired ? accumulator : accumulator + this.countMutations(dna, repeatedSequences, current);
        }, 0);

        return mutations >= mutationsRequired;
    }

    /**
     * Returns the number of mutations found iterating the sequence matrix heading certain direction
     * @param dna
     * @param repeatedSequencesToMutation
     * @param movementType
     */
    countMutations(dna: string[], repeatedSequencesToMutation: number, movementType: SequenceWalkerMovement): number {
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
            const neighbour = matrix.getNeighbourSequence(context, movementType);
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

        matrix.walk(visitor, movementType);

        return mutations;
    }
}
