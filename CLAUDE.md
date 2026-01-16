# Coffee Personality Quiz - Project Lessons

## Project Overview
A Coffee Personality Quiz for Basecamp Coffee's loyalty program. Users answer 6 questions to discover their coffee personality and get personalized drink recommendations.

**Live URL:** https://quiz-project-ecru.vercel.app
**Admin Dashboard:** https://quiz-project-ecru.vercel.app/admin
**GitHub:** https://github.com/m0322701bv/Tutorial---Coffee-Quiz

---

## Tech Stack
- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Hosting:** Vercel
- **Version Control:** GitHub

---

## Lessons Learned

### 1. The Vibecoding Loop
The core workflow for building anything:
```
Plan → Build → Iterate → Save → Go Live
```
- **Plan:** Get clear on what you're building
- **Build:** Let AI create it
- **Iterate:** Refine until it's right
- **Save:** Back it up to GitHub
- **Go Live:** Deploy to Vercel

### 2. Environment Variables
- Store secrets in `.env.local` (never commit to Git)
- Firebase credentials need `NEXT_PUBLIC_` prefix for client-side access
- Vercel requires manually adding env vars in project settings
- After adding env vars to Vercel, you must redeploy

### 3. Firebase Gotchas
- **Firebase does NOT allow `undefined` values** - always filter them out before saving
- Use conditional object building:
  ```javascript
  const data = { required: value };
  if (optional) data.optional = optional;
  ```
- Firestore security rules must be configured (use test mode for development)
- Collections are created automatically when first document is added

### 4. Vercel Deployment
- Sign up with GitHub for automatic repo connection
- Use `npx vercel --prod --yes` to deploy (bypasses interactive prompts)
- Vercel auto-deploys when you push to GitHub
- View logs with `npx vercel logs [url]`

### 5. GitHub Workflow
- Initialize with `git init` (or let Next.js do it)
- Create repo on github.com/new
- Connect: `git remote add origin https://github.com/[user]/[repo].git`
- Push: `git push -u origin main`
- Future updates: `git add -A && git commit -m "message" && git push`

### 6. Next.js API Routes
- Create in `app/api/[route]/route.ts`
- Export functions named after HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextRequest` and `NextResponse` from `next/server`

### 7. Admin Dashboard Pattern
- Protect with simple password via cookie
- Store password in env var `ADMIN_PASSWORD`
- Use middleware to protect API routes
- Client-side auth check in layout component

### 8. Debugging Production Issues
- Check Vercel logs: `npx vercel logs [deployment-url]`
- Add console.log statements, redeploy, check logs
- Firebase errors often have descriptive messages
- Common issue: undefined values, permission denied

### 9. Firebase Collections Structure
```
quiz_results/
  - personality, scores, answers, timestamp, duration

analytics_events/
  - event, data, timestamp

quiz_config/
  - questions: { questions: [...] }
  - personalities: { personalities: {...} }
```

---

## Common Commands

```bash
# Development
npm run dev

# Deploy to production
npx vercel --prod --yes

# Push to GitHub
git add -A && git commit -m "message" && git push

# Check Vercel logs
npx vercel logs quiz-project-ecru.vercel.app
```

---

## File Structure
```
quiz-project/
├── app/
│   ├── page.tsx              # Main quiz component
│   ├── quiz-data.ts          # Questions & personalities data
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── lib/
│   │   ├── firebase.ts       # Firebase config & helpers
│   │   └── analytics.ts      # Analytics tracking
│   ├── api/
│   │   ├── quiz/
│   │   │   ├── submit/       # Save quiz results
│   │   │   └── config/       # Get quiz config
│   │   ├── analytics/
│   │   │   └── track/        # Track events
│   │   └── admin/
│   │       ├── auth/         # Admin login
│   │       ├── stats/        # Dashboard stats
│   │       ├── config/       # Edit quiz config
│   │       └── results/      # View all results
│   └── admin/
│       ├── layout.tsx        # Admin layout with nav
│       ├── page.tsx          # Dashboard
│       ├── questions/        # Edit questions
│       ├── personalities/    # Edit personalities
│       └── results/          # View results
├── middleware.ts             # Protect admin routes
├── .env.local               # Environment variables (not in Git)
└── package.json
```

---

## Future Improvements
- Add email collection for leads
- Custom domain (e.g., quiz.basecampcoffee.com)
- More detailed analytics (funnel analysis, drop-off points)
- A/B testing different questions
- Export results to CSV
- Stricter Firebase security rules for production
