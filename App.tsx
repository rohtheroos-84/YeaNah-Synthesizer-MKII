import React, { useState, useEffect } from 'react';
import { RetroWindow, RetroPanel, RetroInput, RetroTextArea, RetroSlider, RetroButton, RetroRadioGroup } from './components/RetroUI';
import CRTOverlay from './components/CRTOverlay';
import { DecisionInput, DecisionResult, HistoryItem, FACTOR_LABELS } from './types';
import { calculateDecision } from './services/decisionLogic';
import { Monitor, Save, RotateCcw, Copy, Info, Home, ArrowRight, Play, Moon, Sun } from 'lucide-react';

// --- VIEW TYPES ---
type View = 'HOME' | 'APP' | 'ABOUT';

const INITIAL_INPUT: DecisionInput = {
  question: '',
  context: '',
  factors: {
    time: 1,
    money: 1,
    risk: 1,
    energy: 1,
    upside: 1,
  },
  leaning: null
};

const LOADING_MESSAGES = [
  "Initializing heuristics...",
  "Loading constraints...",
  "Calculating opportunity costs...",
  "Weighing short term vs long term...",
  "Detecting biases...",
  "Finalizing recommendation..."
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [input, setInput] = useState<DecisionInput>(INITIAL_INPUT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleInputChange = (field: keyof DecisionInput, value: unknown) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleFactorChange = (factor: keyof typeof input.factors, value: number) => {
    setInput(prev => ({
      ...prev,
      factors: { ...prev.factors, [factor]: value }
    }));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Apply dark mode class to body for scrollbars
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#008080';
    }
  }, [darkMode]);

  const runAnalysis = () => {
    if (!input.question.trim()) {
      alert("ERROR: Decision question required.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const percentage = Math.min((step / 40) * 100, 100); 
      setProgress(percentage);
      
      if (step % 7 === 0) {
        const msgIndex = Math.floor((step / 40) * LOADING_MESSAGES.length);
        setLoadingMsg(LOADING_MESSAGES[Math.min(msgIndex, LOADING_MESSAGES.length - 1)]);
      }

      if (step >= 40) {
        clearInterval(interval);
        finalizeAnalysis();
      }
    }, 40);
  };

  const finalizeAnalysis = () => {
    const analysisResult = calculateDecision(input);
    setResult(analysisResult);
    setIsAnalyzing(false);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      question: input.question,
      timestamp: new Date().toLocaleTimeString(),
      recommendation: analysisResult.recommendation,
      fullResult: analysisResult
    };
    
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 3));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult(item.fullResult);
    setInput(prev => ({ ...prev, question: item.question })); 
  };

  const reset = () => {
    setInput(INITIAL_INPUT);
    setResult(null);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `
[YeaNah-Synthesizer Result]
❓ Question: ${input.question}
✅ Recommendation: ${result.recommendation}
💡 Reason: ${result.reasoning}
📊 Primary Driver: ${result.primaryDriver}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // --- HOME VIEW ---
  if (currentView === 'HOME') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#008080]'}`}>
        <CRTOverlay />
        <div className="absolute top-4 right-4 z-50">
           <button onClick={toggleDarkMode} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-all retro-cursor-pointer">
             {darkMode ? <Sun size={24} /> : <Moon size={24} />}
           </button>
        </div>

        <div className="relative z-10 text-center animate-in zoom-in duration-500">
           <div className={`p-1 win95-border inline-block mb-8 ${darkMode ? 'bg-[#333]' : 'bg-[#c0c0c0]'}`}>
             <div className={`p-8 win95-border-inset ${darkMode ? 'bg-black text-[#00ff00]' : 'bg-[#000080] text-white'}`}>
               <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-widest drop-shadow-md">
                 YeaNah<br/>Synthesizer
               </h1>
               <p className={`text-lg opacity-80 mb-6 ${darkMode ? 'text-[#00ff00]' : 'text-white'}`}>v1.0 // {darkMode ? 'CYBER' : '1995'} EDITION</p>
               <div className={`h-px w-full mb-6 ${darkMode ? 'bg-[#00ff00]/50' : 'bg-white/30'}`}></div>
               <p className="text-sm max-w-md mx-auto mb-8 font-sans leading-relaxed">
                 Paralyzed by choice? Input your constraints. 
                 Get a binary recommendation in under 2 minutes.
                 Logic based. Emotion free.
               </p>
               <button 
                 onClick={() => setCurrentView('APP')}
                 className={`px-8 py-3 font-bold text-xl win95-border active:win95-border-pressed transition-colors flex items-center gap-2 mx-auto retro-cursor-pointer ${darkMode ? 'bg-[#00ff00] text-black hover:bg-[#00cc00]' : 'bg-[#c0c0c0] text-black hover:bg-white'}`}
               >
                 <Play size={20} fill="currentColor" /> START SYSTEM
               </button>
             </div>
           </div>
           
           <div className="flex gap-4 justify-center">
             <button onClick={() => setCurrentView('ABOUT')} className={`underline retro-cursor-pointer ${darkMode ? 'text-[#00ff00]' : 'text-white hover:text-[#00ff00]'}`}>
               About the Algorithm
             </button>
           </div>
        </div>
      </div>
    );
  }

  // --- ABOUT VIEW ---
  if (currentView === 'ABOUT') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-mono relative transition-colors duration-500 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#008080]'}`}>
        <CRTOverlay />
        <div className="relative z-10 w-full max-w-2xl">
          <RetroWindow title="About - Decision Logic.txt" darkMode={darkMode}>
             <div className={`p-4 min-h-[400px] ${darkMode ? 'bg-black text-[#00ff00]' : 'bg-white text-black'}`}>
               <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${darkMode ? 'border-[#00ff00]' : 'border-black'}`}>HOW IT WORKS</h2>
               <div className="space-y-4 text-lg">
                 <p>
                   The YeaNah-Synthesizer uses a weighted scoring heuristic designed to cut through analysis paralysis.
                 </p>
                 <div className={`p-4 border font-mono text-sm ${darkMode ? 'bg-[#111] border-[#00ff00] text-[#00ff00]' : 'bg-gray-100 border-gray-400 text-black'}`}>
                   <p className="font-bold mb-2">THE FORMULA:</p>
                   <p className="mb-1">Benefit Score = (Upside × 2) + Money + (Gut_Yes ? 2 : 0)</p>
                   <p>Cost Score    = Time + Energy + Risk + (Gut_No ? 2 : 0)</p>
                 </div>
                 <p>
                   <strong>Why this works:</strong> We double-weight "Long Term Upside" because humans naturally undervalue the future compared to immediate pain (time/energy).
                 </p>
                 <p>
                   We also explicitly calculate your "Gut Feeling" into the score. Your intuition is data, not just noise.
                 </p>
               </div>
               <div className="mt-8 flex justify-end">
                 <RetroButton onClick={() => setCurrentView('HOME')} darkMode={darkMode}>
                   Close & Return
                 </RetroButton>
               </div>
             </div>
          </RetroWindow>
        </div>
      </div>
    );
  }

  // --- MAIN APP VIEW ---
  return (
    <div className={`min-h-screen p-2 md:p-8 flex items-center justify-center relative font-mono text-lg transition-colors duration-500 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#008080]'}`}>
      <CRTOverlay />
      
      <div className="relative z-10 w-full max-w-6xl">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('HOME')} 
              className={`flex items-center gap-1 retro-cursor-pointer text-sm font-bold px-2 py-1 win95-border transition-colors ${darkMode ? 'bg-[#333] text-[#00ff00] hover:bg-[#444]' : 'bg-[#000080] text-white hover:text-gray-200'}`}
            >
              <Home size={14} /> MAIN MENU
            </button>
            <button 
               onClick={() => setCurrentView('ABOUT')} 
               className={`flex items-center gap-1 retro-cursor-pointer text-sm font-bold px-2 py-1 win95-border transition-colors ${darkMode ? 'bg-[#333] text-[#00ff00] hover:bg-[#444]' : 'bg-[#000080] text-white hover:text-gray-200'}`}
            >
              <Info size={14} /> HELP
            </button>
          </div>
          
          <button 
             onClick={toggleDarkMode} 
             className={`flex items-center gap-1 retro-cursor-pointer text-sm font-bold px-2 py-1 win95-border transition-colors ${darkMode ? 'bg-[#333] text-[#00ff00] hover:bg-[#444]' : 'bg-[#000080] text-white hover:text-gray-200'}`}
             title="Toggle Night Mode"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />} {darkMode ? "DAY MODE" : "NIGHT MODE"}
          </button>
        </div>

        <RetroWindow title="YeaNah-Synthesizer.exe" icon={<Monitor size={20} />} darkMode={darkMode}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LEFT COLUMN: INPUT */}
            <div className="h-full">
              <RetroPanel title="Decision Input" className="h-full" darkMode={darkMode}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <RetroInput 
                      label="Decision Question *" 
                      placeholder="Should I..." 
                      value={input.question}
                      onChange={(e) => handleInputChange('question', e.target.value)}
                      darkMode={darkMode}
                    />
                    
                    <RetroTextArea 
                      label="Context" 
                      placeholder="Brief background..." 
                      rows={2}
                      value={input.context}
                      onChange={(e) => handleInputChange('context', e.target.value)}
                      darkMode={darkMode}
                    />
                    
                    <div className={`mt-4 mb-2 border-b-2 pb-1 flex justify-between items-end ${darkMode ? 'border-[#00ff00] text-[#00ff00]' : 'border-gray-400 text-gray-700'}`}>
                      <h3 className="uppercase font-bold">Constraints</h3>
                      <span className={`text-xs ${darkMode ? 'text-green-700' : 'text-gray-500'}`}>1=Low, 5=High</span>
                    </div>

                    <div className="space-y-1">
                      <RetroSlider 
                        label="Time" 
                        description="Effort"
                        value={input.factors.time} 
                        onChange={(v) => handleFactorChange('time', v)}
                        darkMode={darkMode}
                      />
                      <RetroSlider 
                        label="Money" 
                        description="Cost"
                        value={input.factors.money} 
                        onChange={(v) => handleFactorChange('money', v)}
                        darkMode={darkMode}
                      />
                      <RetroSlider 
                        label="Risk" 
                        description="Uncertainty"
                        value={input.factors.risk} 
                        onChange={(v) => handleFactorChange('risk', v)}
                        darkMode={darkMode}
                      />
                      <RetroSlider 
                        label="Energy" 
                        description="Stress"
                        value={input.factors.energy} 
                        onChange={(v) => handleFactorChange('energy', v)}
                        darkMode={darkMode}
                      />
                      <RetroSlider 
                        label="Upside" 
                        description="Value"
                        value={input.factors.upside} 
                        onChange={(v) => handleFactorChange('upside', v)}
                        darkMode={darkMode}
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className={`uppercase font-bold mb-2 ${darkMode ? 'text-[#00ff00]' : 'text-gray-700'}`}>Initial Inclination</h3>
                      <RetroRadioGroup 
                        value={input.leaning}
                        onChange={(val) => handleInputChange('leaning', val)}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  <div className={`flex gap-2 mt-4 pt-4 border-t ${darkMode ? 'border-[#555]' : 'border-gray-400'}`}>
                    <RetroButton 
                      className="flex-1 py-4" 
                      variant="primary"
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      darkMode={darkMode}
                    >
                      {isAnalyzing ? "Processing..." : "Run Analysis"}
                    </RetroButton>
                    <RetroButton onClick={reset} title="Reset" darkMode={darkMode}>
                      <RotateCcw size={18} />
                    </RetroButton>
                  </div>
                </div>
              </RetroPanel>
            </div>

            {/* RIGHT COLUMN: REPORT */}
            <div className="h-full flex flex-col gap-4">
              <RetroPanel title="Decision Report" className="flex-1 min-h-[500px]" darkMode={darkMode}>
                {isAnalyzing ? (
                  <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>
                    <h3 className="text-xl font-bold mb-4 animate-pulse">ANALYZING INPUTS</h3>
                    <div className={`w-full h-8 win95-border-inset p-1 mb-2 ${darkMode ? 'bg-[#111] border-[#555]' : 'bg-gray-300'}`}>
                      <div 
                        className={`h-full ${darkMode ? 'bg-[#00ff00]' : 'bg-[#000080]'}`}
                        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                      />
                    </div>
                    <p className={`font-mono text-sm ${darkMode ? 'text-green-600' : 'text-gray-600'}`}>{loadingMsg}</p>
                  </div>
                ) : !result ? (
                  <div className={`h-full flex flex-col items-center justify-center opacity-40 ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>
                     <Monitor size={64} className="mb-4" />
                     <p className="text-center max-w-xs">
                       Waiting for input data...<br/>
                       Enter parameters and run analysis to generate report.
                     </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pr-1">
                    
                    {/* Header Info */}
                    <div className={`border-b pb-2 mb-2 flex justify-between items-end ${darkMode ? 'border-[#555] text-green-700' : 'border-gray-400 text-gray-500'}`}>
                      <span className="text-xs">REF: {Date.now().toString().slice(-6)}</span>
                      <div className="flex gap-2">
                         <button 
                           onClick={copyToClipboard}
                           className={`text-xs flex items-center gap-1 border px-1 retro-cursor-pointer ${darkMode ? 'bg-black text-[#00ff00] border-[#00ff00] hover:bg-[#111]' : 'bg-white text-black border-gray-400 hover:bg-gray-100'}`}
                         >
                           {copyFeedback ? "COPIED!" : <><Copy size={10} /> COPY REPORT</>}
                         </button>
                      </div>
                    </div>

                    {/* Result Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Primary Driver */}
                      <div className={`col-span-2 win95-border-inset p-2 ${darkMode ? 'bg-black' : 'bg-white'}`}>
                        <h4 className={`text-xs font-bold inline-block px-1 mb-1 ${darkMode ? 'bg-[#003300] text-[#00ff00]' : 'bg-gray-200 text-black'}`}>PRIMARY DRIVER</h4>
                        <p className={`text-lg font-bold ${darkMode ? 'text-[#00ff00]' : 'text-[#000080]'}`}>{result.primaryDriver}</p>
                      </div>

                      {/* Upside */}
                      <div className={`win95-border-inset p-2 ${darkMode ? 'bg-black' : 'bg-white'}`}>
                         <h4 className={`text-xs font-bold inline-block px-1 mb-1 ${darkMode ? 'bg-[#003300] text-[#00ff00]' : 'bg-green-100 text-black'}`}>UPSIDE</h4>
                         <ul className={`text-sm list-disc pl-4 leading-tight ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>
                           {result.upsideSnapshot.map((t, i) => <li key={i}>{t}</li>)}
                         </ul>
                      </div>

                      {/* Downside */}
                      <div className={`win95-border-inset p-2 ${darkMode ? 'bg-black' : 'bg-white'}`}>
                         <h4 className={`text-xs font-bold inline-block px-1 mb-1 ${darkMode ? 'bg-[#330000] text-red-500' : 'bg-red-100 text-black'}`}>DOWNSIDE</h4>
                         <ul className={`text-sm list-disc pl-4 leading-tight ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>
                           {result.downsideSnapshot.map((t, i) => <li key={i}>{t}</li>)}
                         </ul>
                      </div>

                      {/* Reasoning Box (New) */}
                      <div className={`col-span-2 win95-border-inset p-2 border-l-4 ${darkMode ? 'bg-[#111] border-l-[#00ff00]' : 'bg-yellow-50 border-yellow-400'}`}>
                        <h4 className={`text-xs font-bold inline-block px-1 mb-1 ${darkMode ? 'bg-[#003300] text-[#00ff00]' : 'bg-yellow-200 text-black'}`}>THE "WHY"</h4>
                        <p className={`text-sm leading-snug ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>{result.reasoning}</p>
                      </div>

                      {/* Second Order */}
                      <div className={`col-span-2 win95-border-inset p-2 ${darkMode ? 'bg-black' : 'bg-white'}`}>
                        <h4 className={`text-xs font-bold inline-block px-1 mb-1 ${darkMode ? 'bg-[#003300] text-[#00ff00]' : 'bg-gray-200 text-black'}`}>2ND ORDER EFFECT</h4>
                        <p className={`text-sm ${darkMode ? 'text-[#00ff00]' : 'text-black'}`}>{result.secondOrderEffect}</p>
                      </div>
                    </div>

                    {/* Final Recommendation */}
                    <div className="flex-1 flex items-center justify-center mt-2 min-h-[100px]">
                      <div className={`win95-border w-full p-4 text-center ${
                          darkMode 
                          ? (result.recommendation === 'YES' ? 'bg-[#002200]' : 'bg-[#220000]') 
                          : (result.recommendation === 'YES' ? 'bg-green-100' : 'bg-red-100')
                        }`}>
                        <span className={`block text-sm font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-green-700' : 'text-gray-500'}`}>Recommendation</span>
                        <span className={`text-6xl font-black ${
                            darkMode
                            ? (result.recommendation === 'YES' ? 'text-[#00ff00] drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]')
                            : (result.recommendation === 'YES' ? 'text-green-700' : 'text-red-700')
                          }`}>
                          {result.recommendation}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </RetroPanel>

              {/* HISTORY PANEL */}
              {history.length > 0 && (
                 <div className={`p-2 win95-border ${darkMode ? 'bg-[#333] text-[#00ff00]' : 'bg-[#c0c0c0] text-black'}`}>
                   <h4 className="text-xs font-bold mb-2 px-1">SESSION HISTORY</h4>
                   <div className="flex flex-col gap-1">
                     {history.map((h) => (
                       <button 
                         key={h.id} 
                         onClick={() => loadHistoryItem(h)}
                         className={`flex items-center justify-between px-2 py-1 text-sm border retro-cursor-pointer text-left w-full group ${
                           darkMode 
                           ? 'bg-black border-[#555] hover:bg-[#111] text-[#00ff00]' 
                           : 'bg-white border-gray-200 hover:bg-blue-50 text-black'
                         }`}
                       >
                         <span className={`truncate flex-1 font-bold ${darkMode ? 'group-hover:text-white' : 'group-hover:text-blue-600'}`}>{h.question}</span>
                         <span className={`font-bold px-1 ml-2 ${
                           h.recommendation === 'YES' 
                             ? (darkMode ? 'text-[#00ff00]' : 'text-green-600') 
                             : (darkMode ? 'text-red-500' : 'text-red-600')
                         }`}>
                           {h.recommendation}
                         </span>
                       </button>
                     ))}
                   </div>
                 </div>
              )}
            </div>

          </div>
        </RetroWindow>
      </div>
    </div>
  );
}
