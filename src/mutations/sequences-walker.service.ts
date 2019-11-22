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
            const neighbour = matrix.getNeighbourSequence(context, movementType);
            if (current.sequence === neighbour.sequence && matches < repeatedSequencesToMutation) {
                matches += 1;
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
        this.logger.debug(`Mutations: ${mutations}`);
        return mutations;
    }
}
