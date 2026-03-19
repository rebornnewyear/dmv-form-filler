import { IsOptional, IsBoolean } from 'class-validator';
import type { ItemsRequested } from '@dmv/shared';

export class ItemsRequestedDto implements ItemsRequested {
  @IsOptional() @IsBoolean() licensePlates?: boolean;
  @IsOptional() @IsBoolean() registrationCard?: boolean;
  @IsOptional() @IsBoolean() yearSticker?: boolean;
  @IsOptional() @IsBoolean() monthSticker?: boolean;
  @IsOptional() @IsBoolean() vesselYearSticker?: boolean;
  @IsOptional() @IsBoolean() vesselCertificate?: boolean;
  @IsOptional() @IsBoolean() vesselMusselFee?: boolean;
  @IsOptional() @IsBoolean() disabledPlacard?: boolean;
  @IsOptional() @IsBoolean() disabledIdCard?: boolean;
  @IsOptional() @IsBoolean() pnoCard?: boolean;
  @IsOptional() @IsBoolean() pfrSticker?: boolean;
  @IsOptional() @IsBoolean() cvraWeightDecal?: boolean;
  @IsOptional() @IsBoolean() cvraYearSticker?: boolean;
  @IsOptional() @IsBoolean() trailerOhvIdCard?: boolean;
}
