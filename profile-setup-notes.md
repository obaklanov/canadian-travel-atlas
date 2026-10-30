# Travel Atlas account setup

## Architecture

GitHub Pages serves the website. Supabase Authentication handles email/password accounts, confirmation emails, sessions and password recovery. The private `traveller_profiles` table stores a nickname and visited country/territory codes. There are no passwords or email addresses in that table, and no publicly readable profile records.

The public configuration is in `dist/profile-config.js`. Its publishable key is intended for browser use. Never add database passwords, Supabase secret keys or service-role credentials to this repository.

## Project configuration

Supabase project: `hmecyiinaotnjaxgzkow`.

1. Run `supabase-profile-setup.sql` in the project's SQL Editor.
2. Authentication → URL Configuration:
   - Site URL: `https://obaklanov.github.io/canadian-travel-atlas/profile.html`
   - Allowed redirects: the same URL and `https://obaklanov.github.io/canadian-travel-atlas/profile.html?reset=1`.
3. Keep email/password sign-in and email confirmation enabled. The website enforces at least ten characters for new passwords; Supabase's own password rules also apply.
4. For initial testing, use the email associated with a project-team member. The default Supabase email sender restricts recipients and has low sending limits. Configure custom SMTP before inviting other users; do not bypass confirmation to work around email delivery limits.

## First real-user test

Open Profile → Create account. Enter a nickname, email and password. Confirm the email, then sign in. Select a few countries, save, sign out and sign back in. Confirm the selections and map return. Test adding/removing a country and saving again. A duplicate nickname should produce a readable error. Afterwards, test Forgot your password with the same email, taking account of the provider's email limits.

The account holder enters their own password and handles email links; passwords and confirmation/reset links should not be pasted into chat.

## Data rules

- Nicknames: 3–24 ASCII letters, numbers or underscores; case-insensitively unique when the profile is saved. A signup nickname is not reserved until that first profile save.
- Email is the login identifier; nickname is a profile name, not an alternative login identifier in this version.
- Country choices update a draft map immediately. Save writes to Supabase. The page uses no separate local profile database.
- The catalogue includes countries and territories, so its counter is labelled “places visited.” Smaller places may have no visible polygon in the coarse map.
- Visiting a country does not automatically award its landmark treasures.
- Planned/previous trip records, photo uploads, public profiles and community sharing are not implemented yet.
- Row-level security restricts SELECT, INSERT and UPDATE to `auth.uid() = id`. Anonymous access is revoked. Nickname and country lists are validated on the database as well as in the interface.

## Libraries and data

Supabase JS 2.118.0 is pinned and served locally: `dist/vendor/supabase-2.118.0.js` (MIT; license alongside it).

Country catalogue derived from world-countries 5.1.0, excluding Antarctica: https://github.com/mledoze/countries . The derived catalogue remains available as `dist/country-catalog.json`, under the ODbL in `dist/country-catalog-LICENSE.txt`. Original map geometry is the existing `world-countries.json`. See `dist/country-data-sources.txt`.

## Validation limits

Isolated DOM tests cover form state, map selection, save payloads, reload/sign-in persistence, invalid nicknames and clearing private screen data at sign-out using a simulated backend. A real anonymous API request is denied access to the profile table. A real authenticated email-confirmation/save/recovery round trip must be completed by the account holder; this has not been replaced with a fake production account.
