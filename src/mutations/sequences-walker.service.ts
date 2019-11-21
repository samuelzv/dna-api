import {Injectable, Logger} from '@nestjs/common';
import {SequenceWalkerMovement, SequenceContext} from './mutations.models';
import {SequenceMatrix} from './sequence-matrix';

@Injectable()
export class SequencesWalkerService {
    private logger: Logger = new Logger('SequencesWalkerService');

    countMutations(dna: string[], repeatedSequencesToMutation: number, movementType: SequenceWalkerMovement): number {
        let mutations = 0;
        let matches = 1;
        const matrix = new SequenceMatrix(dna);

        const visitor =  (context: SequenceContext): number => {
            const current = matrix.getSequence(context);
            const neighbour = matrix.getNeighbourSequence(context);
            if (current.sequence === neighbour.sequence &&
                matches < repeatedSequencesToMutation) {
                matches += 1;
                const nextContext: SequenceContext = {
                    sequence: neighbour.sequence,
                    row:  neighbour.row,
                    column: neighbour.column,
                    movementType: context.movementType,
                };

                return visitor(nextContext);
            } else {
                if (matches === repeatedSequencesToMutation) {
                    mutations += 1;
                }
                matches = 1;
            }

            return matches;
        };

        matrix.walk(visitor, movementType);
        this.logger.log(`Mutations: ${mutations}`);
        return mutations;
    }
}
