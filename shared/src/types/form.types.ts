export interface VehicleInfo {
  licensePlate: string;
  make: string;
  vin: string;
  dpPlacardNumber?: string;
  birthDate?: string;
  engineNumber?: string;
}

export interface Address {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

export interface OwnerInfo {
  fullName: string;
  dlNumber?: string;
  coOwnerFullName?: string;
  coOwnerDlNumber?: string;
  physicalAddress: Address;
  county?: string;
  mailingAddress?: Address;
}

export interface ItemsRequested {
  licensePlates?: boolean;
  registrationCard?: boolean;
  yearSticker?: boolean;
  monthSticker?: boolean;
  vesselYearSticker?: boolean;
  vesselCertificate?: boolean;
  vesselMusselFee?: boolean;
  disabledPlacard?: boolean;
  disabledIdCard?: boolean;
  pnoCard?: boolean;
  pfrSticker?: boolean;
  cvraWeightDecal?: boolean;
  cvraYearSticker?: boolean;
  trailerOhvIdCard?: boolean;
}

export type ReasonType =
  | 'lost'
  | 'stolen'
  | 'destroyed'
  | 'notReceivedDmv'
  | 'notReceivedOwner'
  | 'surrendered'
  | 'specialPlatesRetained'
  | 'regCardCurrentAddr'
  | 'perCvc'
  | 'other';

export interface Reason {
  type: ReasonType;
  explanation?: string;
  surrenderedCount?: 'one' | 'two';
}

export interface Certification {
  name: string;
  title?: string;
  phone: string;
  date: string;
  email?: string;
}

export interface FormData {
  vehicleInfo: VehicleInfo;
  ownerInfo: OwnerInfo;
  itemsRequested: ItemsRequested;
  reason: Reason;
  certification: Certification;
}
