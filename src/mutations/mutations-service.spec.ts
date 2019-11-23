import {SequenceContext, Sequence, MovementDirection} from './mutations.models';
import {MutationsService} from './mutations.service';

describe('MutationsService', () => {
    const dna = ['TGCTGA', 'ATAGCA', 'ATTTTG', 'AGTTAG', 'ATCCTA', 'TGAAAA'];
    let mutationsService: MutationsService;
    const repeatedSequences = 4;
    /*
           0    1    2    3    4    5
      0  ['T', 'G', 'C', 'T', 'G', 'A'],
      1  ['A', 'T', 'A', 'G', 'C', 'A'],
      2  ['A', 'T', 'T', 'T', 'T', 'G'],
      3  ['A', 'G', 'T', 'T', 'A', 'G'],
      4  ['A', 'T', 'C', 'C', 'T', 'A'],
      5  ['T', 'G', 'A', 'A', 'A', 'A'],
     */
    beforeEach(() => {
        mutationsService = new MutationsService();
    });

    describe('hasMutation', () => {
        it('Should fail because we dont have enough mutations', () => {
            const result = mutationsService.hasMutation(dna, { repeatedSequences: 4, mutationsRequired: 10 });
            expect(result).toEqual(false);
        });

        it('Should pass because have enough mutations', () => {
            const result = mutationsService.hasMutation(dna, { repeatedSequences: 4, mutationsRequired: 5 });
            expect(result).toEqual(true);
        });
    });

    describe('countMutations', () => {

        it('Should get 2 mutations horizontally', () => {
            const mutations = mutationsService.countMutations(dna, repeatedSequences, MovementDirection.Horizontal);
            expect(mutations).toEqual(2);
        });

        it('Should get 1 mutations vertically', () => {
            const mutations = mutationsService.countMutations(dna, repeatedSequences, MovementDirection.Vertical);
            expect(mutations).toEqual(1);
        });

        it('Should get 3 mutations diagonal forward', () => {
            const mutations = mutationsService.countMutations(dna, repeatedSequences, MovementDirection.DiagonalForward);
            expect(mutations).toEqual(2);
        });

        it('Should get 1 mutations diagonal backward', () => {
            const mutations = mutationsService.countMutations(dna, repeatedSequences, MovementDirection.DiagonalBack);
            expect(mutations).toEqual(1);
        });

    });

});
