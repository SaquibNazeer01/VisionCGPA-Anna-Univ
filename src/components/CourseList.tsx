import React from 'react';
import { Trash2, Plus, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course } from '../services/gemini';
import { cn } from '../utils/cn';

interface CourseListProps {
  courses: Course[];
  onUpdate: (id: string, field: keyof Course, value: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onUpdate, onDelete, onAdd }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          Course Details
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-bottom border-zinc-200">
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Subject Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 w-24 text-center">Credits</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 w-24 text-center">Grade</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            <AnimatePresence initial={false}>
              {courses.map((course) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => onUpdate(course.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-zinc-900 placeholder-zinc-400"
                      placeholder="e.g. Mathematics"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={course.credits}
                      onChange={(e) => onUpdate(course.id, 'credits', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-center text-zinc-900"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={course.grade}
                      onChange={(e) => onUpdate(course.id, 'grade', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-center font-mono font-semibold text-indigo-600 uppercase"
                      placeholder="O"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(course.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {courses.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            No courses added yet. Upload a marksheet to begin.
          </div>
        )}
      </div>
    </div>
  );
};
