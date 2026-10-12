import React, { useState } from 'react';
import { Bookmark, Clock, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';

export interface StudyNote {
  id: number | string;
  lessonId: number | string;
  timestampSeconds?: number | null;
  content: string;
  createdAt?: string;
}

interface LessonNotesWorkspaceProps {
  lessonId: number | string;
  lessonTitle: string;
  currentVideoTime?: number;
  onSeekTo?: (seconds: number) => void;
}

export const LessonNotesWorkspace: React.FC<LessonNotesWorkspaceProps> = ({
  lessonId,
  lessonTitle,
  currentVideoTime = 0,
  onSeekTo,
}) => {
  const [notes, setNotes] = useState<StudyNote[]>([
    {
      id: 1,
      lessonId,
      timestampSeconds: 125,
      content: 'نقطة جوهرية: الفرق بين مصادقة الـ Session وتوكن Sanctum في تطبيقات الهواتف.',
      createdAt: 'اليوم، 10:30 ص',
    },
    {
      id: 2,
      lessonId,
      timestampSeconds: 310,
      content: 'ملاحظة للمراجعة: التحقق من صحة توقيع الرابط المشفر HLS Bunny.',
      createdAt: 'اليوم، 10:45 ص',
    },
  ]);

  const [newContent, setNewContent] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  const formatSeconds = (sec?: number | null) => {
    if (sec === null || sec === undefined) return null;
    const mins = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newNote: StudyNote = {
      id: Date.now(),
      lessonId,
      timestampSeconds: includeTimestamp ? Math.floor(currentVideoTime) : null,
      content: newContent.trim(),
      createdAt: 'الآن',
    };

    setNotes(prev => [newNote, ...prev]);
    setNewContent('');
  };

  const handleDeleteNote = (id: number | string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5 text-right">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">مفكرة المذاكرة اللحظية (Study Notes)</h4>
            <p className="text-[11px] text-slate-500">دوّن ملخصاتك واربطها بدقيقة الشرح في الفيديو</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-amber-100/60 text-amber-800 px-2.5 py-0.5 rounded-full">
          {notes.length} ملاحظات
        </span>
      </div>

      {/* Note Input Box */}
      <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder={`اكتب ملخصاً أو نقطة هامة عن درس "${lessonTitle}"...`}
          rows={2}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white resize-none"
        />

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={e => setIncludeTimestamp(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              ربط بالدقيقة الحالية ({formatSeconds(currentVideoTime) || '00:00'})
            </span>
          </label>

          <button
            type="submit"
            disabled={!newContent.trim()}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>حفظ الملاحظة</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-1">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-1" />
            <p className="text-xs font-bold">لا توجد ملاحظات مسجلة بعد</p>
            <p className="text-[11px]">سجل أفكارك أثناء مشاهدة الشرح للرجوع إليها وقت المراجعة.</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="p-3 bg-white hover:bg-slate-50/70 border border-slate-100 hover:border-slate-200 rounded-xl transition-all flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1">
                {note.timestampSeconds !== null && note.timestampSeconds !== undefined && (
                  <button
                    onClick={() => onSeekTo && onSeekTo(note.timestampSeconds!)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100 transition-all cursor-pointer"
                    title="القفز للدقيقة في الفيديو"
                  >
                    <Clock className="w-3 h-3" />
                    <span>{formatSeconds(note.timestampSeconds)}</span>
                  </button>
                )}
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{note.content}</p>
                {note.createdAt && (
                  <span className="text-[10px] text-slate-400 block">{note.createdAt}</span>
                )}
              </div>

              <button
                onClick={() => handleDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                title="حذف الملاحظة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
