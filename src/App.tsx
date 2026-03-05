/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, GraduationCap, RefreshCcw, Info, HelpCircle, MessageSquare, Mail, CheckCircle2, Calculator } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { CourseList } from './components/CourseList';
import { Course, analyzeMarksheet, calculateCGPA } from './services/gemini';
import { cn } from './utils/cn';

type Tab = 'calculator' | 'help' | 'feedback';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (base64: string, file: File) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const extractedCourses = await analyzeMarksheet(base64, file.type);
      if (extractedCourses.length === 0) {
        setError("Could not extract any courses. Please try a clearer image or add manually.");
      } else {
        setCourses(prev => [...prev, ...extractedCourses]);
      }
    } catch (err) {
      setError("Failed to analyze image. Please check your connection and try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      credits: 0,
      grade: ""
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const { cgpa, totalCredits } = useMemo(() => calculateCGPA(courses), [courses]);

  const reset = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setCourses([]);
      setError(null);
    }
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Anna University (Chennai) Standards
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold text-zinc-900 tracking-tight mb-4"
          >
            Vision<span className="text-indigo-600">CGPA</span>
          </motion.h1>

          {/* Tab Navigation */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 bg-zinc-200/50 rounded-2xl backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    activeTab === tab.id
                      ? "text-indigo-600 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id ? "text-indigo-600" : "text-zinc-400")} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'calculator' && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                {/* Uploader Section */}
                <section>
                  <ImageUploader onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
                      >
                        <Info className="w-5 h-5 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                {/* Results & List Section */}
                <AnimatePresence mode="wait">
                  {courses.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12"
                    >
                      {/* CGPA Card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between overflow-hidden relative">
                          <GraduationCap className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
                          <div>
                            <p className="text-indigo-100 font-medium mb-1">Calculated CGPA</p>
                            <h2 className="text-7xl font-bold tracking-tighter">
                              {cgpa.toFixed(2)}
                            </h2>
                          </div>
                          <div className="mt-8 flex items-center gap-4">
                            <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                              <p className="text-xs text-indigo-100 uppercase font-bold tracking-wider">Total Credits</p>
                              <p className="text-xl font-semibold">{totalCredits}</p>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                              <p className="text-xs text-indigo-100 uppercase font-bold tracking-wider">Courses</p>
                              <p className="text-xl font-semibold">{courses.length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-zinc-200 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Actions</h3>
                            <p className="text-sm text-zinc-500 mb-6">Manage your data or start over with a new marksheet.</p>
                          </div>
                          <div className="space-y-3">
                            <button
                              onClick={reset}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
                            >
                              <RefreshCcw className="w-4 h-4" />
                              Reset All
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Course List */}
                      <CourseList
                        courses={courses}
                        onUpdate={updateCourse}
                        onDelete={deleteCourse}
                        onAdd={addCourse}
                      />
                    </motion.div>
                  ) : (
                    !isAnalyzing && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl"
                      >
                        <div className="max-w-xs mx-auto space-y-4">
                          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto">
                            <GraduationCap className="w-8 h-8 text-zinc-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-zinc-900">No data yet</h3>
                          <p className="text-sm text-zinc-500">
                            Upload your marksheet or add courses manually to see your CGPA calculation.
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl p-8 lg:p-12 border border-zinc-200 shadow-sm"
              >
                <h2 className="text-3xl font-bold text-zinc-900 mb-8">How to use VisionCGPA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { title: "Capture Marksheet", desc: "Take a clear photo of your Anna University marksheet. Ensure text is legible.", icon: CheckCircle2 },
                    { title: "Upload Image", desc: "Drag and drop or click the upload area to select your marksheet photo.", icon: CheckCircle2 },
                    { title: "AI Extraction", desc: "Wait a few seconds while VisionCGPA extracts subject names, credits, and grades.", icon: CheckCircle2 },
                    { title: "Verify & Calculate", desc: "Review the extracted data. Edit any misread values to get your final CGPA.", icon: CheckCircle2 },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 mb-1">{i + 1}. {step.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <Info className="w-6 h-6 text-amber-600 shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">Pro Tip:</p>
                    <p>For best results, use a high-resolution image with good lighting. Avoid shadows or glare on the marksheet text.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl p-8 lg:p-12 border border-zinc-200 shadow-sm text-center"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <MessageSquare className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-4">We'd love your feedback!</h2>
                  <p className="text-zinc-500 mb-10">
                    Found a bug? Have a feature request? Or just want to say hi?
                    Your feedback helps us make VisionCGPA better for everyone.
                  </p>

                  <a
                    href="mailto:bhatsaakib505@gmail.com"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Mail className="w-5 h-5" />
                    Email Developer
                  </a>

                  <p className="mt-6 text-sm text-zinc-400">
                    Direct Email: <span className="font-mono text-zinc-600">bhatsaakib505@gmail.com</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-24 pt-8 border-t border-zinc-200 text-center">
          <p className="text-sm text-zinc-400">
            VisionCGPA does not store any data. Data is processed in real-time and not stored.
          </p>
          <p className="text-sm text-zinc-400">
            Developed by <a href="https://saquibnazeer.vercel.app"><mark>Saquib Nazeer</mark></a>
          </p>
        </footer>
      </main>
    </div>
  );
}
