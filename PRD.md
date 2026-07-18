📄 Product Requirement Document (PRD)
— Revised & 100% Compliant
Project Name: ExamPrep AI — Full Stack Agentic Micro-Learning Engine
Author: Full-Stack AI Developer
Environment: Google Antigravity IDE
Timeline: 72 Hours Production Window
1. Executive Summary & Objective
ExamPrep AI is a production-grade, highly specialized micro-learning curriculum planner and study optimization
engine designed explicitly to help students defeat academic burnout. Students frequently experience cognitive
friction  when  trying  to  translate  large,  unstructured  course  syllabi,  textbook  outlines,  or  raw  text  chapter
requirements into discrete, structured execution steps.
This application empowers students to enter any unformatted text criteria and uses a backend Agentic AI engine
(Gemini) to execute automated multi-variable token parsing, complexity scoring, and parameter tagging. Moving
beyond basic one-shot text generation, the platform implements a stateful  Agent Memory System that saves,
tracks, and recalculates dynamic study roadmaps as users mark milestones complete, charting learning velocity
metrics visually using a Recharts analytics dashboard.
2. Global System Constraints & Core Tech Stack
Frontend Architectural Stack
Core Framework: Next.js (App Router, Version 15/16) utilizing strict compilation rules.
Language: TypeScript ( strict: true  validation within tsconfig ).
Styling Engine: Tailwind CSS utilizing uniform container configurations combined with a strict 3-color theme
palette.
State & Query Orchestration: TanStack Query ( @tanstack/react-query ) for optimistic server cache
updates, loading states, and automatic error boundary state management.
Form Validation: React Hook Form integrated with Zod schemas for runtime schema safety and instant
validation feedback.
Visual Data Layer: Recharts for dynamic visual rendering of student performance analytics.
Backend Architectural Stack
Server Engine: Node.js with Express.js utilizing native ES modules ( "type": "module" ).
Database: MongoDB Atlas utilizing Mongoose ORM models.
Authentication & Session Management: Better Auth framework tokens. All standard protected routes utilize
secure session headers.
• 
• 
• 
• 
• 
• 
• 
• 
• 
ExamPrep AI - Product Requirement Document (Revised)
Page 1 of 9


