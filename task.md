# MediCare Connect — Client Application

You are a senior frontend engineer, UI/UX engineer, and software architect.

Build a complete, production-quality frontend for a healthcare management platform named **MediCare Connect**.

This is a technical assessment project. Code quality, architecture, security, responsive design, user experience, maintainability, and proper implementation are important.

This repository is **CLIENT SIDE ONLY**.

The backend exists in a completely separate Express.js repository.

Do not create backend APIs inside this Next.js application.

---

# 1. Project Overview

MediCare Connect is a healthcare management platform connecting:

* Patients
* Doctors
* Administrators

Patients can:

* Create accounts
* Search doctors
* View doctor profiles
* Check availability
* Book appointments
* Pay consultation fees
* Manage appointments
* View payment history
* Review doctors
* Save favorite doctors
* View prescriptions

Doctors can:

* Create professional profiles
* Manage schedules
* View appointment requests
* Accept/reject appointments
* Mark consultations complete
* Create/update prescriptions
* Manage professional details

Admins can:

* Manage users
* Suspend/reactivate users
* Verify doctors
* Reject doctor verification
* Revoke doctor verification
* Monitor appointments
* View payments
* View analytics

---

# 2. Mandatory Frontend Technology

Use:

* Next.js latest stable version
* App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Better Auth client
* TanStack Query
* React Hook Form
* Zod
* Framer Motion
* Recharts
* Stripe.js
* next-themes
* Lucide React
* Sonner

Use strict TypeScript.

Do not use JavaScript files unless required by tooling.

---

# 3. Technologies That Must NOT Be Used

Do NOT use:

* Firebase
* Firebase Authentication
* Supabase
* Clerk
* Auth0
* NextAuth/Auth.js
* PostgreSQL
* MySQL
* SQLite
* Prisma
* fake local authentication
* localStorage as the primary authentication system

Authentication must use **Better Auth**.

The backend uses **MongoDB as its only persistent database**.

---

# 4. Client and Server Separation

The repositories are completely separate.

Client:

medicare-connect-client

Server:

medicare-connect-server

The client communicates with the server through HTTP APIs.

Use:

NEXT_PUBLIC_API_URL

for the backend URL.

Never hardcode:

http://localhost:5000

throughout components.

Centralize it.

---

# 5. Recommended Project Structure

Use a clean feature-based architecture.

Example:

src/
├── app/
│   ├── (public)/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── doctors/
│   ├── about/
│   ├── contact/
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── doctors/
│   ├── appointments/
│   ├── schedules/
│   ├── reviews/
│   ├── payments/
│   ├── prescriptions/
│   ├── favorites/
│   ├── users/
│   └── analytics/
│
├── hooks/
├── lib/
├── providers/
├── services/
├── schemas/
├── constants/
├── types/
└── utils/

Do not force every feature into exactly this structure if a simpler structure is clearer.

Keep architecture consistent.

---

# 6. Clean Code Requirements

Clean code is mandatory.

Follow:

* Strict TypeScript
* Avoid `any`
* Small focused components
* Small focused functions
* Single responsibility
* Descriptive names
* Reusable hooks
* Reusable UI components
* Centralized API logic
* Centralized validation
* Centralized route constants where useful
* Centralized status constants
* No duplicated business logic
* No giant page components
* No unnecessary abstraction
* No deeply nested conditionals where avoidable
* No unexplained magic strings
* No unused code
* No debug console logs in production

Prefer readable code over clever code.

Do not create abstraction simply for the sake of abstraction.

---

# 7. Meaningful Comments

Write meaningful comments where they genuinely help future developers.

Comments should mainly explain:

* WHY a security decision exists
* WHY a certain API workflow is needed
* WHY a business rule exists
* non-obvious authentication behavior
* Stripe behavior
* unusual date/time handling
* complex state transitions
* role-based navigation decisions

Good:

// Consultation fees displayed here are informational only.
// The backend loads the authoritative fee before creating a Stripe payment.

Good:

