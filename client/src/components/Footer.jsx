import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">© {new Date().getFullYear()} ExamPrep AI. All rights reserved.</p>
        <p className="text-xs mt-2">University Support: support@examprep.ai | +1 (555) 019-2834</p>
      </div>
    </footer>
  );
}
