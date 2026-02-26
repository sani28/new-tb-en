
## Purpose (why this file exists)

This repo is a **Next.js frontend prototype**.

Goal: make it easy for a Python backend dev to understand:

- which API endpoints the frontend expects
- what JSON payloads we plan to send
- how we count “one tour purchase” (tickets + add-ons)

The booking experience is currently a **hybrid**:

- `public/booking.html` provides most of the HTML/CSS + some legacy JS
- React “bridges” (in `src/app/booking/*`) attach to the legacy DOM and keep state in React stores
- We have an API helper layer already (`src/lib/api/*`) that calls `NEXT_PUBLIC_API_BASE_URL`

## Environment

The frontend reads the API base URL from an environment variable:

- `NEXT_PUBLIC_API_BASE_URL` (see `.env.example` at repo root)

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Where API calls live

All API helpers are in `src/lib/api/`:

- `lib/api/http.ts` – minimal `jsonFetch` wrapper around `fetch`
- `lib/api/tours.ts` – tour listing / availability
- `lib/api/addons.ts` – promo add-ons
- `lib/api/bookings.ts` – booking creation + lookup

Shared types are in `src/types/`:

- `types/tours.ts` – `Tour`, `TourPricing`, `TourAvailability`
- `types/promo.ts` – promo add-on product shapes
- `types/booking.ts` – `BookingRequest` / `BookingResponse`, tickets, addons

Prototype promo add-on data currently lives in:

- `lib/data/promoProducts.ts`

## Example usage (frontend)

### Booking flow overview (what the user does)

Everyday language walkthrough:

1. **Step 1 (tour + tickets + date)**
   - user chooses a tour route (`tourId`)
   - user chooses how many **adult** and **child** tickets
   - user chooses a date
2. **Step 2 (optional add-ons)**
   - user can add extra products/services (some are simple quantity, some require date/time)
3. **Step 3 (contact info)**
   - user enters name/email/phone and agrees to terms
4. **Step 4 (payment/confirmation UI)**
   - right now this is UI-only in the prototype
   - later: this is where we will call the Python backend to create the booking + start payment

### What counts as “one tour product purchase”

**One purchase = one `POST /bookings` request**.

That single request should contain:

- `tourId`
- `date` (ISO `yyyy-mm-dd`)
- `tickets[]` (adult + child quantities)
- `addons[]` (optional)
- `contact`

### Ticket counting (important for backend)

- We store **adultCount** + **childCount** separately.
- The “total seats” for the tour is `adultCount + childCount`.
- We send two `tickets[]` entries (`adult` and `child`) so pricing/limits are clear.

### Add-on counting (important for backend)

Add-ons can be different “types”, which changes how we validate + count them:

- **physical**: simple `quantity` (optionally with `variant`/`color`)
- **scheduled**: needs `selectedDate` (and sometimes `selectedTime`) + adult/child split
- **validityPass**: adult/child split, no date, but may have `validUntil`
- **cruise** (prototype): can have `selectedDate` + `selectedTimeSlot` + cruise option

Backend tip: the safest approach is to treat `addons[]` as **line items** and validate required fields based on the add-on’s server-side type.

## Endpoints the frontend expects (proposed)

All paths are relative to `NEXT_PUBLIC_API_BASE_URL`.

- `GET /tours`
- `GET /tours/{tourId}/availability?date=YYYY-MM-DD`
- `GET /addons`
- `POST /bookings`
- `GET /bookings/{referenceCode}`

## Booking request/response shape

Source of truth for types:

- `src/types/booking.ts`

Notes:

- `unitPrice` is currently used for UI totals in the prototype.
- The backend is free to recompute pricing server-side and treat `unitPrice` as informational.

```ts
import { createBooking } from "@/lib/api/bookings";

async function submitBooking() {
  const response = await createBooking({
    tourId: "tour01",
    date: "2025-01-15",
    tickets: [{ kind: "adult", quantity: 2, unitPrice: 25 }],
    addons: [
      // Example physical add-on
      { addonId: "hanbok-rental", quantity: 1, variant: "Standard", color: null },

      // Example scheduled add-on (date + optional time + adult/child split)
      {
        addonId: "sejong-backstage",
        quantity: 3,
        selectedDate: "2025-01-15",
        selectedTime: "14:00",
        adultQty: 2,
        childQty: 1,
      },
    ],
    contact: {
      fullName: "Demo User",
      email: "demo@example.com",
      phoneNumber: "+821012345678",
    },
  });

  console.log("Booking created", response);
}
```

The backend is free to change internal models as long as the
request/response shapes for these helpers remain compatible.

## Where the booking payload will come from (frontend)

Key files (read these first):

- Step 1 tickets/tour counts: `src/app/booking/step1/store.ts` + `src/app/booking/BookingStep1Bridge.tsx`
- Selected date: `src/app/booking/BookingCalendarBridge.tsx` (stores it on `window.__tbBookingState.selectedDate`)
- Add-ons cart state: `src/app/booking/cart/store.ts` + `src/app/booking/lib/cart.ts`
- Legacy compatibility surface: `ensureUpsellCartOnWindow()` exposes `window.UpsellCart.*`
- Step navigation and “Make payment” click: `src/app/booking/BookingBehaviors.tsx` (future API call goes here)

Everyday language: when the user clicks “Make payment”, we’ll gather:

1) `tourId` + adult/child counts from `bookingStep1Store`
2) the selected date from `window.__tbBookingState.selectedDate`
3) add-on line items from `bookingCartStore.getSnapshot().items`
4) contact details from the Step 3 form fields

…and then we’ll call `createBooking(payload)`.