// This guard improves dashboard UX only.
// Backend authorization still protects the actual API.

Good:

// Preserve the selected filters in the URL so users can refresh or
// share the doctor search without losing their current search state.

Bad:

// Set loading true
setLoading(true)

Bad:

// Loop doctors
doctors.map(...)

Bad:

// Return response

Do not comment obvious code.

Readable code should explain WHAT happens.

Comments should explain WHY.

---

# 8. Environment Variables

Environment security is mandatory.

Create:

.env

and:

.env.sample

The real `.env` must NEVER be committed.

Add `.env` to `.gitignore`.

The `.env.sample` file MUST be committed.

Client `.env`:

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_me

Client `.env.sample`:

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

Do NOT put any server secret into the client.

Never place these in the client:

* MongoDB URI
* Better Auth secret
* Google client secret
* Stripe secret key
* Stripe webhook secret
* Resend API key
* Admin password
* Cron secret

Remember:

Every `NEXT_PUBLIC_*` variable is public and can be exposed to the browser.

---

# 9. Better Auth Client Integration

Use Better Auth for authentication.

Create a centralized Better Auth client.

Example location:

src/lib/auth-client.ts

The Better Auth server runs inside the separate Express backend.

Support:

* Email/password registration
* Email/password login
* Google login
* Logout
* Persistent authentication
* Current session
* Current user
* Auth loading state
* Current user role

Use Better Auth's supported client APIs according to the installed package version.

Do not invent APIs that do not exist.

If package APIs differ from older examples, follow the installed Better Auth package typings/documentation.

---

# 10. Authentication Roles

Roles:

* patient
* doctor
* admin

Registration should allow:

* Patient
* Doctor

Never show Admin as a public registration option.

The browser must NEVER be considered the trusted authority for roles.

The backend controls the final role.

---

# 11. JWT Requirement

The project assignment requires JWT verification.

The server uses Better Auth with JWT/JWKS support.

The client should integrate with the server's chosen authenticated API mechanism.

If REST APIs require:

Authorization: Bearer <token>

centralize this behavior inside the API client.

Do not manually create JWTs.

Do not decode tokens and treat the result as trusted authentication.

Do not scatter token code across components.

---

# 12. API Client

Create a centralized API layer.

Example:

src/lib/api-client.ts

or:

src/services/api-client.ts

Support:

* backend base URL
* authentication
* credentials/cookies if required
* Bearer token if the backend API requires it
* request query parameters
* typed responses
* typed errors
* standardized response handling
* AbortSignal/cancellation where useful

Do not put raw fetch logic inside every page.

Pages/components should typically use:

component
↓
custom hook
↓
service/API client
↓
backend

Use TanStack Query for server state.

---

# 13. Design System

Build an original modern healthcare SaaS interface.

Do NOT copy:

* Apollo 24/7
* Novant Health
* US News
* previous assignment layouts
* common Programming Hero templates
* generic dashboard templates

They may only be used as conceptual inspiration.

---

# 14. Modern Design Direction

The design should feel:

* trustworthy
* calm
* modern
* premium
* professional
* accessible
* healthcare-focused
* spacious

Recommended primary palette:

Deep Teal:
#0F766E

Healthcare Blue:
#0284C7

Dashboard Indigo:
#4F46E5

Success:
Emerald

Warning:
Amber

Danger:
Rose/Red

Light Background:
#F8FAFC

Dark Background:
deep Slate

Use CSS variables / design tokens.

Do not repeatedly hardcode colors across components.

---

# 15. Typography

Use:

* Inter
  or
* Manrope

Create consistent:

* page titles
* section headings
* card headings
* labels
* helper text
* button typography

Maintain strong visual hierarchy.

---

# 16. Component Style

Use:

* large rounded cards
* subtle shadows
* subtle borders
* intentional whitespace
* polished badges
* soft gradients
* modern iconography
* subtle hover effects
* tasteful animations
* accessible focus states

Avoid excessive glassmorphism.

Avoid overusing gradients.

Avoid excessive animations.

---

