https://gymflow-web-gamma.vercel.app/

# GymFlow Web

Frontend for **GymFlow**, a gym management platform — booking, subscriptions, and check-ins for a multi-location gym chain.

**Live demo:** [add your Vercel URL here]
**Backend repo:** [gymflow-api](https://github.com/Moayad-Mac/gymflow-api)

Demo login (password: `password`):
- Staff: `nadine.staff@gymflow.test`
- Trainer: `karim.trainer@gymflow.test`
- Member: `tarek@gymflow.test`

## What it does

A role-based interface on top of the GymFlow API:

- **Members** browse classes, book/cancel sessions, and check their subscription status.
- **Trainers** see their own classes and who's booked into each one.
- **Staff** manage classes and subscriptions, and check members in at the door.

## Tech stack

- **Next.js** (App Router, client-rendered)
- **Tailwind CSS**
- **Laravel Sanctum** token auth against the [GymFlow API](https://github.com/Moayad-Mac/gymflow-api)
- Deployed on **Vercel**

## Architecture notes

- **Auth is fully client-side.** The API token is stored in `localStorage` and attached to every request via a shared `useApiFetch` hook, which also handles centralized error responses and redirects to `/login` if the token is rejected (as opposed to a login attempt simply failing, which is handled separately).
- **Role-based route protection is handled per section.** Routes are grouped under `/member`, `/trainer`, and `/staff`, each with a layout that checks the logged-in user's role and redirects if it doesn't match — so individual pages don't need to repeat that check.
- **Responsive by default.** Built mobile-first with Tailwind's default breakpoints, since a booking app is realistically going to be opened on a phone as often as a laptop.

## Setup

```bash
git clone https://github.com/Moayad-Mac/gymflow-web.git
cd gymflow-web
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

(point this at your running [gymflow-api](https://github.com/Moayad-Mac/gymflow-api) instance, local or deployed)

```bash
npm run dev
```

## Pages

| Route | Role | Purpose |
|---|---|---|
| `/` | Public | Landing page, gym/class listing |
| `/login`, `/register` | Public | Auth |
| `/member/classes` | Member | Browse and book classes |
| `/member/bookings` | Member | View/cancel own bookings |
| `/member/subscription` | Member | View subscription status |
| `/trainer/classes` | Trainer | View own classes and rosters |
| `/staff/classes` | Staff | Create/delete classes |
| `/staff/subscriptions` | Staff | Create/cancel member subscriptions |
| `/staff/check-in` | Staff | Check in a booking by ID |
