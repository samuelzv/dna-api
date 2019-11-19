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

        /*
        const horizontalMutations = this.sequencesWalker
            .countMutations(sequencesMatrix, appConfig.repeatedSequencesToMutation, SequenceWalkerMovement.Horizontal);
        this.logger.debug(`Total horizontal mutations:${horizontalMutations}`);
         */

        const verticalMutations = this.sequencesWalker
            .countMutations(sequencesMatrix, appConfig.repeatedSequencesToMutation, SequenceWalkerMovement.DiagonalBack);
        this.logger.debug(`Total vertical mutations:${verticalMutations}`);

        return (verticalMutations) > 1;
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