# 17. Responsive Requirements

Support:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop

Mobile should not look like a compressed desktop layout.

Dashboard:

Desktop:
Full sidebar

Laptop/tablet:
Collapsible sidebar

Mobile:
Drawer navigation

Tables should:

* horizontally scroll when appropriate
  or
* convert into cards where appropriate

All forms must work on mobile.

---

# 18. Navbar

Create a responsive sticky navbar.

Include:

* MediCare Connect logo
* Home
* Find Doctors
* About Us
* Contact Us
* Dashboard
* Login/Register
* User Profile Dropdown

When unauthenticated:

* Login
* Register

When authenticated:

Profile dropdown containing:

* Avatar
* Name
* Role
* Profile
* Dashboard
* Theme
* Logout

Add subtle shadow/background change after scrolling.

---

# 19. Footer

Include:

* Logo
* Platform description
* Quick Links
* Patient links
* Contact information
* Emergency hotline
* Social media links
* Copyright

Do not create a plain basic footer.

Make it visually consistent with the whole website.

---

# 20. Public Pages

Create:

* Home
* Find Doctors
* Doctor Details
* About Us
* Contact Us
* Login
* Register
* 404

Use dynamic page titles.

---

# 21. Home Page — Hero

Create a unique healthcare hero.

Include:

* Main headline
* Supporting description
* Find a Doctor CTA
* Book Appointment CTA
* Healthcare visual/illustration
* Trust indicators

Avoid a generic stock photo covering the entire screen.

Suggested messaging concept:

"Healthcare made simpler, faster, and connected."

Do not copy this sentence if you can create something more original.

---

# 22. Featured Doctors

Fetch dynamically from the backend.

Show approximately 6 verified doctors.

Doctor card:

* Profile image
* Name
* Specialization
* Experience
* Consultation fee
* Average rating
* Verified badge
* View Profile button

Cards should have equal visual height.

---

# 23. Medical Specializations

Static section.

Include:

* Cardiology
* Neurology
* Orthopedics
* Pediatrics
* Dermatology
* Psychiatry
* Gynecology
* General Medicine

Use healthcare-related icons.

---

# 24. Platform Statistics

Fetch dynamically.

Display:

* Total Doctors
* Total Patients
* Total Appointments
* Total Reviews

Animate numbers when they enter the viewport.

Do not invent statistics.

---

# 25. Patient Success Stories

Fetch dynamically from the Reviews API.

Display:

* Patient name
* Avatar if available
* Rating
* Review text
* Doctor name

Create an elegant testimonials layout.

---

# 26. Why Choose MediCare Connect

Static section.

Examples:

* Verified doctors
* Simple appointment booking
* Secure payments
* Digital prescriptions
* Transparent reviews
* Easy healthcare access

Use meaningful icons.

---

# 27. Framer Motion

Use Framer Motion in at least two significant sections.

For example:

* Hero
* Featured Doctors
* Statistics
* Testimonials

Animations should be subtle.

Respect reduced-motion preferences when practical.

Do not animate every element.

---

# 28. Find Doctors Page

Implement advanced doctor search.

Search by:

* Doctor name
* Specialization

Filters may include:

* Specialization
* Hospital
* Availability
* Fee range

Sorting:

* Fee low to high
* Fee high to low
* Experience
* Highest rating

Pagination is mandatory.

Pagination must come from the backend.

Do NOT download all doctors and paginate in the browser.

---

# 29. URL Search State

Where practical, store search/filter state in URL query parameters.

Example:

/doctors?search=rahman&specialization=Cardiology&page=2&sort=rating_desc

This allows:

* refresh without losing state
* bookmarking
* sharing search URLs

---

# 30. Loading Doctor Results

Use skeleton loading.

Show meaningful empty states.

Examples:

"No doctors matched your current filters."

Provide a Reset Filters action.

---

# 31. Optional Feature — Card/Table View

Implement this optional feature completely.

Find Doctors should support:

* Card layout
* Table/List layout

Add a visible layout toggle.

