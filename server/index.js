import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────────────────────────────────────
// 1. MongoDB Native Client Setup
// ─────────────────────────────────────────────────────────────────────────────
const mongoClient = new MongoClient(process.env.MONGODB_URI);
await mongoClient.connect();
console.log('✅ MongoDB connected successfully');

const db = mongoClient.db('exam-prep-db');
const usersCollection = db.collection('users');
const studyModulesCollection = db.collection('studyModules');
const sessionsCollection = db.collection('sessions');
const accountsCollection = db.collection('accounts');
const verificationsCollection = db.collection('verifications');

// Text index for search (idempotent)
await studyModulesCollection.createIndex(
  { title: 'text', shortDescription: 'text' },
  { background: true }
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Gemini AI Setup
// ─────────────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// 3. Express App
// ─────────────────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());


// ─────────────────────────────────────────────────────────────────────────────
// 6. Custom Auth Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * verifyToken — validates the Bearer token from Authorization header
 * Attaches session to req.session and user ID to req.userId
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Validate session against DB
    const session = await sessionsCollection.findOne({ token });
    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    }

    req.session = session;
    req.userId = session.userId.toString();
    next();
  } catch (err) {
    console.error('verifyToken error:', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
};

/**
 * verifyUser — extends verifyToken by also attaching the full user object
 */
const verifyUser = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error('verifyUser error:', err);
      res.status(500).json({ error: 'Internal auth error' });
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Public Module Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/modules
 * Query params: search, category, difficulty, sort, page (default 1), limit (default 8)
 */
app.get('/api/modules', async (req, res) => {
  try {
    const { search, category, difficulty, sort, page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter query
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficultyTier = difficulty;
    }

    // Build sort options
    let sortOptions = { createdAt: -1 }; // default: Newest Added
    if (sort === 'examDate') sortOptions = { examDate: 1 };
    else if (sort === 'priority') sortOptions = { priorityScore: -1 };
    else if (sort === 'difficulty') {
      // Custom difficulty order: Advanced > Intermediate > Beginner
      sortOptions = { difficultyTier: -1 };
    }

    const [modules, totalCount] = await Promise.all([
      studyModulesCollection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      studyModulesCollection.countDocuments(query),
    ]);

    res.json({
      modules,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (err) {
    console.error('GET /api/modules error:', err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

/**
 * GET /api/modules/mine — protected: returns only the logged-in user's modules
 */
app.get('/api/modules/mine', verifyToken, async (req, res) => {
  try {
    const modules = await studyModulesCollection
      .find({ userId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ modules });
  } catch (err) {
    console.error('GET /api/modules/mine error:', err);
    res.status(500).json({ error: 'Failed to fetch your modules' });
  }
});

/**
 * GET /api/modules/:id — single module details (public)
 */
app.get('/api/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    const module = await studyModulesCollection.findOne({ _id: new ObjectId(id) });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Fetch related modules by similar tags (exclude current)
    const relatedModules = await studyModulesCollection
      .find({
        _id: { $ne: new ObjectId(id) },
        aiGeneratedTags: { $in: module.aiGeneratedTags || [] },
      })
      .limit(4)
      .toArray();

    res.json({ module, relatedModules });
  } catch (err) {
    console.error('GET /api/modules/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Protected Module Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/modules — create a new study module
 */
app.post('/api/modules', verifyToken, async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      fullSyllabusText,
      examDate,
      imageUrl,
      difficultyTier,
      priorityScore,
      aiGeneratedTags,
      structuredStudyTasks,
      category,
    } = req.body;

    // Basic validation
    if (!title || !shortDescription || !fullSyllabusText || !examDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (shortDescription.length > 250) {
      return res.status(400).json({ error: 'Short description exceeds 250 characters' });
    }

    const now = new Date();
    const newModule = {
      userId: new ObjectId(req.userId),
      title: title.trim(),
      shortDescription,
      fullSyllabusText,
      examDate: new Date(examDate),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      difficultyTier: difficultyTier || 'Intermediate',
      priorityScore: priorityScore || 5,
      aiGeneratedTags: aiGeneratedTags || [],
      structuredStudyTasks: structuredStudyTasks || [],
      category: category || 'General',
      createdAt: now,
      updatedAt: now,
    };

    const result = await studyModulesCollection.insertOne(newModule);
    res.status(201).json({ message: 'Module created successfully', moduleId: result.insertedId });
  } catch (err) {
    console.error('POST /api/modules error:', err);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

/**
 * DELETE /api/modules/:id — delete own module
 */
app.delete('/api/modules/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    // Ensure user owns this module
    const module = await studyModulesCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.userId),
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    await studyModulesCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/modules/:id error:', err);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

/**
 * PATCH /api/modules/:id/tasks — toggle individual task isCompleted state
 */
app.patch('/api/modules/:id/tasks', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId, isCompleted } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    // Ownership check
    const module = await studyModulesCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.userId),
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    // Update the specific task's isCompleted field
    const updatedTasks = module.structuredStudyTasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted } : task
    );

    await studyModulesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { structuredStudyTasks: updatedTasks, updatedAt: new Date() } }
    );

    res.json({ message: 'Task updated successfully', updatedTasks });
  } catch (err) {
    console.error('PATCH /api/modules/:id/tasks error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Agentic AI Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/classify
 * Body: { title, fullSyllabusText }
 * Returns: { difficultyTier, priorityScore, aiGeneratedTags }
 */
app.post('/api/ai/classify', async (req, res) => {
  try {
    const { title, fullSyllabusText } = req.body;

    if (!title || !fullSyllabusText) {
      return res.status(400).json({ error: 'title and fullSyllabusText are required' });
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        systemInstruction:
          'You are an elite academic asset parsing agent. Analyze the provided title and syllabus text. You must accurately categorize the item and output a single, flat, structured JSON object with absolutely no extra text, backticks, or markdown blocks. The output object schema must exactly follow: { "difficultyTier": "Beginner" | "Intermediate" | "Advanced", "priorityScore": number (1 to 10 based on urgency/complexity), "aiGeneratedTags": string[] (array of maximum 5 lowercase skill tags starting with #) }',
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: `Title: ${title}\n\nSyllabus Content:\n${fullSyllabusText}` }],
        },
      ],
    });

    const rawText = response.text;
    const parsed = JSON.parse(rawText);

    // Validate response shape
    const validTiers = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validTiers.includes(parsed.difficultyTier)) {
      parsed.difficultyTier = 'Intermediate';
    }
    if (typeof parsed.priorityScore !== 'number') {
      parsed.priorityScore = 5;
    }
    if (!Array.isArray(parsed.aiGeneratedTags)) {
      parsed.aiGeneratedTags = [];
    }

    res.json(parsed);
  } catch (err) {
    console.error('POST /api/ai/classify error:', err);
    res.status(500).json({ error: 'AI classification failed', details: err.message });
  }
});

/**
 * POST /api/ai/recalibrate
 * Body: { moduleId }
 * Reads module from DB, sends task memory to Gemini, updates DB with restructured tasks
 * Returns: { structuredStudyTasks }
 */
app.post('/api/ai/recalibrate', verifyToken, async (req, res) => {
  try {
    const { moduleId } = req.body;

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return res.status(400).json({ error: 'Valid moduleId is required' });
    }

    // Fetch module (ownership check)
    const module = await studyModulesCollection.findOne({
      _id: new ObjectId(moduleId),
      userId: new ObjectId(req.userId),
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    // Calculate days remaining until exam
    const now = new Date();
    const examDate = new Date(module.examDate);
    const daysRemaining = Math.max(
      0,
      Math.ceil((examDate - now) / (1000 * 60 * 60 * 24))
    );

    // Build stateful memory prompt
    const systemInstruction = `You are an Agentic Study Planner with operational state memory.
Review the current historical progress for this module:
- Module: ${module.title}
- Days left until deadline: ${daysRemaining}

HISTORICAL PROGRESS DATA (Memory Status):
- Current Task List: ${JSON.stringify(module.structuredStudyTasks)}

INSTRUCTIONS:
Analyze which tasks have 'isCompleted: true' and which remain outstanding. Keeping all completed tasks intact, re-evaluate and restructure the remaining uncompleted tasks to optimize the student's preparation schedule over the final ${daysRemaining} days. Output a valid JSON array containing the newly updated checklist items following this schema:
[{ "id": "string-uuid", "taskName": "Clear task step text", "targetDayNumber": number, "isCompleted": false }]

IMPORTANT: Return ONLY the JSON array. No extra text, no markdown, no backticks.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { responseMimeType: 'application/json' },
      contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
    });

    const rawText = response.text;
    const newTasks = JSON.parse(rawText);

    if (!Array.isArray(newTasks)) {
      return res.status(500).json({ error: 'AI returned invalid task structure' });
    }

    // Ensure new tasks each have a valid id
    const sanitizedNewTasks = newTasks.map((task) => ({
      id: task.id || uuidv4(),
      taskName: task.taskName || 'Study Task',
      targetDayNumber: task.targetDayNumber || 1,
      isCompleted: false,
    }));

    // Keep completed tasks + replace uncompleted with Gemini's restructured plan
    const completedTasks = module.structuredStudyTasks.filter((t) => t.isCompleted);
    const mergedTasks = [...completedTasks, ...sanitizedNewTasks];

    // Save to MongoDB
    await studyModulesCollection.updateOne(
      { _id: new ObjectId(moduleId) },
      { $set: { structuredStudyTasks: mergedTasks, updatedAt: new Date() } }
    );

    res.json({
      message: 'Study roadmap recalibrated successfully',
      structuredStudyTasks: mergedTasks,
    });
  } catch (err) {
    console.error('POST /api/ai/recalibrate error:', err);
    res.status(500).json({ error: 'AI recalibration failed', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Generate Initial Study Plan (called after module creation)
// POST /api/ai/generate-plan
// Body: { moduleId }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/ai/generate-plan', verifyToken, async (req, res) => {
  try {
    const { moduleId } = req.body;

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return res.status(400).json({ error: 'Valid moduleId is required' });
    }

    const module = await studyModulesCollection.findOne({
      _id: new ObjectId(moduleId),
      userId: new ObjectId(req.userId),
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found or unauthorized' });
    }

    const now = new Date();
    const examDate = new Date(module.examDate);
    const daysRemaining = Math.max(
      1,
      Math.ceil((examDate - now) / (1000 * 60 * 60 * 24))
    );

    const systemInstruction = `You are an expert academic study planner. Create a structured day-by-day study plan for the following module:
- Title: ${module.title}
- Syllabus: ${module.fullSyllabusText}
- Difficulty: ${module.difficultyTier}
- Days until exam: ${daysRemaining}

Generate a comprehensive task checklist spread across ${daysRemaining} days. Each task should be specific, actionable, and achievable in 1-3 hours.

Output ONLY a valid JSON array following this exact schema:
[{ "id": "string-uuid", "taskName": "Clear task step text", "targetDayNumber": number, "isCompleted": false }]

Maximum 20 tasks. No extra text, no markdown, no backticks.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { responseMimeType: 'application/json' },
      contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
    });

    const rawText = response.text;
    const tasks = JSON.parse(rawText);

    if (!Array.isArray(tasks)) {
      return res.status(500).json({ error: 'AI returned invalid task structure' });
    }

    const sanitizedTasks = tasks.map((task) => ({
      id: task.id || uuidv4(),
      taskName: task.taskName || 'Study Task',
      targetDayNumber: task.targetDayNumber || 1,
      isCompleted: false,
    }));

    await studyModulesCollection.updateOne(
      { _id: new ObjectId(moduleId) },
      { $set: { structuredStudyTasks: sanitizedTasks, updatedAt: new Date() } }
    );

    res.json({
      message: 'Initial study plan generated successfully',
      structuredStudyTasks: sanitizedTasks,
    });
  } catch (err) {
    console.error('POST /api/ai/generate-plan error:', err);
    res.status(500).json({ error: 'Plan generation failed', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. Health Check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Start Server
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ExamPrep AI Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
