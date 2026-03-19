import {
  PDFDocument, StandardFonts, rgb,
  PDFName, PDFDict, PDFArray, PDFString, PDFNumber,
} from 'pdf-lib';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PW = 612, PH = 792, ML = 18, CW = PW - 36;
const BLACK = rgb(0, 0, 0), GRAY = rgb(0.85, 0.85, 0.85);

const lbl = (p, f, t, x, y, s = 5.5) => p.drawText(t, { x, y, size: s, font: f, color: BLACK });
const hdr = (p, f, t, x, y, w, h = 15) => {
  p.drawRectangle({ x, y, width: w, height: h, color: GRAY, borderColor: BLACK, borderWidth: 0.5 });
  p.drawText(t, { x: x + 3, y: y + 4, size: 7, font: f, color: BLACK });
};
const box = (p, x, y, w, h) => p.drawRectangle({ x, y, width: w, height: h, borderColor: BLACK, borderWidth: 0.5 });

function tf(form, name, page, x, y, w, h, fs = 10) {
  const f = form.createTextField(name);
  f.addToPage(page, { x, y, width: w, height: h, borderWidth: 0 });
  f.setFontSize(fs);
}
function ck(form, name, page, x, y, sz = 11) {
  const c = form.createCheckBox(name);
  c.addToPage(page, { x, y, width: sz, height: sz, borderWidth: 0.5, borderColor: BLACK });
}

