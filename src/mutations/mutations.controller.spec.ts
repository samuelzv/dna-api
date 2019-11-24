import {Test} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';

import {MutationsService} from './mutations.service';
import {MutationsController} from './mutations.controller';

describe('MutationsController', () => {
    let mutationsService: MutationsService;
    let server;
    let app: INestApplication;

    const mockMutationService = () => ({
        hasMutation: jest.fn(),
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [
                MutationsController,
            ],
            providers: [
                {
                    provide: MutationsService,
                    useFactory: mockMutationService,
                },
            ],
        }).compile();

        mutationsService = await module.get<MutationsService>(MutationsService);
        app = module.createNestApplication();
        server = app.getHttpServer();

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('createMutations', () => {
        it ('On matched mutation should response with 200 http status code', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(true);

            return request(server)
                .post('/mutations')
                .send({ dna: ['ACTG'] })
                .expect( HttpStatus.OK);
        });

        it ('On not matched mutation throws 403 exepction', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(false);

            return request(server)
                .post('/mutations')
                .send({ dna: ['ACTG'] })
                .expect( HttpStatus.FORBIDDEN);
        });

    });

});
