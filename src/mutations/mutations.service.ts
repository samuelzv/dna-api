import {Injectable, Logger} from '@nestjs/common';
import * as config from 'config';
import {SequencesWalkerService} from './sequences-walker.service';
import {SequenceWalkerMovement} from './mutations.models';

// get the app settings from the configuration file, otherwise using the default
const appConfig = config.has('app') ? config.get('app') : { repeatedSequencesToMutation: 4 };

@Injectable()
export class MutationsService {
    private logger: Logger = new Logger('MutationsService');
    constructor(private sequencesWalker: SequencesWalkerService) {
    }

    hasMutations(dna: string[]): boolean {
        const { repeatedSequences } = appConfig;

        const movements = [
            SequenceWalkerMovement.Horizontal,
            SequenceWalkerMovement.Vertical,
            SequenceWalkerMovement.DiagonalForward,
            SequenceWalkerMovement.DiagonalBack,
        ];

        const mutations = movements.reduce((accumulator: number, current: SequenceWalkerMovement) => {
            return accumulator > 1 ? accumulator : this.sequencesWalker.countMutations(dna, repeatedSequences, current);
        }, 0);

        return mutations > 1;
    }
}
