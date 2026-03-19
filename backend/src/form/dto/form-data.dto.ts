import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { FormData } from '@dmv/shared';
import { VehicleInfoDto } from './vehicle-info.dto';
import { OwnerInfoDto } from './owner-info.dto';
import { ItemsRequestedDto } from './items-requested.dto';
import { ReasonDto } from './reason.dto';
import { CertificationDto } from './certification.dto';

export class FormDataDto implements FormData {
  @IsDefined()
  @ValidateNested()
  @Type(() => VehicleInfoDto)
  vehicleInfo!: VehicleInfoDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => OwnerInfoDto)
  ownerInfo!: OwnerInfoDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ItemsRequestedDto)
  itemsRequested!: ItemsRequestedDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ReasonDto)
  reason!: ReasonDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CertificationDto)
  certification!: CertificationDto;
}
