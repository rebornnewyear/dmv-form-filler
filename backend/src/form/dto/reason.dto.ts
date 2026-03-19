import { Transform } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import type { Reason, ReasonType } from '@dmv/shared';

const REASON_TYPES: ReasonType[] = [
  'lost',
  'stolen',
  'destroyed',
  'notReceivedDmv',
  'notReceivedOwner',
  'surrendered',
  'specialPlatesRetained',
  'regCardCurrentAddr',
  'perCvc',
  'other',
];

export class ReasonDto implements Reason {
  @IsIn(REASON_TYPES, { message: 'Reason must be one of: ' + REASON_TYPES.join(', ') })
  type!: ReasonType;

  @ValidateIf((o: ReasonDto) => o.type === 'stolen' || o.type === 'other')
  @IsNotEmpty({ message: 'Explanation is required when reason is Stolen or Other' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @MaxLength(500)
  @IsOptional()
  explanation?: string;

  @ValidateIf((o: ReasonDto) => o.type === 'surrendered')
  @IsIn(['one', 'two'], { message: 'Surrendered count must be one or two' })
  @IsOptional()
  surrenderedCount?: 'one' | 'two';
}
