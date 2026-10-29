# Flight pricing rules

Both Flights and routing and Budget call getFlightRoutes: CAD round-trip economy, selected departure city, cheapest qualifying arrival airport. Departure is three calendar months from the current date (clamped at month end), returning Days minus 1 later. Default duration: 30 days.

Real offers must have at most two connections per direction, every connection at most 240 minutes, no self-transfer or airport changes, two valid itineraries, exact requested dates, a positive total CAD price, source URL and a quote timestamp no older than 24 hours. The lowest qualifying offer wins, among supplied offers (not a claim to search the entire market). Flight Search links include the dates and desired restrictions; the external search engine may require users to apply filters manually.

## Current limit
No airfare provider or API credentials are connected. verifiedFlightOffers is deliberately empty. Existing figures remain clearly labelled samples, do not claim to satisfy live availability, date or connection requirements, and are shared identically across routing and budget. Connecting a provider and refresh job is still required for actual lowest-fare calculation. No credentials belong in public browser files.

Possible provider reference: https://developer.travelport.com/docs/flights/guides/flights-search-guide

## Public snapshot shape
Each verifiedFlightOffers entry: origin, country (site country key), destination (IATA), departureDate and returnDate (YYYY-MM-DD), currency CAD, cabin economy, totalCAD, selfTransfer false, sourceUrl (https), checkedAt (ISO instant), legs (two objects). Each leg contains segments: origin, destination, departure and arrival (ISO timestamps including offsets).

Nights follow Days minus 1 until edited. Use Days − 1 restores automatic mode. Flight allowance is editable; Use route estimate restores shared pricing. Budget choices persist across section changes for the current page visit.
