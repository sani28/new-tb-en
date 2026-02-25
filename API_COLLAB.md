
## Environment

The frontend reads the API base URL from an environment variable:

- `NEXT_PUBLIC_API_BASE_URL` (see `.env.example` in `apps/web/`)

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

```ts
import { createBooking } from "@/lib/api/bookings";

async function submitBooking() {
  const response = await createBooking({
    tourId: "tour01",
    date: "2025-01-15",
    tickets: [{ kind: "adult", quantity: 2, unitPrice: 25 }],
    addons: [],
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

