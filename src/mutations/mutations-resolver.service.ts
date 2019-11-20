import {Injectable, Logger} from '@nestjs/common';
import * as config from 'config';
import {SequencesWalkerService, SequenceWalkerMovement} from './sequences-walker.service';

// get the app settings from the configuration file, otherwise using the default
const appConfig = config.has('app') ? config.get('app') : { repeatedSequencesToMutation: 4 };

@Injectable()
export class MutationsResolver {
    private logger: Logger = new Logger('MutationsResolver');
    constructor(private sequencesWalker: SequencesWalkerService) {
    }

    hasMutations(dna: string[]): boolean {
        const sequencesMatrix = this.stringToIndividualChars(dna);
        const { repeatedSequences } = appConfig;

        const movements = [
            SequenceWalkerMovement.Horizontal,
            SequenceWalkerMovement.Vertical,
            SequenceWalkerMovement.DiagonalForward,
            SequenceWalkerMovement.DiagonalBack,
        ];

        const mutations = movements.reduce((accumulator: number, current: SequenceWalkerMovement) => {
            return accumulator > 1 ? accumulator : this.sequencesWalker.countMutations(sequencesMatrix, repeatedSequences, current);
        }, 0);

        return mutations > 1;
    }

    /**
     * Split out every string of the array into individual chars
     * in order to create a bi-dimensional array of strings
     * @param dna
     * Having an input like this: ['ABC', 'DEF']
     * it generates a result like this: [  ['A', 'B', 'C' ], ['D', 'E', 'F' ]
     */
    private stringToIndividualChars(dna: string[]): string[][] {
        return dna.map((dnaItem: string) => dnaItem.split(''));
    }

}