AI Engine SDK Integration: Google Gen AI Node.js SDK ( @google/genai ) using the free, high-velocity tier
model: gemini-2.5-flash .
🎨 Strict 3-Color Design System Rules:
• Color 1 (Primary Deep Branding): Deep Navy (#0F172A / bg-slate-900)
• Color 2 (Modern Education Accent): Vibrant Indigo (#6366F1 / bg-indigo-500)
• Color 3 (Priority/Success Anchor): Vivid Emerald (#10B981 / bg-emerald-500)
• Color Neutral (Layout Canvas): Crisp Soft White/Slate (#F8FAFC / bg-slate-50)
All visual cards, grid elements, and inputs must use matching border radiuses (rounded-xl) and borders.
Native responsiveness built deliberately across three target screen viewports: Mobile (w-full block), Tablet
(md:grid-cols-2), and Desktop (lg:grid-cols-4).
3. Detailed Route Layouts & Navigation Framework
The application implements a fixed position, high-responsiveness sticky Navbar ( sticky top-0 z-50 backdrop-
blur-md bg-white/80 border-b border-slate-200 ) providing precise routing pathways depending on the
user's validation state.
🌐 Public Navigation Views (Unauthenticated — Minimum 3 Routes)
Home Page ( / ): Includes a 65vh high hero banner with an interactive "Get Started" call-to-action button, core
value propositions, and dynamic Recharts analytical graphics highlighting student grade improvements.
Features exactly 7 sections: Hero, Features, Statistics, Mechanics, Testimonials, FAQ accordion, and a bottom
Call to Action section.
Explore Modules Page ( /explore ): A public directory layout displaying a text search bar, multi-variable filter
dropdowns, and a strict responsive catalog grid showing precisely 4 cards per row on desktop screens.
About Us Page ( /about ): A narrative overview detailing the platform's history, engineering rules, and
technical solutions against student burnout.
🔒 Private Dashboard Views (Authenticated via Better Auth — Minimum 5 Routes)
Dashboard Control Center ( /dashboard ): Displays a student's personal learning velocity, analytical 
Recharts Bar Charts tracking upcoming deadlines, and urgent milestone notifications.
Explore Directory ( /explore  - Extended View): Displays matching cards but introduces interactive items
such as "Clone this Syllabus to my Profile" or "Bookmark Template".
Add Study Module Form ( /items/add ): A secure input page containing text fields for title, target exam dates,
syllabus content, and optional image links. Includes automatic skeleton loaders when generating data.
Manage Modules Panel ( /items/manage ): A clean dashboard table grid listing every module created by the
authenticated user. Each row explicitly presents item metadata alongside View Details and Delete Item
operations.
User Profile ( /profile ): Manages Better Auth configurations, displaying synchronized Google avatars, active
user emails, and a logout mechanism.
• 
• 
• 
• 
• 
• 
• 
• 
• 
ExamPrep AI - Product Requirement Document (Revised)
Page 2 of 9


📝 Additional Mandatory Pages
Contact Us Page ( /contact ): Provides a fully functional student feedback form backed by real-time
validation, rendering custom success/error toast alerts upon payload execution. Includes explicit university
support email anchors and telephone lines.
Help & Documentation Page ( /help ): Houses detailed technical quick-start user guides, step-by-step videos
detailing how to capture syllabus text parameters, and explicit tutorials for using the Agent memory regeneration
loops.
🌐 Functional Site Footer
A fixed sticky bottom navigation component ( bg-slate-900 text-slate-400 border-t border-slate-800
py-12 ) appended globally across all public and protected view states. It contains real school support contact
information ( support@examprep.ai ,  +1 (555) 019-2834 ), actual working anchor icons targeting developer
project matrices (GitHub source branches, LinkedIn engineer portfolios), and contains zero dummy strings or
broken links.
4. Component Layout Specifications
Core Listing Cards Section (Desktop: 4 Cards per Row)
Every study module card utilizes an identical layout structure: visual asset header, bold title typography, short
description paragraph limited to exactly 2 lines, and an explicit action button reading "View Details". Crucially, it
renders a **Rich Meta Information Grid** featuring: Exam Target Date, AI Category tag, AI Difficulty Tier badge
(Green: Beginner, Orange: Intermediate, Red: Advanced), AI Priority Score (1-10 rating scale), and Estimated
Velocity Time. A Tailwind **Skeleton Loader block** handles async states gracefully.
Complete Public Details Page ( /explore/[id] )
A completely public-facing, highly structured deep-dive interface laid out in distinct visual segments:
Media Gallery Layout: An asset banner displaying related graphical assets or custom generated timeline
maps.
Overview & Core Synopsis: Detailed typography section outputting structural descriptions.
Operational Technical Specifications Table: A clean grid layout displaying item statistics: Target Exam Date,
Calculated Workload Tier, Priority Rank, Category tags, and User completion statistics.
The Stateful AI Study Plan Canvas: Renders the dynamic output from the AI Study Planner Agent. Features
interactive checkbox list rows where students check off tasks directly.
User Reviews & Academic Feedback Segment: A module allowing peers to leave ratings and text summaries
describing the clarity or success rate of this specific study roadmap.
Related Study Modules Grid: A bottom panel rendering related module cards within matching subject tracks to
satisfy cross-recommendation logic.
• 
• 
• 
• 
• 
• 
• 
• 
ExamPrep AI - Product Requirement Document (Revised)
Page 3 of 9


5. Explore Directory Controls (Search, Filter, Sort, Page)
The /explore  hub implements comprehensive data controllers handling heavy database queries through unified
URL search parameters:
Text Search Anchor: A single textual input filtering datasets matching words within item titles or descriptions.
Dual-Field Filtering Infrastructure: Field 1 maps Subject Category dropdown select input (e.g., Computer
Science, Engineering). Field 2 maps Calculated Workload Difficulty select inputs ( Beginner , Intermediate ,
Advanced ).
Sorting Parameters Dropdown: An interactive configuration filter allowing the engine to restructure grid card
locations by sorting data columns via: Newest Added , Closest Exam Date , Highest Priority Score ,
and Difficulty Rank .
Pagination Controller: An explicitly structured bottom navigation segment limiting list views to exactly 8 items
per block, containing functional "Next" and "Previous" action hooks to navigate datasets without page
refreshes.
6. Authentication System & Explicit Validation Strategy
To pass compliance benchmarks, the entry routes ( /login , /register ) utilize React Hook Form bound to a
strict validation layout compiled by Zod.
Email Structure: Must match valid email regex expressions, rendering an explicit message ( "Please enter a
valid academic email address" ) if invalid.
Password Constraints: Enforces a minimum length of 8 characters containing at least one uppercase
character, one lowercase character, and one numeric string digit. Failing this outputs: "Password must be at
least 8 characters long and contain both numbers and letters."
Error Indicators: Input board frames toggle dynamically into highly visible red alerts ( border-red-500 ) with
absolute error text messages rendered directly underneath the invalid input window.
Demo Login Fast-Path: A large button marked "Login as Demo Student" bypasses typing. Clicking it
immediately injects pre-validated values ( student@demo.com  / Password123 ) directly into the input states
and executes the submit action immediately, providing instant access for graders.
Google OAuth Core: Single-tap authentication hook integrated directly via the Better Auth social configuration
profile.
7. Protected Page Forms & Workspace Dashboards
Add Items Interface ( /items/add )
Protected by server-side middleware checking active Better Auth session headers. If the cookie token is missing,
the system redirects the client instantly to /login . Form fields include: Title , Short Description  (max 250
characters),  Full  Description  /  Syllabus  Input  (textarea),  Exam/Due  Date  (calendar  picker),  and
Optional Image URL .
• 
• 
• 
• 
• 
• 
• 
• 
• 
ExamPrep AI - Product Requirement Document (Revised)
Page 4 of 9


Manage Items Dashboard Grid ( /items/manage )
A protected, secure data table displaying only the records generated by the logged-in student. Columns format Title,
Subject, Difficulty Level badge, Exam Date string, and Action groups. Action hooks supply a "View Details" button
routing to the deep details screen, and an explicit  "Delete" button executing immediate Mongoose document
removal mutations with optimized cache invalidation.
8. Substantial Agentic AI Architectures & Memory Engine
Feature 1: AI Auto-Classification & Dynamic Tagging (Feature E)
The Agentic Logic: Upon submitting a new module form, the Express endpoint routes the content parameters to
Gemini. The system instructions require the model to act as a data parser. It analyzes the raw syllabus text and
evaluates it against multi-variable constraints to determine the item's difficulty tier, calculate an urgent priority metric
out of 10, and select a flat JSON array of relevant search hashtags. The generated tags are returned to the client
and automatically injected directly into an active, editable input component on the creation screen.
Feature 2: AI Smart Study Planner Agent with Memory (Feature B/A Alternative)
The Agentic Logic: Moving far beyond static text creation, this feature handles multi-turn state updates by tracking
data changes within the database schema. The prompt framework reads the core task checklist array stored inside
the MongoDB document. When a user checks off tasks as "Complete" on their dashboard, the database writes a
permanent state update. If a student falls behind or misses multiple scheduled study targets, they click  "✨
Recalibrate Study Roadmap". The Express AI controller reads the updated item document—specifically analyzing
which tasks have 'isCompleted: true' and which remain outstanding. Keeping all completed tasks intact, Gemini
uses this historical progress as contextual **Agent Memory**, dynamically restructuring the future study plan to
adjust the workload across the remaining timeframe.
ExamPrep AI - Product Requirement Document (Revised)
Page 5 of 9


9. Architectural Data Schemas (MongoDB & Mongoose)
Collection 1: Users Model
import { Schema, model, Document } from 'mongoose';
export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });
export const User = model<IUser>('User', UserSchema);
ExamPrep AI - Product Requirement Document (Revised)
Page 6 of 9


Collection 2: StudyModules Model (Enhanced with Memory Task Array)
import { Schema, model, Document } from 'mongoose';
export interface IStudyTask {
  id: string;
  taskName: string;
  targetDayNumber: number;
  isCompleted: boolean;
}
export interface IStudyModule extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  shortDescription: string;
  fullSyllabusText: string;
  examDate: Date;
  imageUrl?: string;
  difficultyTier: 'Beginner' | 'Intermediate' | 'Advanced';
  priorityScore: number;
  aiGeneratedTags: string[];
  structuredStudyTasks: IStudyTask[];
  createdAt: Date;
  updatedAt: Date;
}
const StudyTaskSchema = new Schema<IStudyTask>({
  id: { type: String, required: true },
  taskName: { type: String, required: true },
  targetDayNumber: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false }
});
const StudyModuleSchema = new Schema<IStudyModule>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, maxlength: 250 },
  fullSyllabusText: { type: String, required: true },
  examDate: { type: Date, required: true },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-