async function main() {
  const doc = await PDFDocument.create();
  const fn = await doc.embedFont(StandardFonts.Helvetica);
  const fb = await doc.embedFont(StandardFonts.HelveticaBold);
  const pg = doc.addPage([PW, PH]);
  const form = doc.getForm();

  pg.drawRectangle({ x: ML, y: 14, width: CW, height: PH - 28, borderColor: BLACK, borderWidth: 1 });

  // ─── TITLE ───
  let Y = PH - 46;
  pg.drawText('APPLICATION FOR REPLACEMENT', { x: 130, y: Y + 12, size: 12, font: fb, color: BLACK });
  pg.drawText('PLATES, STICKERS, DOCUMENTS', { x: 130, y: Y, size: 12, font: fb, color: BLACK });

  // DMV USE ONLY — positioned inside the outer border, touching right edge
  const dW = 152, dH = 36;
  const dX = ML + CW - dW;
  const dY = PH - 14 - dH;
  pg.drawRectangle({ x: dX, y: dY, width: dW, height: dH, borderColor: BLACK, borderWidth: 0.5, color: rgb(1, 1, 1) });
  lbl(pg, fb, 'DMV USE ONLY', dX + 38, dY + dH - 10, 7);
  lbl(pg, fn, 'DL/ID/OL NUMBER', dX + 3, dY + dH - 20);
  lbl(pg, fn, 'FICE', dX + 3, dY + 3);
  lbl(pg, fn, 'DATE', dX + 55, dY + 3);
  lbl(pg, fn, 'ID #', dX + 110, dY + 3);

  Y -= 30;
  lbl(pg, fn, 'REG 156 (REV. 11/2024) WWW', ML + 3, Y, 6);
  Y -= 11;
  lbl(pg, fn, 'Complete all sections of this form and submit to any DMV office or mail to:', ML + 3, Y, 6.5);
  Y -= 9;
  lbl(pg, fb, 'DMV, P.O. Box 942869, Sacramento, CA 94269-0001', ML + 3, Y, 6.5);
  Y -= 10;
  lbl(pg, fn, 'NOTE: There is a fee to replace most items. If your address has changed, submit the', ML + 3, Y, 5.5);
  Y -= 7;
  lbl(pg, fn, 'appropriate Change of Address form. For current fee information, visit dmv.ca.gov, or call 1-800-777-0133.', ML + 3, Y, 5.5);

  // ─── VEHICLE ───
  Y -= 10;
  const RH = 30, FH = 16, LO = 8;
  const v1 = 195, v2 = 135, v3 = CW - v1 - v2;

  box(pg, ML, Y - RH, v1, RH); box(pg, ML + v1, Y - RH, v2, RH); box(pg, ML + v1 + v2, Y - RH, v3, RH);
  lbl(pg, fb, 'VEHICLE LICENSE PLATE/CF NUMBER', ML + 2, Y - LO);
  lbl(pg, fb, 'MAKE', ML + v1 + 2, Y - LO);
  lbl(pg, fb, 'VEHICLE ID NUMBER/HULL ID NUMBER', ML + v1 + v2 + 2, Y - LO);
  tf(form, 'vehicleLicensePlate', pg, ML + 2, Y - RH + 2, v1 - 4, FH, 12);
  tf(form, 'vehicleMake', pg, ML + v1 + 2, Y - RH + 2, v2 - 4, FH, 12);
  tf(form, 'vehicleVin', pg, ML + v1 + v2 + 2, Y - RH + 2, v3 - 4, FH, 10);

  Y -= RH;
  box(pg, ML, Y - RH, v1, RH); box(pg, ML + v1, Y - RH, v2, RH); box(pg, ML + v1 + v2, Y - RH, v3, RH);
  lbl(pg, fb, 'DISABLED PERSON PLACARD NUMBER', ML + 2, Y - LO);
  lbl(pg, fb, 'BIRTH DATE, IF DP PLACARD', ML + v1 + 2, Y - LO);
  lbl(pg, fb, 'ENGINE NUMBER (MOTORCYCLES ONLY)', ML + v1 + v2 + 2, Y - LO);
  tf(form, 'vehicleDpPlacardNumber', pg, ML + 2, Y - RH + 2, v1 - 4, FH, 10);
  tf(form, 'vehicleBirthDate', pg, ML + v1 + 2, Y - RH + 2, v2 - 4, FH, 10);
  tf(form, 'vehicleEngineNumber', pg, ML + v1 + v2 + 2, Y - RH + 2, v3 - 4, FH, 10);

  // ─── SECTION 1: OWNER ───
  Y -= RH + 3;
  hdr(pg, fb, 'SECTION 1 \u2014 REGISTERED OWNER OF RECORD                                              (Please Print)', ML, Y - 15, CW);
  Y -= 15;

  const nW = Math.round(CW * 0.65), dlW = CW - nW;
  box(pg, ML, Y - RH, nW, RH); box(pg, ML + nW, Y - RH, dlW, RH);
  lbl(pg, fb, 'TRUE FULL NAME (LAST, FIRST, MIDDLE) OR BUSINESS NAME', ML + 2, Y - LO);
  lbl(pg, fb, 'DRIVER LICENSE/ID CARD NUMBER', ML + nW + 2, Y - LO);
  tf(form, 'ownerFullName', pg, ML + 2, Y - RH + 2, nW - 4, FH, 11);
  tf(form, 'ownerDlNumber', pg, ML + nW + 2, Y - RH + 2, dlW - 4, FH, 10);

  Y -= RH;
  box(pg, ML, Y - RH, nW, RH); box(pg, ML + nW, Y - RH, dlW, RH);
  lbl(pg, fn, 'CO-OWNER TRUE FULL NAME (LAST, FIRST, MIDDLE)', ML + 2, Y - LO);
  lbl(pg, fn, 'DRIVER LICENSE/ID CARD NUMBER', ML + nW + 2, Y - LO);
  tf(form, 'coOwnerFullName', pg, ML + 2, Y - RH + 2, nW - 4, FH, 11);
  tf(form, 'coOwnerDlNumber', pg, ML + nW + 2, Y - RH + 2, dlW - 4, FH, 10);

  // Address — fixed proportions: Street(40%) Apt(7%) City(26%) State(8%) Zip(19%)
  Y -= RH + 2;
  const aW = Math.round(CW * 0.40), apW = Math.round(CW * 0.07);
  const ciW = Math.round(CW * 0.26), stW = Math.round(CW * 0.08);
  const zpW = CW - aW - apW - ciW - stW;

  box(pg, ML, Y - RH, aW, RH);
  box(pg, ML + aW, Y - RH, apW, RH);
  box(pg, ML + aW + apW, Y - RH, ciW, RH);
  box(pg, ML + aW + apW + ciW, Y - RH, stW, RH);
  box(pg, ML + aW + apW + ciW + stW, Y - RH, zpW, RH);
  lbl(pg, fb, 'PHYSICAL RESIDENCE OR BUSINESS ADDRESS', ML + 2, Y - LO);
  lbl(pg, fb, 'APT.', ML + aW + 2, Y - LO);
  lbl(pg, fb, 'CITY', ML + aW + apW + 2, Y - LO);
  lbl(pg, fb, 'STATE', ML + aW + apW + ciW + 2, Y - LO);
  lbl(pg, fb, 'ZIP CODE', ML + aW + apW + ciW + stW + 2, Y - LO);
  tf(form, 'physicalStreet', pg, ML + 2, Y - RH + 2, aW - 4, FH, 9);
  tf(form, 'physicalApt', pg, ML + aW + 2, Y - RH + 2, apW - 4, FH, 9);
  tf(form, 'physicalCity', pg, ML + aW + apW + 2, Y - RH + 2, ciW - 4, FH, 9);
  tf(form, 'physicalState', pg, ML + aW + apW + ciW + 2, Y - RH + 2, stW - 4, FH, 9);
  tf(form, 'physicalZip', pg, ML + aW + apW + ciW + stW + 2, Y - RH + 2, zpW - 4, FH, 9);

  // County
  Y -= RH;
  const ctyH = 24;
  box(pg, ML, Y - ctyH, CW, ctyH);
  lbl(pg, fb, 'COUNTY OF RESIDENCE OR COUNTY WHERE VEHICLE/VESSEL IS PRIMARILY GARAGED', ML + 2, Y - 7);
  tf(form, 'ownerCounty', pg, ML + 2, Y - ctyH + 2, CW - 4, 13, 10);

  // Mailing address
  Y -= ctyH;
  box(pg, ML, Y - RH, aW, RH);
  box(pg, ML + aW, Y - RH, apW, RH);
  box(pg, ML + aW + apW, Y - RH, ciW, RH);
  box(pg, ML + aW + apW + ciW, Y - RH, stW, RH);
  box(pg, ML + aW + apW + ciW + stW, Y - RH, zpW, RH);
  lbl(pg, fb, 'MAILING ADDRESS (IF DIFFERENT FROM PHYSICAL ABOVE)', ML + 2, Y - LO);
  lbl(pg, fb, 'APT.', ML + aW + 2, Y - LO);
  lbl(pg, fb, 'CITY', ML + aW + apW + 2, Y - LO);
  lbl(pg, fb, 'STATE', ML + aW + apW + ciW + 2, Y - LO);
  lbl(pg, fb, 'ZIP CODE', ML + aW + apW + ciW + stW + 2, Y - LO);
  tf(form, 'mailingStreet', pg, ML + 2, Y - RH + 2, aW - 4, FH, 9);
  tf(form, 'mailingApt', pg, ML + aW + 2, Y - RH + 2, apW - 4, FH, 9);
  tf(form, 'mailingCity', pg, ML + aW + apW + 2, Y - RH + 2, ciW - 4, FH, 9);
  tf(form, 'mailingState', pg, ML + aW + apW + ciW + 2, Y - RH + 2, stW - 4, FH, 9);
  tf(form, 'mailingZip', pg, ML + aW + apW + ciW + stW + 2, Y - RH + 2, zpW - 4, FH, 9);

  // ─── SECTION 2: ITEMS REQUESTED ───
  Y -= RH + 4;
  hdr(pg, fb, 'SECTION 2 \u2014 PLATES, STICKERS, DOCUMENTS REQUEST         \u2014 I am requesting replacement of (Check appropriate box(es))', ML, Y - 15, CW);
  Y -= 15;
  lbl(pg, fn, 'NOTE: For replacement of missing License Plate, License Sticker, or Disabled Person Placard, if the original item is later located or received,', ML + 3, Y - 8, 4.5);
  lbl(pg, fn, 'the original item is no longer valid and must be destroyed or returned to DMV.', ML + 3, Y - 14, 4.5);
  Y -= 17;

  const colW = Math.round(CW / 3), cbH = 14;
  const items = [
    ['itemLicensePlates', 'License Plates'],       ['itemRegistrationCard', 'Registration Card'],   ['itemYearSticker', 'Year Sticker'],
    ['itemMonthSticker', 'Month Sticker'],          ['itemVesselYearSticker', 'Vessel (Boat) Year Sticker'], ['itemVesselCertificate', 'Vessel Certificate of Number'],
    ['itemVesselMusselFee', 'Vessel Mussel Fee Sticker'], ['itemDisabledPlacard', 'Disabled Person Placard'], ['itemDisabledIdCard', 'Disabled Person ID Card'],
    ['itemPnoCard', 'Planned Non-Operation (PNO) Card'], ['itemPfrSticker', 'PFR Sticker'],              ['itemCvraWeightDecal', 'CVRA Weight Decal'],
    ['itemCvraYearSticker', 'CVRA Year Sticker'],   ['itemTrailerOhvIdCard', 'Trailer/OHV ID Card'],
  ];
  const iRows = Math.ceil(items.length / 3), iBH = iRows * cbH + 6;
  box(pg, ML, Y - iBH, CW, iBH);
  for (let i = 0; i < items.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const cx = ML + col * colW + 8, cy = Y - 3 - row * cbH - cbH + 3;
    ck(form, items[i][0], pg, cx, cy, 10);
    lbl(pg, fn, items[i][1], cx + 14, cy + 2, 6.5);
  }

  // ─── SECTION 3: REASON ───
  Y -= iBH + 3;
  hdr(pg, fb, 'SECTION 3 \u2014 THE ITEM REQUESTED WAS                                                  (Check appropriate box(es))', ML, Y - 15, CW);
  Y -= 15;

  const reasons = [
    ['reasonLost', 'Lost'],                         ['reasonStolen', 'Stolen'],                      ['reasonDestroyed', 'Destroyed/Mutilated'],
    ['reasonNotReceivedDmv', 'Not Received from DMV (Allow 30 days)'], ['reasonNotReceivedOwner', 'Not Received from Prior Owner'], ['reasonSurrendered', 'Surrendered'],
    ['reasonSpecialPlatesRetained', 'Special Plates Retained by Owner'], ['reasonRegCardCurrentAddr', 'Requesting Reg Card with Current Address'], ['reasonPerCvc', 'Per CVC 4467 \u2014 Police report required'],
  ];
  const rRows = Math.ceil(reasons.length / 3), rBH = rRows * cbH + cbH + cbH + 8;
  box(pg, ML, Y - rBH, CW, rBH);
  for (let i = 0; i < reasons.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const cx = ML + col * colW + 8, cy = Y - 3 - row * cbH - cbH + 3;
    ck(form, reasons[i][0], pg, cx, cy, 10);
    lbl(pg, fn, reasons[i][1], cx + 14, cy + 2, 6.5);
  }
  // Other + Explain
  const oY = Y - 3 - rRows * cbH;
  ck(form, 'reasonOther', pg, ML + 8, oY - cbH + 3, 10);
  lbl(pg, fn, 'Other \u2014 Explain:', ML + 22, oY - cbH + 5, 6.5);
  tf(form, 'reasonExplanation', pg, ML + 108, oY - cbH + 1, CW - 118, 13, 8);
  // Surrendered count
  const sY = oY - cbH;
  lbl(pg, fn, 'Number of plates surrendered:', ML + 22, sY - cbH + 5, 6);
  ck(form, 'surrenderedOne', pg, ML + 155, sY - cbH + 3, 10);
  lbl(pg, fn, 'One', ML + 169, sY - cbH + 5, 6.5);
  ck(form, 'surrenderedTwo', pg, ML + 200, sY - cbH + 3, 10);
  lbl(pg, fn, 'Two', ML + 214, sY - cbH + 5, 6.5);

  // ─── SECTION 5: CERTIFICATION ───
  Y -= rBH + 6;
  hdr(pg, fb, 'SECTION 5 \u2014 CERTIFICATION', ML, Y - 15, CW);
  Y -= 15;
  lbl(pg, fn, 'I certify (or declare) under penalty of perjury under the laws of the State of California that the foregoing is true and correct.', ML + 3, Y - 10, 5.5);
  Y -= 14;

  const cnW = Math.round(CW * 0.42), ctW = Math.round(CW * 0.28), cpW = CW - cnW - ctW;
  box(pg, ML, Y - RH, cnW, RH); box(pg, ML + cnW, Y - RH, ctW, RH); box(pg, ML + cnW + ctW, Y - RH, cpW, RH);
  lbl(pg, fb, 'PRINT TRUE FULL NAME', ML + 2, Y - LO);
  lbl(pg, fb, 'TITLE IF SIGNING FOR COMPANY', ML + cnW + 2, Y - LO);
  lbl(pg, fb, 'TELEPHONE NUMBER', ML + cnW + ctW + 2, Y - LO);
  tf(form, 'certName', pg, ML + 2, Y - RH + 2, cnW - 4, FH, 11);
  tf(form, 'certTitle', pg, ML + cnW + 2, Y - RH + 2, ctW - 4, FH, 10);
  tf(form, 'certPhone', pg, ML + cnW + ctW + 2, Y - RH + 2, cpW - 4, FH, 10);

  Y -= RH;
  const csW = Math.round(CW * 0.38), cdW = Math.round(CW * 0.22), ceW = CW - csW - cdW;
  box(pg, ML, Y - RH, csW, RH); box(pg, ML + csW, Y - RH, cdW, RH); box(pg, ML + csW + cdW, Y - RH, ceW, RH);
  lbl(pg, fb, 'SIGNATURE OF REGISTERED OWNER', ML + 2, Y - LO);
  lbl(pg, fb, 'DATE', ML + csW + 2, Y - LO);
  lbl(pg, fb, 'EMAIL ADDRESS', ML + csW + cdW + 2, Y - LO);
  pg.drawText('X', { x: ML + 6, y: Y - RH + 5, size: 14, font: fb, color: BLACK });
  tf(form, 'certDate', pg, ML + csW + 2, Y - RH + 2, cdW - 4, FH, 10);
  tf(form, 'certEmail', pg, ML + csW + cdW + 2, Y - RH + 2, ceW - 4, FH, 9);

  // ─── BUTTONS: Print / Clear Form ───
  // Draw visible button backgrounds and labels directly on the page,
  // then overlay invisible widget annotations with JavaScript actions.
  Y -= RH + 14;
  const bW = 85, bH = 22, gap = 16;
  const bx1 = PW / 2 - bW - gap / 2;
  const bx2 = PW / 2 + gap / 2;

  drawButton(pg, fn, 'Print', bx1, Y - bH, bW, bH);
  drawButton(pg, fn, 'Clear Form', bx2, Y - bH, bW, bH);

  // Add JS button widgets
  addJSButton(doc, pg, 'btnPrint', bx1, Y - bH, bW, bH, 'this.print({bUI:true,bSilent:false});');
  addJSButton(doc, pg, 'btnClear', bx2, Y - bH, bW, bH, 'this.resetForm();');

  // ─── SAVE ───
  const bytes = await doc.save();
  const out = join(__dirname, '..', 'templates', 'REG-156.pdf');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, bytes);

  const d2 = await PDFDocument.load(bytes);
  const f2 = d2.getForm().getFields();
  console.log(`Created: ${out} (${bytes.length} bytes, ${f2.length} fields)`);
  f2.forEach(f => console.log(`  ${f.constructor.name}: ${f.getName()}`));
}