Persist user preference locally.

Do not store sensitive data in localStorage.

Layout preference is safe to persist.

---

# 32. Doctor Details Page

Show:

* Doctor image
* Name
* Verified badge
* Specialization
* Qualifications
* Experience
* Hospital
* Consultation fee
* Biography
* Average rating
* Review count
* Available days
* Available time slots
* Reviews

Include:

Book Appointment CTA

---

# 33. Doctor Availability Calendar

Implement the optional availability calendar.

Patient should be able to:

1. Select date
2. View available slots
3. Select slot
4. Continue booking

Visually distinguish:

* available
* unavailable
* selected
* booked

The backend is always the source of truth.

Never assume a slot is still available simply because it was displayed earlier.

---

# 34. Appointment Booking

Create a professional multi-step booking flow.

Recommended steps:

1. Doctor
2. Date
3. Time
4. Symptoms/Reason
5. Review Appointment
6. Payment
7. Confirmation

Show a booking summary.

Prevent double submission.

---

# 35. Consultation Fee Security

Frontend consultation fee is display-only.

Never consider:

appointment.amount

from browser state authoritative.

The backend must retrieve the doctor's current fee before creating payment.

---

# 36. Stripe Payment

Use Stripe.js.

Client responsibilities:

* Request payment setup from backend
* Render payment UI
* Handle processing state
* Handle error state
* Handle success/pending result
* Display transaction feedback

Never expose:

STRIPE_SECRET_KEY

Only use:

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

The frontend must NOT mark a payment as paid.

The backend Stripe webhook is the authoritative payment confirmation.

---

# 37. Dashboard Layout

Create a full-width professional dashboard.

Include:

* Responsive sidebar
* Mobile drawer
* Top bar
* Breadcrumbs where useful
* Profile section
* Role-based menu
* Page heading
* Loading states

Make dashboards visually distinct from public pages while remaining part of the same design system.

---

# 38. Role-Based Dashboard Navigation

Patient should see patient navigation.

Doctor should see doctor navigation.

Admin should see admin navigation.

Do not display unauthorized role menus.

However:

Frontend authorization only improves UX.

The backend must enforce real authorization.

Add a meaningful comment explaining this where relevant.

---

# 39. Patient Dashboard Overview

Show:

* Upcoming appointments
* Appointment history count
* Total payments
* Favorite doctors
* Next appointment
* Recent activity

Use modern metric cards.

---

# 40. Patient Profile

Allow profile management.

Fields may include:

* Name
* Photo
* Phone
* Gender

Email changes should follow Better Auth's supported security flow if implemented.

Do not invent unsafe email-change logic.

---

# 41. My Appointments

Patient can:

* View appointment
* Reschedule appointment
* Cancel appointment

Show:

* Doctor
* Specialization
* Date
* Time
* Status
* Payment status

Use confirmation dialog before cancellation.

Disable actions that are invalid for the current appointment state.

Backend remains responsible for validating transitions.

---

# 42. Payment History

Show:

* Doctor
* Appointment
* Amount
* Transaction ID
* Date
* Payment status

Provide clear payment status badges.

---

# 43. Patient Reviews

CRUD:

* Add Review
* Update Review
* Delete Review

Review form:

* Rating 1–5
* Review text

Do not allow frontend logic to override backend review eligibility.

---

# 44. Favorite Doctors

Implement:

* Add favorite
* Remove favorite
* List favorites

Show favorite state on doctor cards/details.

---

# 45. Doctor Dashboard Overview

Show:

* Total unique patients
* Today's appointments
* Pending appointment requests
* Completed appointments
* Reviews received
* Average rating

---

# 46. Doctor Schedule Management

CRUD:

* Add schedule
* Update schedule
* Remove schedule

Use an intuitive schedule form/calendar.

Validate obvious invalid times on the client.

Backend remains final authority.

---

# 47. Appointment Requests

Doctor can:

* View appointment
* Accept
* Reject
* Mark Completed

After:

Mark Completed

navigate to prescription management for that appointment.

