# Test Data — DMV Form REG-156 (Manual UI Testing)

---

## Scenario 1: Basic — Minimum Required Fields

### Step 1 — Vehicle Information

| Field | Value |
|-------|-------|
| License Plate / CF Number | `7ABC123` |
| Make | `Toyota` |
| VIN | `1HGBH41JXMN109186` |
| Last 5 of VIN | *(auto-fills: `09186`)* |
| Disabled Person Placard Number | *(leave empty)* |
| Birth Date, if DP Placard | *(leave empty)* |
| Engine Number | *(leave empty)* |

### Step 2 — Registered Owner

| Field | Value |
|-------|-------|
| True Full Name | `Doe, John` |
| DL / ID Number | *(leave empty)* |
| Co-Owner | *(leave empty)* |
| Street Address | `1234 Sunset Blvd` |
| Apt / Space | *(leave empty)* |
| City | `Los Angeles` |
| State | `CA` (select from dropdown) |
| ZIP Code | `90028` |
| County | *(leave empty)* |
| Mailing address different? | *(off)* |

### Step 3 — Items Requested

| Item | Selected |
|------|:--------:|
| Registration Card | ✅ |
| *(all others)* | ☐ |

### Step 4 — Reason

| Field | Value |
|-------|-------|
| Reason | `Lost` |
| Explanation | *(leave empty)* |

### Step 5 — Certification

| Field | Value |
|-------|-------|
| Print True Full Name | `John Doe` |
| Title | *(leave empty)* |
| Telephone Number | `5551234567` |
| Date | `03/19/2026` |
| Email | *(leave empty)* |

**Expected:** PDF downloads successfully with minimal data filled.

---

## Scenario 2: Full — All Fields Filled

### Step 1 — Vehicle Information

| Field | Value |
|-------|-------|
| License Plate / CF Number | `8XYZ789` |
| Make | `Honda` |
| VIN | `2HGFA16578H301234` |
| Last 5 of VIN | *(auto-fills: `01234`)* |
| Disabled Person Placard Number | `DP-998877` |
| Birth Date | `05/15/1985` |
| Engine Number | `ENG-44556` |

### Step 2 — Registered Owner

| Field | Value |
|-------|-------|
| True Full Name | `Smith, Jane Marie` |
| DL / ID Number | `F7654321` |
| Co-Owner Full Name | `Smith, Robert` |
| Co-Owner DL / ID | `F1112233` |
| **Physical Address** | |
| Street Address | `5678 Hollywood Ave` |
| Apt / Space | `12B` |
| City | `San Francisco` |
| State | `CA` (select from dropdown) |
| ZIP Code | `94102-3456` |
| County | `San Francisco` |
| Mailing address different? | ✅ **(on)** |
| **Mailing Address** | |
| Street Address | `PO Box 9999` |
| Apt / Space | *(leave empty)* |
| City | `Sacramento` |
| State | `CA` (select from dropdown) |
| ZIP Code | `95814` |

### Step 3 — Items Requested

| Item | Selected |
|------|:--------:|
| License Plates | ✅ |
| Registration Card | ✅ |
| Year Sticker | ✅ |
| Month Sticker | ✅ |
| *(all others)* | ☐ |

### Step 4 — Reason

| Field | Value |
|-------|-------|
| Reason | `Stolen` |
| Explanation | `Plates were stolen from parking lot on 03/15/2026. Police report #2026-45678 filed.` |

### Step 5 — Certification

| Field | Value |
|-------|-------|
| Print True Full Name | `Jane Marie Smith` |
| Title | `Owner` |
| Telephone Number | `415-555-9876` |
| Date | `03/19/2026` |
| Email | `jane.smith@example.com` |

**Expected:** PDF downloads with all fields populated, including mailing address, co-owner, and placard info.

---

## Scenario 3: Surrendered Plates

### Step 1 — Vehicle Information

| Field | Value |
|-------|-------|
| License Plate | `4DEF456` |
| Make | `Ford` |
| VIN | `3FAHP0HA7CR123456` |

### Step 2 — Registered Owner