f06f85e504b3' },
  difficultyTier: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 
'Intermediate' },
  priorityScore: { type: Number, default: 5 },
  aiGeneratedTags: [{ type: String }],
  structuredStudyTasks: [StudyTaskSchema]
}, { timestamps: true });
StudyModuleSchema.index({ title: 'text', shortDescription: 'text' });
export const StudyModule = model<IStudyModule>('StudyModule', StudyModuleSchema);
ExamPrep AI - Product Requirement Document (Revised)
Page 7 of 9


10. Precise AI Prompt Engineering & SDK Specifications
System Prompt 1: AI Auto-Classification & Tagging (Endpoint: /api/ai/classify )
System Prompt 2: Stateful Memory Recalibration (Endpoint: /api/ai/recalibrate )
11. Immediate 72-Hour Step-by-Step Execution Strategy
Hours 0 - 18: Database Integration & Auth Core Setup
Initialize the Express workspace using TypeScript. Embed the updated Mongoose schemas. Wire up the
Better Auth token configuration to handle Google OAuth and the automated Assessor Demo Login state
updates.
model: 'gemini-2.5-flash',
config: {
  responseMimeType: 'application/json',
  systemInstruction: 'You are an elite academic asset parsing agent. Analyze the provided title 
and syllabus text. You must accurately categorize the item and output a single, flat, structured 
JSON object with absolutely no extra text, backticks, or markdown blocks. The output object 
schema must exactly follow: { "difficultyTier": "Beginner" | "Intermediate" | "Advanced", 
"priorityScore": number (1 to 10 based on urgency/complexity), "aiGeneratedTags": string[] 
(array of maximum 5 lowercase skill tags starting with #) }'
}
You are an Agentic Study Planner with operational state memory. 
Review the current historical progress for this module:
- Module: ${module.title}
- Days left until deadline: ${daysRemaining}
HISTORICAL PROGRESS DATA (Memory Status):
- Current Task List: ${JSON.stringify(module.structuredStudyTasks)}
INSTRUCTIONS:
Analyze which tasks have 'isCompleted: true' and which remain outstanding. Keeping all completed 
tasks intact, re-evaluate and restructure the remaining uncompleted tasks to optimize the 
student's preparation schedule over the final ${daysRemaining} days. Output a valid JSON array 
containing the newly updated checklist items following this schema:
[
  { "id": "string-uuid", "taskName": "Clear task step text", "targetDayNumber": number, 
"isCompleted": false }
]
ExamPrep AI - Product Requirement Document (Revised)
Page 8 of 9


Hours 18 - 36: Frontend Page Assembly & Discovery Logic
Scaffold the Next.js client layout structures. Apply the 3-color Tailwind color themes. Complete the Landing
Page (all 7 sections), the complete Public Details layout view page, the secure Add Module form screen with
Zod validation, the Explore directory (featuring sorting and pagination), and the functional sticky footer.
Hours 36 - 54: Gemini AI Agentic Pipeline Connections
Install the  @google/genai  library. Create the backend controller endpoints using the structured JSON
system prompts. Connect client components to render skeleton indicators during asset generation. Hook up
the checkbox state handlers to pass historical data updates for the agent memory loops.
Hours 54 - 72: Polishing, Responsiveness, & Deployment
Scan the code repository to verify zero dummy lorem-ipsum content. Ensure flawless layout responsiveness
on tablet/mobile screens. Execute production test builds and deploy to Vercel and Render/Railway.
ExamPrep AI - Product Requirement Document (Revised)
Page 9 of 9