Use confirmation dialogs where appropriate.

---

# 48. Prescription Management

Create and update prescriptions.

Fields:

* Diagnosis
* Medications
* Notes

Medication rows:

* Medicine name
* Dosage
* Frequency
* Duration
* Instructions

Allow dynamic medication rows.

Keep form usable on mobile.

---

# 49. Doctor Profile Management

Allow doctor to update:

* Qualifications
* Experience
* Consultation fee
* Hospital
* Biography
* Available information

Display verification status clearly:

* Pending
* Verified
* Rejected

---

# 50. Admin Dashboard Overview

Create administrative metric cards.

Display:

* Total patients
* Total doctors
* Total appointments

Add appropriate analytics summary.

---

# 51. Manage Users

Admin can:

* View users
* Search users
* Filter users
* Suspend users
* Reactivate users
* Delete users when backend allows it

Use pagination.

Show role/status badges.

---

# 52. Manage Doctors

Admin can:

* View pending doctors
* View verified doctors
* View rejected doctors
* Verify doctor
* Reject doctor
* Revoke verification

Use confirmation dialogs.

Display professional doctor information before verification.

---

# 53. Manage Appointments

Admin can:

* View all appointments
* Search
* Filter
* Inspect appointment status
* Inspect payment status

Use server pagination.

---

# 54. Payment Management

Admin can view:

* Transaction ID
* Patient
* Doctor
* Appointment
* Amount
* Payment status
* Payment date

---

# 55. Analytics

Use Recharts.

Charts may include:

* Appointments over time
* Appointments by status
* Revenue/payment trend
* Doctor rating performance
* Top-rated doctors

Charts must be responsive.

Do not calculate heavy analytics in frontend if backend already provides aggregated data.

---

# 56. Optional Feature — Theme

Implement:

* Light
* Dark
* System

Use next-themes.

Persist preference.

All components must remain readable in dark mode.

Avoid simply inverting colors.

Design dark mode intentionally.

---

# 57. Optional Feature — Email Appointment Reminders

Backend handles actual reminder sending.

Frontend may show:

* Appointment reminder status
* Upcoming appointment indicators

Do not send reminder emails directly from browser code.

---

# 58. Loading Experience

Create meaningful loading UI for:

* Route transitions
* Auth state
* Doctor list
* Doctor details
* Dashboard
* Tables
* Analytics
* Payments
* Forms

Use skeleton components.

Avoid full-page blank screens.

---

# 59. Error Handling

Handle:

* Network errors
* Server validation errors
* Authentication errors
* Authorization errors
* Payment errors
* Missing data
* Empty states
* Appointment conflicts

Use user-friendly notifications.

Do not show raw server stack traces.

---

# 60. Custom 404

Create a unique healthcare-themed 404 page.

Include:

* Illustration
* Error heading
* Helpful message
* Back Home
* Find Doctors

Do not use the default framework 404.

---

# 61. Forms

Use:

React Hook Form + Zod

Requirements:

* Accessible labels
* Clear validation
* Loading state
* Disabled submission during request
* Server error display
* Useful success feedback

Registration password:

Minimum:

* 6 characters
* 1 number
* 1 special character

If Better Auth backend configuration uses stricter requirements, synchronize frontend validation with backend policy.

---

# 62. Toast Notifications

Use Sonner consistently.

Examples:

* Login successful
* Registration successful
* Appointment booked
* Appointment cancelled
* Schedule updated
* Review added
* Payment failed
* Profile updated

Avoid excessive notifications for trivial events.

---

# 63. Accessibility

Use:

* Semantic HTML
* Proper labels
* Keyboard navigation
* Visible focus state
* Accessible dialogs
* Accessible dropdowns
* Alt text
* Sufficient color contrast
* `aria-*` only where appropriate

---

# 64. Page Titles

Implement meaningful dynamic titles.

Examples:

MediCare Connect | Find Doctors

Dr. John Doe | MediCare Connect

My Appointments | MediCare Connect

Admin Analytics | MediCare Connect

