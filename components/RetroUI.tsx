import React from 'react';

// --- Helper for classes ---
const cn = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(' ');

// --- Main Window Shell ---
interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  darkMode?: boolean;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, icon, darkMode }) => {
  return (
    <div className={cn(
      "p-1 win95-border inline-block w-full max-w-5xl relative transition-colors duration-300",
      darkMode ? "bg-[#333333] text-[#00ff00]" : "bg-[#c0c0c0] text-black"
    )}>
      {/* Title Bar */}
      <div className={cn(
        "px-2 py-1 flex items-center justify-between select-none mb-4 transition-colors",
        darkMode ? "bg-[#1a1a1a] text-[#00ff00] border border-[#00ff00]" : "bg-[#000080] text-white"
      )}>
        <div className="flex items-center gap-2 font-bold tracking-wider">
          {icon && <span className="text-xl">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="flex gap-1">
          <MinimizeButton darkMode={darkMode} />
          <MaximizeButton darkMode={darkMode} />
          <CloseButton darkMode={darkMode} />
        </div>
      </div>
      {/* Content Area */}
      <div className="px-2 pb-2">
        {children}
      </div>
    </div>
  );
};

// --- Title Bar Buttons ---
const TitleBtn = ({ label, darkMode }: { label: string, darkMode?: boolean }) => (
  <button className={cn(
    "w-5 h-5 win95-border flex items-center justify-center active:win95-border-pressed font-bold leading-none hover:cursor-pointer transition-colors",
    darkMode ? "bg-[#333] text-[#00ff00] hover:bg-[#444]" : "bg-[#c0c0c0] text-black hover:bg-gray-300"
  )}>
    {label}
  </button>
);
const MinimizeButton = ({ darkMode }: { darkMode?: boolean }) => <TitleBtn label="_" darkMode={darkMode} />;
const MaximizeButton = ({ darkMode }: { darkMode?: boolean }) => <TitleBtn label="□" darkMode={darkMode} />;
const CloseButton = ({ darkMode }: { darkMode?: boolean }) => <TitleBtn label="×" darkMode={darkMode} />;

// --- Panel Container ---
export const RetroPanel: React.FC<{ title: string; children: React.ReactNode; className?: string; darkMode?: boolean }> = ({ title, children, className, darkMode }) => (
  <div className={cn("flex flex-col h-full", className)}>
    <div className="mb-1">
      <span className={cn(
        "px-1 border text-sm font-bold relative top-2 left-2 z-10 transition-colors",
        darkMode ? "bg-[#333] text-[#00ff00] border-[#00ff00]" : "bg-[#c0c0c0] text-black border-gray-500"
      )}>
        {title}
      </span>
    </div>
    <div className={cn(
      "border-2 p-4 pt-6 h-full shadow-[inset_1px_1px_0_#000] transition-colors",
      darkMode ? "bg-[#222] border-[#555] text-[#00ff00]" : "bg-[#dfdfdf] border-white border-b-[#808080] border-r-[#808080] text-black"
    )}>
       {children}
    </div>
  </div>
);

// --- Retro Input ---
interface RetroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  darkMode?: boolean;
}
export const RetroInput: React.FC<RetroInputProps> = ({ label, className, darkMode, ...props }) => (
  <div className="flex flex-col gap-1 mb-3">
    {label && <label className={cn("text-sm font-bold uppercase", darkMode ? "text-[#00ff00]" : "text-gray-800")}>{label}</label>}
    <input 
      className={cn(
        "win95-border-inset px-2 py-1 outline-none focus:ring-1 font-mono text-lg transition-colors",
        darkMode 
          ? "bg-black text-[#00ff00] focus:ring-[#00ff00] placeholder-green-900 border-[#555]" 
          : "bg-white text-black focus:ring-green-500 placeholder-gray-400",
        className
      )}
      {...props}
    />
  </div>
);

