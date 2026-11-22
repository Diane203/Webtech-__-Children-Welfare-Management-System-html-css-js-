# Hope Haven - Children Welfare Management System

A browser-based prototype for managing a children's welfare center. The project includes public information pages, a demo administrator/staff dashboard, and a sponsorship flow.

> **Prototype notice:** This project currently uses sample data and browser `localStorage`. It is not connected to a production database, authentication service, or payment provider. Do not enter real children's, staff, donor, or payment information.

## Features

- Public home, about, impact, sponsor, and contact pages.
- Demo login and account registration for administrator and staff roles.
- Dashboard sections for children, staff, donations, health, education, sponsors, reports, alerts, and user profiles.
- Child profiles with timelines, milestones, and case notes.
- Search/filtering and create/update/delete interactions for selected records.
- Sponsorship form with a simulated confirmation/receipt flow.
- Impact figures and report charts based on the data available in the browser.
- Responsive styling using Tailwind CSS utility classes and project-specific CSS.

## Technology

- HTML for the pages and forms.
- CSS in `style.css`, with Tailwind CSS loaded from its CDN.
- Plain JavaScript in `app.js` and `data.js`.
- Chart.js loaded from its CDN for charts.
- Browser `localStorage` for the demo database and current login state.

There is no package manager or build step. An internet connection is needed for the Tailwind and Chart.js CDN resources.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Public landing page and navigation to the other sections. |
| `about.html` | Organization information and mission content. |
| `impact.html` | Impact figures and progress displays, populated from demo data. |
| `sponsor.html` | Child selection, sponsor information, and simulated sponsorship confirmation. |
| `contact.html` | Contact information and contact form interface. |
| `login.html` | Demo login form and displayed test credentials. |
| `register.html` | Demo account registration form. |
| `dashboard.html` | Dashboard shell containing the sidebar, top navigation, and content area. |
| `app.js` | Login/registration logic, dashboard navigation, rendering, and record actions. |
| `data.js` | Seed data, local database initialization, persistence, and ID generation. |
| `style.css` | Shared custom styles, including animations and dashboard/modal styling. |

## How the application works

### Data and persistence

`data.js` defines `DEFAULT_DB`, with sample records for users, children, staff, donations, health, education, sponsors, milestones, alerts, case notes, and reports. When a page loads, the script reads `hopeHavenDB` from `localStorage`. If no saved data exists, it copies the defaults into browser storage. The shared `DB` object is then used by the pages; `saveDB()` writes its current state back to storage.

This is client-side persistence only. Data is limited to the browser profile and site origin where it was entered. Clearing browser storage removes it, and it is not synchronized between users or devices.

### Login and dashboard

`login.html` and `register.html` load `data.js` and `app.js`. The demo login checks the entered email, password, and selected role against the users in the browser database. On success, the current user is stored as `hopeHavenCurrentUser` and the browser navigates to `dashboard.html`.

The dashboard page checks for that saved user and redirects to login if no session is present. `renderDashboard()` in `app.js` builds the common navigation and renders the selected dashboard section. Most dashboard records are rendered from the shared `DB` object, and actions call `saveDB()` when they make changes.

### Public pages and sponsorship

The public pages are separate HTML documents linked through their navigation. `impact.html` reads demo records to show totals. `sponsor.html` uses the same browser database to list children and record the demo sponsorship flow. Its success screen is only a simulated confirmation; it does not charge a card or transfer money.

## Run locally

1. Install and start [XAMPP](https://www.apachefriends.org/), including Apache.
2. Place the project folder in XAMPP's `htdocs` directory (for example, `C:\xampp\htdocs\hopehaven`).
3. Open `http://localhost/hopehaven/` in a browser.
4. Open **Login** and use one of the demo accounts below to try the dashboard.

The project is static and can also be served by another local HTTP server. Using a local server is recommended instead of opening the HTML files directly.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@hopehaven.rw` | `admin123` |
| Staff | `diane@hopehaven.rw` | `staff123` |

These credentials are stored in the front-end seed data and are for demonstration only. They are not secure authentication credentials.

## Reset demo data

The application stores data in the browser's `localStorage`. To restore the original seed records, open the browser developer tools on the local site, run the following in the Console, and reload:

```js
localStorage.removeItem("hopeHavenDB");
localStorage.removeItem("hopeHavenCurrentUser");
location.reload();
```

## Limitations and production considerations

- Sample records and displayed demo credentials are publicly visible in the client-side JavaScript.
- `localStorage` is not a shared or protected database; role checks in front-end code are not an authorization boundary.
- Registration stores passwords in browser storage without server-side authentication or password hashing.
- Sponsorship/payment is simulated; there is no payment gateway, transaction verification, or financial ledger.
- Forms and report values should be treated as prototype behavior, not as verified operational records.
- A production deployment would need a secure backend, database, server-side authorization, validated APIs, protected handling of sensitive child data, and a real payment integration where required.

## License

No license file is included. Contact the project owner before reusing or redistributing the code.
