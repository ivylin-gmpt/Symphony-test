import React, { useState } from 'react';
import { Sparkles, ArrowUp, Plus, SlidersHorizontal } from 'lucide-react';

export const PromptCard = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="min-w-[320px] w-[320px] md:min-w-[400px] md:w-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px] md:h-[600px] p-5 relative group transition-all hover:shadow-md">
      {/* Top Options */}
      <div className="flex gap-2 mb-4">
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Plus size={20} className="text-gray-600" />
        </button>
        <button className="flex items-center gap-2 px-4 h-10 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
          <Plus size={16} />
          TikTok trend
        </button>
      </div>

      {/* Input Area */}
      <textarea
        className="w-full flex-1 resize-none outline-none text-lg text-gray-600 placeholder:text-gray-400 bg-transparent font-light"
        placeholder="Give me one product image, share your idea, and add a TikTok trend to help your ad perform better"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Bottom Actions */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-transparent">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <SlidersHorizontal size={20} />
        </button>
        
        <button 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            prompt.length > 0 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
          disabled={prompt.length === 0}
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      {/* Visual cue for focus */}
      <div className="absolute inset-0 border-2 border-transparent group-focus-within:border-gray-200 pointer-events-none rounded-2xl transition-colors"></div>
    </div>
  );
};