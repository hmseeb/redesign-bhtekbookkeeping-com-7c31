# BH Tek Bookkeeping — website

Static website for BH Tek Bookkeeping LLC (Cypress, TX) — bookkeeping services for
small businesses in Houston, Cypress and Harris County.

Vanilla HTML, CSS and JavaScript. No build step: `index.html` is the entry point and
every page is plain HTML served from its own directory.

## Structure

```
index.html                     Home
about/                         About + owner bio
services/                      Services overview
monthly-bookkeeping/           Service: monthly bookkeeping
month-end-close/               Service: month-end close
quickbooks-cleanup/            Service: QuickBooks cleanup & catch-up
payroll-processing/            Service: payroll processing
efficiency-consulting/         Service: efficiency consulting
tax-ready/                     Clean books, all year long
tax-ready-checklist/           Free tax-ready checklist (lead form)
contact/                       Contact + enquiry form
privacy-policy/                Privacy Policy
terms-of-service/              Terms of Service
assets/css/site.css            Design system (single stylesheet)
assets/js/site.js              Nav, form handling, subtle reveals
images/source/                 Photography
favicon.svg                    Favicon
```

## Notes

- Primary action site-wide: **Book a Free Consultation** (Calendly). The phone number is a
  `tel:` link in the header, and a sticky call/book bar appears on small screens.
- All forms POST to the LeadrVision endpoint, include `_form`, `_page` and a `_gotcha`
  honeypot, and work without JavaScript. With JavaScript they submit via `fetch()` to the
  same URL and confirm inline; a plain submission returns with `?submitted=1`.
- `/review` is provided by the hosting platform; it is linked from the footer, the
  contact section and the mobile menu, but no page is built for it here.
- Accessibility: one `<h1>` per page, semantic landmarks, visible focus states, AA
  contrast, 44px minimum tap targets, and `prefers-reduced-motion` support.
