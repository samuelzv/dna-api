import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class MutationsResolver {
    private logger: Logger = new Logger('MutationsResolver');
    private dnaMatrix: string[][];

    hasMutations(dna: string[]): boolean {
        this.dnaMatrix = this.stringToIndividualChars(dna);
        this.logger.debug(this.dnaMatrix);

        return false;
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