// --- Retro Textarea ---
interface RetroTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  darkMode?: boolean;
}
export const RetroTextArea: React.FC<RetroTextAreaProps> = ({ label, className, darkMode, ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    {label && <label className={cn("text-sm font-bold uppercase", darkMode ? "text-[#00ff00]" : "text-gray-800")}>{label}</label>}
    <textarea 
      className={cn(
        "win95-border-inset px-2 py-1 outline-none focus:ring-1 font-mono text-lg resize-none transition-colors",
        darkMode 
          ? "bg-black text-[#00ff00] focus:ring-[#00ff00] placeholder-green-900 border-[#555]" 
          : "bg-white text-black focus:ring-green-500 placeholder-gray-400",
        className
      )}
      {...props}
    />
  </div>
);

// --- Retro Button ---
interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  darkMode?: boolean;
}
export const RetroButton: React.FC<RetroButtonProps> = ({ children, className, variant = 'default', darkMode, ...props }) => {
  const isPrimary = variant === 'primary';
  
  return (
    <button 
      className={cn(
        "win95-border px-4 py-2 font-bold text-sm uppercase active:win95-border-pressed transition-all active:translate-y-[1px] hover:cursor-pointer retro-cursor-pointer",
        // Primary variant styles
        isPrimary && !darkMode && "text-black border-2 border-black animate-pulse-slow bg-[#c0c0c0]",
        isPrimary && darkMode && "text-black bg-[#00ff00] border-2 border-[#00ff00] hover:bg-[#00cc00]",
        
        // Default variant styles
        !isPrimary && !darkMode && "text-black bg-[#c0c0c0]",
        !isPrimary && darkMode && "text-[#00ff00] bg-[#333] hover:bg-[#444]",
        
        className
      )}
      {...props}
    >
      <div className={cn("flex items-center justify-center gap-2", isPrimary ? "text-base" : "")}>
        {children}
      </div>
    </button>
  );
};

// --- Custom 1-5 Slider (Segmented Control) ---
interface RetroSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description?: string;
  darkMode?: boolean;
}
export const RetroSlider: React.FC<RetroSliderProps> = ({ label, value, onChange, description, darkMode }) => {
  const levels = [1, 2, 3, 4, 5];
  
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <div className="w-1/3">
        <label className={cn("text-sm font-bold block", darkMode ? "text-[#00ff00]" : "text-black")}>{label}</label>
        {description && <span className={cn("text-xs", darkMode ? "text-green-700" : "text-gray-500")}>{description}</span>}
      </div>
      <div className="flex-1 flex items-center justify-between gap-1">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              "h-8 flex-1 border-2 font-bold text-sm retro-cursor-pointer transition-colors",
              // Active State
              value >= level && !darkMode && "bg-[#000080] border-[#000080] text-white win95-border-pressed",
              value >= level && darkMode && "bg-[#00ff00] border-[#00ff00] text-black win95-border-pressed",
              // Inactive State
              value < level && !darkMode && "bg-[#c0c0c0] win95-border text-gray-500 hover:bg-gray-300",
              value < level && darkMode && "bg-[#333] win95-border text-green-900 hover:bg-[#444] border-[#555]"
            )}
            title={`Importance: ${level}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Radio Group ---
interface RetroRadioGroupProps {
  value: 'YES' | 'NO' | null;
  onChange: (val: 'YES' | 'NO') => void;
  darkMode?: boolean;
}
export const RetroRadioGroup: React.FC<RetroRadioGroupProps> = ({ value, onChange, darkMode }) => {
  return (
    <div className="flex gap-4 mb-6">
      <div 
        className="flex items-center gap-2 cursor-pointer retro-cursor-pointer group"
        onClick={() => onChange('YES')}
      >
        <div className={cn(
          "w-6 h-6 win95-border-inset flex items-center justify-center transition-colors",
          darkMode ? "bg-black border-[#555]" : "bg-white"
        )}>
           {value === 'YES' && <div className={cn("w-3 h-3", darkMode ? "bg-[#00ff00]" : "bg-black")} />}
        </div>
        <span className={cn(
          "font-bold select-none group-hover:underline",
          darkMode ? "text-[#00ff00]" : "text-black group-hover:text-blue-800"
        )}>
          Lean YES
        </span>
      </div>

      <div 
        className="flex items-center gap-2 cursor-pointer retro-cursor-pointer group"
        onClick={() => onChange('NO')}
      >
        <div className={cn(
          "w-6 h-6 win95-border-inset flex items-center justify-center transition-colors",
          darkMode ? "bg-black border-[#555]" : "bg-white"
        )}>
          {value === 'NO' && <div className={cn("w-3 h-3", darkMode ? "bg-[#00ff00]" : "bg-black")} />}
        </div>
        <span className={cn(
          "font-bold select-none group-hover:underline",
          darkMode ? "text-[#00ff00]" : "text-black group-hover:text-blue-800"
        )}>
          Lean NO
        </span>
      </div>
    </div>
  );
};
