import {Body, Controller, ForbiddenException, Get, HttpCode, Logger, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUseTags} from '@nestjs/swagger';

import {CreateMutationDto} from './dto/create-mutation.dto';
import {MutationsService} from './mutations.service';
import {Statistics} from './mutations.models';

@ApiUseTags('mutations')
@Controller('mutations')
export class MutationsController {
    private logger = new Logger('MutationsController');
    constructor(private mutationService: MutationsService) {
    }

    @Post()
    @HttpCode(200) // normally post request responds with 201 so we need to override that
    @UsePipes(ValidationPipe)
    @ApiOkResponse({ description: 'Mutation has been found.'})
    @ApiForbiddenResponse({ description: 'Not found mutation.'})
    @ApiBadRequestResponse({ description: 'Invalid dna input, it should be an array of strings which containing only "ATCG" chars'})
    @ApiOperation({
        title: 'Detects mutations over a DNA sequence',
        description: 'On mutation found returns 200 status, otherwise returns 403 forbidden status. it only allows (ATCG) chars, breaking this rule will lead to 400 bad request response',
    })
    async createMutations(@Body() createMutationDto: CreateMutationDto) {
        const { dna } = createMutationDto;
        const hasMutation = await this.mutationService.hasMutation(dna);

        if (!hasMutation) {
            throw new ForbiddenException('DNA has not mutation'); // not found
        }

        return { message: 'Mutation found!' }; // success
    }

    @Get('/stats')
    @ApiOperation({ title: 'Get mutation stats results' })
    @ApiOkResponse({ description: 'Object containing stats results.', type: Statistics })
    async getMutationStats() {
        return this.mutationService.getStatistics();
    }
}
