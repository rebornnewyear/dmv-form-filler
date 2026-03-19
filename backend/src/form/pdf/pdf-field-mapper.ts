import type { FormData } from '@dmv/shared';

interface FieldMapping {
  textFields: Record<string, string | undefined>;
  checkboxFields: Record<string, boolean | undefined>;
}

export function mapFormDataToPdfFields(data: FormData): FieldMapping {
  const { vehicleInfo, ownerInfo, itemsRequested, reason, certification } = data;

  const textFields: Record<string, string | undefined> = {
    vehicleLicensePlate: vehicleInfo.licensePlate,
    vehicleMake: vehicleInfo.make,
    vehicleVin: vehicleInfo.vin,
    vehicleDpPlacardNumber: vehicleInfo.dpPlacardNumber,
    vehicleBirthDate: vehicleInfo.birthDate,
    vehicleEngineNumber: vehicleInfo.engineNumber,

    ownerFullName: ownerInfo.fullName,
    ownerDlNumber: ownerInfo.dlNumber,
    coOwnerFullName: ownerInfo.coOwnerFullName,
    coOwnerDlNumber: ownerInfo.coOwnerDlNumber,

    physicalStreet: ownerInfo.physicalAddress.street,
    physicalApt: ownerInfo.physicalAddress.apt,
    physicalCity: ownerInfo.physicalAddress.city,
    physicalState: ownerInfo.physicalAddress.state,
    physicalZip: ownerInfo.physicalAddress.zip,
    ownerCounty: ownerInfo.county,

    mailingStreet: ownerInfo.mailingAddress?.street,
    mailingApt: ownerInfo.mailingAddress?.apt,
    mailingCity: ownerInfo.mailingAddress?.city,
    mailingState: ownerInfo.mailingAddress?.state,
    mailingZip: ownerInfo.mailingAddress?.zip,

    reasonExplanation: reason.explanation,

    certName: certification.name,
    certTitle: certification.title,
    certPhone: certification.phone,
    certDate: certification.date,
    certEmail: certification.email,
  };

  const reasonCheckboxMap: Record<string, string> = {
    lost: 'reasonLost',
    stolen: 'reasonStolen',
    destroyed: 'reasonDestroyed',
    notReceivedDmv: 'reasonNotReceivedDmv',
    notReceivedOwner: 'reasonNotReceivedOwner',
    surrendered: 'reasonSurrendered',
    specialPlatesRetained: 'reasonSpecialPlatesRetained',
    regCardCurrentAddr: 'reasonRegCardCurrentAddr',
    perCvc: 'reasonPerCvc',
    other: 'reasonOther',
  };

  const checkboxFields: Record<string, boolean | undefined> = {
    itemLicensePlates: itemsRequested.licensePlates,
    itemRegistrationCard: itemsRequested.registrationCard,
    itemYearSticker: itemsRequested.yearSticker,
    itemMonthSticker: itemsRequested.monthSticker,
    itemVesselYearSticker: itemsRequested.vesselYearSticker,
    itemVesselCertificate: itemsRequested.vesselCertificate,
    itemVesselMusselFee: itemsRequested.vesselMusselFee,
    itemDisabledPlacard: itemsRequested.disabledPlacard,
    itemDisabledIdCard: itemsRequested.disabledIdCard,
    itemPnoCard: itemsRequested.pnoCard,
    itemPfrSticker: itemsRequested.pfrSticker,
    itemCvraWeightDecal: itemsRequested.cvraWeightDecal,
    itemCvraYearSticker: itemsRequested.cvraYearSticker,
    itemTrailerOhvIdCard: itemsRequested.trailerOhvIdCard,
  };

  const reasonFieldName = reasonCheckboxMap[reason.type];
  if (reasonFieldName) {
    checkboxFields[reasonFieldName] = true;
  }

  if (reason.type === 'surrendered' && reason.surrenderedCount) {
    checkboxFields['surrenderedOne'] = reason.surrenderedCount === 'one';
    checkboxFields['surrenderedTwo'] = reason.surrenderedCount === 'two';
  }

  return { textFields, checkboxFields };
}
