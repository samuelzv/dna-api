import {Test} from '@nestjs/testing';

import {MovementDirection} from './mutations.models';
import {MutationsService} from './mutations.service';
import {MutationRepository} from './mutation.repository';
import {DNAResult} from './dna-result';
import {appConfig} from '../config/app-config';

describe('MutationsService', () => {
    const dna = ['TGCTGA', 'ATAGCA', 'ATTTTG', 'AGTTAG', 'ATCCTA', 'TGAAAA'];
    let mutationsService: MutationsService;
    let mutationRepository: MutationRepository;

    // mock calls to the database
    const mockMutationRepository = () => ({
       findByDna: jest.fn(),
       saveMutationResult: jest.fn(),
    });

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
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MutationsService,
                {
                    provide: MutationRepository,
                    useFactory: mockMutationRepository,
                },
            ],
        }).compile();

        mutationsService = await module.get<MutationsService>(MutationsService);
        // get the mocked repository version
        mutationRepository = await module.get<MutationRepository>(MutationRepository);
    });

    describe('hasMutation', () => {
        it('Should verify dna exists in db', async () => {
            await mutationsService.hasMutation(dna);

            expect(mutationRepository.findByDna).toHaveBeenCalledWith(dna);
        });

        it('Whenever dna already exists in db, it should not save it again', async () => {
            (mutationRepository.findByDna as jest.Mock<Promise<DNAResult>>).mockResolvedValue({ dna, hasMutation: true });
            await mutationsService.hasMutation(dna);

            expect(mutationRepository.saveMutationResult).not.toHaveBeenCalled();
        });

        it('Whenever dna doesnt exists in db, it should save it into db', async () => {
            (mutationRepository.findByDna as jest.Mock<Promise<DNAResult>>).mockResolvedValue(null);
            await mutationsService.hasMutation(dna);

            expect(mutationRepository.saveMutationResult).toHaveBeenCalled();
        });

        it('Should fail because it doesnt have enough mutations', async () => {
           (mutationRepository.findByDna as jest.Mock<Promise<DNAResult>>).mockResolvedValue(null);
           const result = await mutationsService.hasMutation(dna, { ...appConfig, mutationsRequired: 10000 });

           expect(result).toEqual(false);
        });

        it('Should pass because it has enough mutations', async () => {
            (mutationRepository.findByDna as jest.Mock<Promise<DNAResult>>).mockResolvedValue(null);
            const result = await mutationsService.hasMutation(dna);

            expect(result).toEqual(true);
        });
    });

    describe('countMutations', () => {
        it('Should get 2 mutations horizontally', () => {
            const mutations = mutationsService.countMutations(dna, appConfig.repeatedSequences, MovementDirection.Horizontal);
            expect(mutations).toEqual(2);
        });

        it('Should get 1 mutations vertically', () => {
            const mutations = mutationsService.countMutations(dna, appConfig.repeatedSequences, MovementDirection.Vertical);
            expect(mutations).toEqual(1);
        });

        it('Should get 3 mutations diagonal forward', () => {
            const mutations = mutationsService.countMutations(dna, appConfig.repeatedSequences, MovementDirection.DiagonalForward);
            expect(mutations).toEqual(2);
        });

        it('Should get 1 mutations diagonal backward', () => {
            const mutations = mutationsService.countMutations(dna, appConfig.repeatedSequences, MovementDirection.DiagonalBack);
            expect(mutations).toEqual(1);
        });

        it('Should not get any mutation', () => {
            const mutations = mutationsService.countMutations([], appConfig.repeatedSequences, MovementDirection.Horizontal);
            expect(mutations).toEqual(0);
        });

    });

    describe('getMutationResult', () => {
        it('Getting the mutation horizontally we dont need iterate over the rest', async () => {
            const spy = jest.spyOn(mutationsService, 'countMutations');
            const testDna = ['TTTTACCCCG', 'ATATATATAT']; // horizontally matches

            await mutationsService.getMutationResult(testDna, appConfig);

            // it should call it horizontally
            expect(spy).toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.Horizontal);

            // but not for the other ones
            expect(spy).not.toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.Vertical);
            expect(spy).not.toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.DiagonalForward);
            expect(spy).not.toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.DiagonalBack);
        });

        it('Getting the mutation vertically we dont need iterate over the rest', async () => {
            const spy = jest.spyOn(mutationsService, 'countMutations');
            const testDna = ['TATATATATA', 'TATATATATA', 'TATATATATA', 'TATATATATA']; // vertically matches

            await mutationsService.getMutationResult(testDna, appConfig);

            // it should call it horizontally and vertically
            expect(spy).toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.Horizontal);
            expect(spy).toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.Vertical);

            // but not for the other ones
            expect(spy).not.toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.DiagonalForward);
            expect(spy).not.toHaveBeenCalledWith(testDna, appConfig.repeatedSequences, MovementDirection.DiagonalBack);
        });
    });
});
