import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Layers, 
  GitBranch, 
  History as HistoryIcon, 
  Terminal, 
  BarChart3, 
  ShieldCheck,
  Zap,
  ChevronRight,
  Upload,
  Play,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

import { ViewType, ModelType, AnalysisResult, SystemLog, TextSegment } from './types';
import { analyzeText } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg group",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon size={18} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
    {label}
  </button>
);

const Card = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string, key?: React.Key }) => (
  <div className={cn("bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden", className)}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI);
  const [sensitivity, setSensitivity] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [workflowStep, setWorkflowStep] = useState(0);

  const addLog = (message: string, level: SystemLog['level'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      level,
      message
    }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    addLog('System kernel initialized', 'success');
    addLog('Ready for forensic analysis', 'info');
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setWorkflowStep(1);
    addLog(`Starting analysis with ${selectedModel}...`, 'info');
    
    try {
      // Simulate workflow steps for UI
      const steps = [
        'Text Pre-Processing...',
        'Tokenization & Vectorization...',
        'Model Inference...',
        'Prediction Aggregation...'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setWorkflowStep(i + 1);
        addLog(`Executing: ${steps[i]}`, 'info');
        await new Promise(r => setTimeout(r, 800));
      }

      const analysis = await analyzeText(inputText, selectedModel, sensitivity);
      setResult(analysis);
      setHistory(prev => [analysis, ...prev]);
      addLog('Analysis completed successfully', 'success');
      setWorkflowStep(5);
    } catch (error) {
      addLog(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
          The Industry Standard
        </span>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
          Identifying-AI <br />
          <span className="text-indigo-600">vs-Human content</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
          The industry standard for AI content verification. Detect GPT-4, Gemini, and Claude patterns with 94% accuracy.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => setCurrentView('detection')}
            className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Launch Detector <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => setCurrentView('stats')}
            className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            View Stats <BarChart3 size={20} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
        {[
          { label: 'Global Accuracy', value: '94%', color: 'bg-indigo-600' },
          { label: 'Total Scans', value: '1,240', color: 'bg-slate-100' },
          { label: 'Latency', value: '142ms', color: 'bg-slate-100' }
        ].map((stat, i) => (
          <Card key={i} className="relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={64} className="text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                className={cn("h-full rounded-full", stat.color)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetection = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Source Content">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste text or upload a document to begin forensic analysis..."
                className="w-full h-96 p-6 text-lg text-slate-800 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 resize-none font-serif leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3">
                  <Upload size={14} /> Upload File
                </button>
                <button 
                  onClick={() => setCurrentView('workflow')}
                  className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3"
                >
                  <GitBranch size={14} /> Parallel Workflow
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
              <div className="flex items-center gap-4">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(ModelType).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {inputText.length} characters
                </span>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={cn(
                  "px-8 py-3 font-bold text-white rounded-2xl shadow-lg transition-all flex items-center gap-2",
                  isAnalyzing || !inputText.trim() 
                    ? "bg-slate-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Zap size={18} />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={18} /> Analyze Content
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-slate-400">
              <AlertCircle size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">AI detection is probabilistic and may produce false positives. Use as a forensic aid, not absolute proof.</p>
            </div>
          </Card>

          {result && (
            <Card title="Analysis Breakdown">
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl font-serif leading-relaxed text-lg">
                  {result.segments.map((seg, i) => (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      className={cn(
                        "inline-block px-1 rounded transition-colors cursor-help group relative",
                        seg.isAI ? "bg-red-100/50 hover:bg-red-200/50" : "bg-emerald-100/50 hover:bg-emerald-200/50"
                      )}
                    >
                      {seg.text}{' '}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold uppercase">{seg.isAI ? 'AI Generated' : 'Human Written'}</span>
                          <span className="font-mono">{Math.round(seg.confidence * 100)}%</span>
                        </div>
                        <p className="opacity-70 leading-normal">{seg.explanation}</p>
                      </div>
                    </motion.span>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          {result ? (
            <>
              <Card title="Detection Distribution">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'AI Generated', value: result.aiPercentage },
                          { name: 'Human Written', value: result.humanPercentage }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase">AI Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Human Written</span>
                  </div>
                </div>
              </Card>

              <Card title="Linguistic Metrics">
                <div className="space-y-6">
                  {[
                    { label: 'Variability', value: result.metrics.variability, icon: ShieldCheck },
                    { label: 'Coherence', value: result.metrics.coherence, icon: Zap },
                    { label: 'Repetition', value: result.metrics.repetition, icon: Trash2 },
                    { label: 'Diversity', value: result.metrics.diversity, icon: BarChart3 }
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><metric.icon size={12} /> {metric.label}</span>
                        <span>{Math.round(metric.value * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value * 100}%` }}
                          className="h-full bg-indigo-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="False Positive Guard">
                <div className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border",
                  result.metrics.variability > 0.6 ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                )}>
                  {result.metrics.variability > 0.6 ? (
                    <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                  ) : (
                    <Info className="text-amber-600 shrink-0" size={20} />
                  )}
                  <div>
                    <p className={cn(
                      "text-sm font-bold mb-1",
                      result.metrics.variability > 0.6 ? "text-emerald-900" : "text-amber-900"
                    )}>
                      {result.metrics.variability > 0.6 ? 'High Stylistic Variability' : 'Pattern Consistency Detected'}
                    </p>
                    <p className={cn(
                      "text-xs leading-relaxed",
                      result.metrics.variability > 0.6 ? "text-emerald-700" : "text-amber-700"
                    )}>
                      {result.metrics.variability > 0.6 
                        ? 'Our system detected high stylistic variability, significantly reducing the likelihood of a false positive for academic or human-written texts.'
                        : 'The text shows highly structured patterns typical of AI-generated content. Contextual coherence is high, but variability is low.'}
                    </p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Input</p>
              <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Analysis results and visualizations will appear here after processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWorkflow = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card title="Parallel Text Analysis Workflow System">
        <div className="relative py-12 px-6">
          <div className="flex flex-col items-center gap-12">
            {/* Steps Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full relative">
              {[
                { label: 'Input', icon: Search, desc: 'Text Pre-processing' },
                { label: 'Tokenize', icon: Layers, desc: 'Vectorization' },
                { label: 'Inference', icon: Zap, desc: 'Model Processing' },
                { label: 'Aggregate', icon: GitBranch, desc: 'Result Merging' },
                { label: 'Output', icon: ShieldCheck, desc: 'Final Report' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                    workflowStep > i ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : 
                    workflowStep === i ? "bg-white border-2 border-indigo-600 text-indigo-600 animate-pulse" :
                    "bg-slate-100 text-slate-400"
                  )}>
                    <step.icon size={24} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-900">{step.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{step.desc}</p>
                </div>
              ))}
              
              {/* Connecting Lines */}
              <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-100 -z-0 hidden md:block" />
              <motion.div 
                className="absolute top-8 left-0 h-0.5 bg-indigo-600 -z-0 hidden md:block"
                initial={{ width: 0 }}
                animate={{ width: `${(workflowStep / 5) * 100}%` }}
              />
            </div>

            <div className="max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-slate-500 leading-relaxed">
                AuthentiCheck uses a parallel processing pipeline. First, text is cleaned and split into segments. 
                These segments are then tokenized and sent to multiple detection engines (RoBERTa, Gemini, GPT) 
                simultaneously. The results are aggregated using a weighted ensemble method to minimize false positives.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Engine Distribution">
          <div className="space-y-4">
            {[
              { name: 'RoBERTa (Structural)', weight: 60 },
              { name: 'Gemini (Semantic)', weight: 40 }
            ].map((engine, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>{engine.name}</span>
                  <span>{engine.weight}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${engine.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="System Status">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">All Engines Operational</p>
              <p className="text-xs text-slate-500">Last health check: 2 minutes ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Forensic Records</h2>
        <button 
          onClick={() => setHistory([])}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all uppercase tracking-widest"
        >
          <Trash2 size={14} /> Clear All History
        </button>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Result</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No forensic records found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {format(record.timestamp, 'MMM d, HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                        {record.modelUsed}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        record.aiPercentage > 50 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {record.aiPercentage > 50 ? 'AI Generated' : 'Human Written'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                      {record.overallConfidence}%
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{record.inputText}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => { setResult(record); setCurrentView('detection'); }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Play size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderLogs = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card title="System Kernel Output" className="bg-slate-900 border-none">
        <div className="font-mono text-xs space-y-2 h-[600px] overflow-y-auto custom-scrollbar p-2">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 group">
              <span className="text-slate-600 shrink-0">[{format(log.timestamp, 'HH:mm:ss')}]</span>
              <span className={cn(
                "font-bold uppercase shrink-0 w-16",
                log.level === 'info' && "text-blue-400",
                log.level === 'success' && "text-emerald-400",
                log.level === 'warning' && "text-amber-400",
                log.level === 'error' && "text-red-400"
              )}>
                {log.level}
              </span>
              <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-slate-600 italic">No system logs available.</div>}
        </div>
      </Card>
    </div>
  );

  const renderStats = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', value: '12,450', change: '+12%', icon: Search },
          { label: 'Avg Confidence', value: '94.2%', change: '+0.5%', icon: ShieldCheck },
          { label: 'AI Detected', value: '4,210', change: '+8%', icon: Zap },
          { label: 'False Positives', value: '0.02%', change: '-15%', icon: AlertCircle }
        ].map((stat, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-md",
                stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Detection Trends" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', ai: 400, human: 240 },
                { name: 'Tue', ai: 300, human: 139 },
                { name: 'Wed', ai: 200, human: 980 },
                { name: 'Thu', ai: 278, human: 390 },
                { name: 'Fri', ai: 189, human: 480 },
                { name: 'Sat', ai: 239, human: 380 },
                { name: 'Sun', ai: 349, human: 430 },
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="ai" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="human" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Model Usage">
          <div className="space-y-6">
            {[
              { name: 'Gemini Pro', usage: 45, color: 'bg-indigo-600' },
              { name: 'RoBERTa', usage: 30, color: 'bg-indigo-400' },
              { name: 'GPT-4o', usage: 20, color: 'bg-indigo-300' },
              { name: 'Ensemble', usage: 5, color: 'bg-indigo-200' }
            ].map((model, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>{model.name}</span>
                  <span>{model.usage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", model.color)} style={{ width: `${model.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-100 z-50 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">AuthentiCheck</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Text Authenticity Lab</p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem icon={Home} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
          <SidebarItem icon={Search} label="Text Detection" active={currentView === 'detection'} onClick={() => setCurrentView('detection')} />
          <SidebarItem icon={Layers} label="Model Selection" active={currentView === 'models'} onClick={() => setCurrentView('models')} />
          <SidebarItem icon={GitBranch} label="Workflow" active={currentView === 'workflow'} onClick={() => setCurrentView('workflow')} />
          <SidebarItem icon={HistoryIcon} label="History" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
          <SidebarItem icon={Terminal} label="Logs" active={currentView === 'logs'} onClick={() => setCurrentView('logs')} />
          <SidebarItem icon={BarChart3} label="Dataset Stats" active={currentView === 'stats'} onClick={() => setCurrentView('stats')} />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Engine Status</span>
            </div>
            <p className="text-sm font-bold">Operational</p>
            <p className="text-[10px] text-slate-500 mt-1">v2.4.0-stable build</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-8 min-h-screen">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{currentView.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Clock size={16} /> Chat
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Terminal size={16} /> Logs
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={14} />
              </div>
              <span className="text-xs font-bold text-slate-700">v2.4.0-stable</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && renderHome()}
            {currentView === 'detection' && renderDetection()}
            {currentView === 'workflow' && renderWorkflow()}
            {currentView === 'history' && renderHistory()}
            {currentView === 'logs' && renderLogs()}
            {currentView === 'stats' && renderStats()}
            {currentView === 'models' && (
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Available Engines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.values(ModelType).map((m) => (
                        <button
                          key={m}
                          onClick={() => { setSelectedModel(m); }}
                          className={cn(
                            "p-8 text-left rounded-3xl border transition-all group relative overflow-hidden",
                            selectedModel === m 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200" 
                              : "bg-white border-slate-100 text-slate-900 hover:border-indigo-200 hover:shadow-lg"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                            selectedModel === m ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                          )}>
                            <Zap size={24} />
                          </div>
                          <h3 className="text-xl font-bold mb-2">{m}</h3>
                          <p className={cn(
                            "text-xs font-bold uppercase tracking-widest mb-4",
                            selectedModel === m ? "text-indigo-100" : "text-slate-400"
                          )}>
                            {m === ModelType.ROBERTA ? 'Structural Analysis' : 
                             m === ModelType.GEMINI ? 'Semantic Depth' : 
                             m === ModelType.GPT4 ? 'Contextual Nuance' : 'Maximum Precision'}
                          </p>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <p className={cn("text-[10px] font-bold uppercase", selectedModel === m ? "text-indigo-200" : "text-slate-400")}>Accuracy</p>
                              <p className="text-sm font-bold">98.2%</p>
                            </div>
                            <div className="text-center">
                              <p className={cn("text-[10px] font-bold uppercase", selectedModel === m ? "text-indigo-200" : "text-slate-400")}>Latency</p>
                              <p className="text-sm font-bold">&lt;150ms</p>
                            </div>
                          </div>
                          {selectedModel === m && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 size={24} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <Card title="Engine Tuning">
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detection Sensitivity</label>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{sensitivity}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={sensitivity}
                            onChange={(e) => setSensitivity(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Conservative</span>
                            <span>Balanced</span>
                            <span>Strict</span>
                          </div>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Info className="text-indigo-600" size={16} />
                            <p className="text-xs font-bold text-indigo-900 uppercase">Tuning Guide</p>
                          </div>
                          <p className="text-[11px] text-indigo-700 leading-relaxed">
                            Increasing sensitivity will flag more content as AI but may increase false positives. For academic use, we recommend a "Conservative" setting (30-40%).
                          </p>
                        </div>

                        <button 
                          onClick={() => setSensitivity(50)}
                          className="w-full py-3 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all uppercase tracking-widest"
                        >
                          Reset to Balanced Weights
                        </button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 flex gap-1 z-[100]">
        {[
          { view: 'home', icon: Home },
          { view: 'detection', icon: Search },
          { view: 'history', icon: HistoryIcon },
          { view: 'stats', icon: BarChart3 }
        ].map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view as ViewType)}
            className={cn(
              "p-3 rounded-xl transition-all",
              currentView === item.view ? "bg-indigo-600 text-white" : "text-slate-400"
            )}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}