---

# 65. Better Auth Persistence

Authentication must survive:

* Browser refresh
* Direct private-route navigation

Do not create custom insecure localStorage session persistence.

Use Better Auth's supported session behavior.

---

# 66. Cross-Origin Authentication

Because frontend and backend are separate applications:

Configure requests correctly for the Better Auth deployment architecture.

Where cookie authentication is used:

* use credentials appropriately
* respect backend CORS policy
* use secure cookie configuration in production

Do not solve CORS problems by using unrestricted insecure production settings.

---

# 67. README

Create a professional README.

Include:

# MediCare Connect

## Overview

## Features

## User Roles

## Technologies

## Architecture

## Folder Structure

## Better Auth Authentication

Explain:

* email/password
* Google OAuth
* persistent sessions

## JWT Architecture

Explain how the client communicates with protected APIs.

## Role-Based Access

Explain:

Frontend guards = UX

Backend = actual security

## Stripe Payment Flow

## Doctor Search

## Sorting

## Pagination

## Optional Features

Mention all four:

1. Dark/Light theme
2. Availability calendar
3. Email reminders
4. Table/Card view

## Installation

## Environment Variables

## Local Development

## Production Build

## Screenshots

## Live Site

Placeholder

## Server Repository

Placeholder

## Admin Credentials

Placeholder

Do not place real passwords or secrets in README.

---

# 68. Git Commit Requirement

The assignment requires at least 20 meaningful client-side commits.

Target:

22–25 meaningful client commits.

Do NOT:

* Build the entire project and fake commits afterward
* Create meaningless commits
* Make empty commits simply to increase count

Create a commit after each real logical milestone.

Recommended client commit plan:

1.

chore: initialize Next.js project and core dependencies

2.

chore: configure Tailwind theme and design tokens

3.

feat: build responsive navbar and footer

4.

feat: configure Better Auth client integration

5.

feat: implement email and Google authentication

6.

feat: add protected dashboard navigation

7.

feat: build healthcare home hero and specializations

8.

feat: add featured doctors and platform statistics

9.

feat: implement patient testimonials section

10.

feat: build doctor search and filtering

11.

feat: add doctor sorting and server pagination

12.

feat: build doctor details page

13.

feat: add doctor availability calendar

14.

feat: implement appointment booking flow

15.

feat: integrate Stripe payment interface

16.

feat: build patient dashboard

17.

feat: add appointment and payment management

18.

feat: implement reviews and favorite doctors

19.

feat: build doctor dashboard and schedule management

20.

feat: add prescription management workflow

21.

feat: build admin management dashboard

22.

feat: add Recharts analytics dashboard

23.

feat: implement theme and doctor layout switching

24.

fix: improve mobile responsiveness and loading states

25.

docs: add client architecture and setup documentation

Use these only when corresponding work is actually completed.

---

# 69. Bad Commit Messages

Never use:

update

done

final

changes

code update

fixed

last version

work

new code

---

# 70. Final Client Verification

Before considering the frontend complete:

* Next.js production build passes
* TypeScript passes
* lint passes
* no significant console errors
* no Firebase exists
* Better Auth works
* email/password works
* Google login works
* session survives reload
* patient dashboard works
* doctor dashboard works
* admin dashboard works
* unauthorized navigation is handled
* doctor search works
* filtering works
* sorting works
* pagination works
* doctor details work
* availability calendar works
* appointment flow works
* Stripe UI works
* review CRUD works
* favorites work
* prescriptions work
* analytics works
* theme works
* table/card toggle works
* responsive navigation works
* responsive dashboard works
* mobile forms work
* loading states exist
* empty states exist
* custom 404 exists
* dynamic titles work
* `.env` is ignored
* `.env.sample` exists
* no backend secrets exist in client code
* README is complete
* code remains clean and maintainable
* meaningful comments explain WHY rather than obvious WHAT

Do not weaken code quality merely to finish quickly.

When implementing features, work incrementally and keep each change suitable for a meaningful Git commit.
