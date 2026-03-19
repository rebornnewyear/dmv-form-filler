import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import type { VehicleInfo } from '@dmv/shared';

export class VehicleInfoDto implements VehicleInfo {
  @IsNotEmpty({ message: 'License plate is required' })
  @IsString()
  @MaxLength(10)
  licensePlate!: string;

  @IsNotEmpty({ message: 'Make is required' })
  @IsString()
  @MaxLength(30)
  make!: string;

  @IsNotEmpty({ message: 'VIN is required' })
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)',
  })
  vin!: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(20)
  dpPlacardNumber?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Birth date must be in MM/DD/YYYY format',
  })
  birthDate?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(20)
  engineNumber?: string;
}
