import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: 'linear-gradient(135deg, #6366F1, #10B981)' }}>
            E
          </div>
          <span className="text-3xl font-extrabold text-slate-900">
            ExamPrep<span className="text-indigo-500"> AI</span>
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Defeat Academic Burnout
        </h1>
        <p className="text-slate-600 text-lg">
          Empowering students to turn unstructured syllabi into discrete, structured, and manageable study steps.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all bg-white">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