| Field | Value |
|-------|-------|
| True Full Name | `Johnson, Mike` |
| Street Address | `900 Market St` |
| City | `San Diego` |
| State | `CA` |
| ZIP Code | `92101` |
| Mailing address different? | *(off)* |

### Step 3 — Items Requested

| Item | Selected |
|------|:--------:|
| License Plates | ✅ |

### Step 4 — Reason

| Field | Value |
|-------|-------|
| Reason | `Surrendered to DMV but Replacement Needed` |
| Number of plates surrendered | `Two` |

### Step 5 — Certification

| Field | Value |
|-------|-------|
| Print True Full Name | `Mike Johnson` |
| Telephone Number | `619-555-0000` |
| Date | `03/19/2026` |

**Expected:** PDF downloads with "Surrendered" checked and "Two" plate count indicated.

---

## Scenario 4: Other Reason with Explanation

### Step 1 — Vehicle Information

| Field | Value |
|-------|-------|
| License Plate | `1AAA111` |
| Make | `BMW` |
| VIN | `WBAPH5C55BA123456` |

### Step 2 — Registered Owner

| Field | Value |
|-------|-------|
| True Full Name | `Lee, Sarah` |
| Street Address | `200 Oak Drive` |
| City | `Fresno` |
| State | `CA` |
| ZIP Code | `93721` |

### Step 3 — Items Requested

| Item | Selected |
|------|:--------:|
| Year Sticker | ✅ |
| Month Sticker | ✅ |

### Step 4 — Reason

| Field | Value |
|-------|-------|
| Reason | `Other` |
| Explanation | `Stickers are damaged and no longer readable due to sun exposure` |

### Step 5 — Certification

| Field | Value |
|-------|-------|
| Print True Full Name | `Sarah Lee` |
| Telephone Number | `559-555-1234` |
| Date | `03/19/2026` |
| Email | `sarah.lee@gmail.com` |

**Expected:** PDF downloads with "Other" checked and explanation text filled.

---

## Scenario 5: Validation Errors (Negative Testing)

Test each case below — the app should show a snackbar error and block navigation to the next step.

### 5a — Empty Vehicle Info

Leave all fields empty on Step 1, click Next.
**Expected:** Snackbar: required fields (License Plate, Make, VIN).

### 5b — Invalid VIN Format

| Field | Value |
|-------|-------|
| License Plate | `7ABC123` |
| Make | `Toyota` |
| VIN | `TOOSHORT` |

**Expected:** Snackbar: VIN must be 17 characters.

### 5c — VIN with Forbidden Letters (I, O, Q)

| Field | Value |
|-------|-------|
| License Plate | `7ABC123` |
| Make | `Toyota` |
| VIN | `1HGBH41JXMI109186` |

**Expected:** Snackbar: VIN contains invalid characters.

### 5d — Invalid ZIP Code

Step 2 — enter `ABCDE` as ZIP.
**Expected:** Snackbar: ZIP must be 5 digits or 5+4 format.

### 5e — No Items Selected

Step 3 — leave all checkboxes unchecked, click Next.
**Expected:** Snackbar: Select at least one item.

### 5f — Stolen Without Explanation

Step 4 — select `Stolen`, leave explanation empty, click Next.
**Expected:** Snackbar: Explanation is required.

### 5g — Other Without Explanation

Step 4 — select `Other`, leave explanation empty, click Next.
**Expected:** Snackbar: Explanation is required.

### 5h — Invalid Date Format

Step 5 — enter `2026-03-19` in Date field.
**Expected:** Snackbar: Use MM/DD/YYYY format.

### 5i — Invalid Email Format

Step 5 — enter `not-an-email` in Email field.
**Expected:** Snackbar: Invalid email.

### 5j — Missing Certification Fields

Step 5 — leave Name, Phone, Date empty, click Generate.
**Expected:** Snackbar: required fields.

---

## Quick Copy-Paste Values

For fast manual testing, copy these values:

```
License Plate:  7ABC123
Make:           Toyota
VIN:            1HGBH41JXMN109186
Full Name:      Doe, John Michael
Street:         1234 Sunset Blvd
City:           Los Angeles
State:          CA
ZIP:            90028
Phone:          555-123-4567
Date:           03/19/2026
Email:          john.doe@example.com
```
