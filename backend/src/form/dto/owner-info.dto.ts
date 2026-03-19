import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import type { OwnerInfo } from '@dmv/shared';
import { AddressDto } from './address.dto';

export class OwnerInfoDto implements OwnerInfo {
  @IsString()
  @MaxLength(100)
  fullName!: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(20)
  dlNumber?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(100)
  coOwnerFullName?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(20)
  coOwnerDlNumber?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  physicalAddress!: AddressDto;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(50)
  county?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  mailingAddress?: AddressDto;
}
