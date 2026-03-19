import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import type { Address } from '@dmv/shared';

export class AddressDto implements Address {
  @IsString()
  @MaxLength(100)
  street!: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(20)
  apt?: string;

  @IsString()
  @MaxLength(50)
  city!: string;

  @IsString()
  @MaxLength(2)
  state!: string;

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'ZIP code must be 5 digits or 5+4 format',
  })
  zip!: string;
}
