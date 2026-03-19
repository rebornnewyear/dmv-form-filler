import { IsDefined, Validate, ValidateNested, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Type } from 'class-transformer';
import type { FormData } from '@dmv/shared';
import { VehicleInfoDto } from './vehicle-info.dto';
import { OwnerInfoDto } from './owner-info.dto';
import { ItemsRequestedDto } from './items-requested.dto';
import { ReasonDto } from './reason.dto';
import { CertificationDto } from './certification.dto';

@ValidatorConstraint({ name: 'atLeastOneItem', async: false })
class AtLeastOneItemConstraint implements ValidatorConstraintInterface {
  validate(value: ItemsRequestedDto): boolean {
    if (!value) return false;
    return Object.values(value).some((v) => v === true);
  }

  defaultMessage(): string {
    return 'At least one item must be selected';
  }
}

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
  @Validate(AtLeastOneItemConstraint)
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