function drawButton(page, font, text, x, y, w, h) {
  page.drawRectangle({ x, y, width: w, height: h, color: rgb(0.92, 0.92, 0.92), borderColor: rgb(0.4, 0.4, 0.4), borderWidth: 0.75 });
  const tw = font.widthOfTextAtSize(text, 9);
  page.drawText(text, { x: x + (w - tw) / 2, y: y + (h - 9) / 2 + 1, size: 9, font, color: rgb(0, 0, 0) });
}

function addJSButton(doc, page, name, x, y, w, h, js) {
  const ctx = doc.context;

  const actionDict = ctx.obj({});
  actionDict.set(PDFName.of('S'), PDFName.of('JavaScript'));
  actionDict.set(PDFName.of('JS'), PDFString.of(js));

  const mkDict = ctx.obj({});
  mkDict.set(PDFName.of('CA'), PDFString.of(''));

  const widget = ctx.obj({});
  widget.set(PDFName.of('Type'), PDFName.of('Annot'));
  widget.set(PDFName.of('Subtype'), PDFName.of('Widget'));
  widget.set(PDFName.of('FT'), PDFName.of('Btn'));
  widget.set(PDFName.of('Ff'), PDFNumber.of(65536));
  widget.set(PDFName.of('T'), PDFString.of(name));
  widget.set(PDFName.of('Rect'), ctx.obj([x, y, x + w, y + h]));
  widget.set(PDFName.of('MK'), mkDict);
  widget.set(PDFName.of('A'), actionDict);
  widget.set(PDFName.of('F'), PDFNumber.of(4)); // print flag
  widget.set(PDFName.of('P'), page.ref);

  const ref = ctx.register(widget);

  const annots = page.node.lookup(PDFName.of('Annots'));
  if (annots instanceof PDFArray) annots.push(ref);

  const acro = doc.catalog.lookup(PDFName.of('AcroForm'));
  if (acro instanceof PDFDict) {
    const fields = acro.lookup(PDFName.of('Fields'));
    if (fields instanceof PDFArray) fields.push(ref);
  }
}

main().catch(console.error);
