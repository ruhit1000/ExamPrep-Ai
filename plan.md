# ExamPrep AI - Full Stack Project Execution Plan

## 📌 Project Architecture
- **Structure:** Monorepo (Single root folder containing `/client` and `/server`).
- **Frontend:** Next.js, JavaScript, Tailwind CSS, TanStack Query, Recharts, Better Auth (Client-side).
- **Backend:** Node.js, Express, JavaScript, Native MongoDB (No Mongoose), Google Gen AI SDK.

## 🎨 Global Design Rules
- **Colors:** Deep Navy (`#0F172A`), Vibrant Indigo (`#6366F1`), Vivid Emerald (`#10B981`)[cite: 6].
- **Layout:** Uniform borders, `rounded-xl` radius, fully responsive (Mobile, Tablet, Desktop)[cite: 6]. No placeholder content allowed.

---

## 📦 Execution Strategy

### Phase 1: Server Setup (Native MongoDB & JS)
**Goal:** Initialize backend using your centralized `index.js` pattern.
1. Create `/server/index.js` with Express, CORS, and `dotenv`.
2. Set up Native MongoDB `MongoClient` directly in `index.js` to connect to `exam-prep-db`. Define collections: `usersCollection`, `studyModulesCollection`.
3. Build custom authentication middlewares (`verifyToken`, `verifyUser`) in `index.js` to decode Better Auth headers.
4. Implement standard CRUD endpoints for modules (GET, POST, DELETE).

### Phase 2: Agentic AI Integration (Gemini)
**Goal:** Implement the two mandatory Agentic AI features using `@google/genai`[cite: 6].
1. **Feature 1 (Auto-Classification):** Create `/api/ai/classify`. Gemini parses syllabus text and returns a structured JSON object with difficulty, priority, and tags[cite: 6].
2. **Feature 2 (Stateful Memory Recalibration):** Create `/api/ai/recalibrate`. Gemini acts as a smart planner, analyzing completed tasks in MongoDB and dynamically restructuring uncompleted future tasks[cite: 6].

### Phase 3: Client Core & Authentication
**Goal:** Scaffold Next.js and implement your custom fetch/session utilities following Hireloop structure.
1. Configure Tailwind CSS with the exact 3-color palette[cite: 6].
2. Setup Better Auth in `/client/src/lib/auth.js` (Server) and `/client/src/lib/auth-client.js` (Client).
3. Build your core utilities[cite: 6]:
   - `/client/src/lib/core/session.js` (`getUserSession`, `getUserToken` using `auth.js`).
   - `/client/src/lib/core/server.js` (`authHeader`, `serverMutation`, `protectedFetch`).
4. Create `/login` and `/register` pages with React Hook Form, explicit error handling (`border-red-500`), and a "Login as Demo Student" button[cite: 6].

### Phase 4: Public UI & Layout (Client)
**Goal:** Build the mandatory public routes and responsive layouts using capitalized component folders.
1. Build sticky Navbar (`/components/Navbar/Navbar.jsx`) and functional Footer (`/components/Footer/Footer.jsx`)[cite: 6].
2. **Home Page (`/`):** Must contain exactly 7 sections (Hero, Features, Statistics, Mechanics, Testimonials, FAQ, CTA)[cite: 6]. Store sections in `/components/Homepage/`.
3. Build **About** (`/about`) and **Contact** (`/contact`) pages[cite: 6].

### Phase 5: Explore & Details Canvas
**Goal:** Implement the complex catalog and public details pages.
1. **Explore Page (`/explore`):** 
   - 4 cards per row on desktop[cite: 6].
   - Search bar, category/difficulty filters, and sorting[cite: 6].
   - Client-side pagination (8 items per page)[cite: 6].
2. **Details Page (`/explore/[id]`):** 
   - Sections for Media Banner, Specs Table, and AI Study Plan Canvas[cite: 6].
   - Implement checkboxes for users to mark tasks complete[cite: 6].
   - Add the "✨ Recalibrate Study Roadmap" button to trigger the AI Memory agent[cite: 6].

### Phase 6: Protected Dashboards
**Goal:** Secure data management for authenticated users.
1. **Add Item (`/items/add`):** Secure form utilizing `protectedFetch` to pass token headers. Must include skeleton loaders while AI generates data[cite: 6].
2. **Manage Items (`/items/manage`):** Data table listing user's created modules with 'View Details' and 'Delete' actions[cite: 6].
3. **Dashboard (`/dashboard`):** Integrate Recharts to visualize upcoming deadlines and study velocity[cite: 6].

### Phase 7: Final Polish
1. Test mobile, tablet, and desktop responsiveness[cite: 6].
2. Ensure zero dummy data (Lorem Ipsum) remains[cite: 6].
3. Deploy frontend (Vercel) and backend (Render).