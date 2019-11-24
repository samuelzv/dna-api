/**
 * Data Transfer Object used by creating mutations
 */
import { ApiModelProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsArray, IsString, Matches} from 'class-validator';

export class CreateMutationDto {
    @ApiModelProperty({
        description: 'Array of strings containing dna sequences, it only allows (ATCG) characters',
        example: ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @Matches(/^[ATCG]*$/, { each: true })
    dna: string[];
}
