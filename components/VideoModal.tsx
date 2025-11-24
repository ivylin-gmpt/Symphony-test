import React from 'react';
import { X, Play, Volume2, RotateCw, Plus, Link, Copy, Upload, Image as ImageIcon } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onGenerate?: (video: any) => void;
}

// --- Sub-components for specific modal content ---

// 1. Top Ad Details (Based on "Top ad modal.png")
const TopAdDetails = ({ data, onGenerate }: { data: any, onGenerate?: (video: any) => void }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">Video details</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div>
                <p className="text-2xl font-bold text-gray-900">{data.views || '11.8M'}</p>
                <p className="text-xs text-gray-500">Video Views</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{data.engagement || '0.07%'}</p>
                <p className="text-xs text-gray-500">Engagement</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{data.ctr || 'Top 38%'}</p>
                <p className="text-xs text-gray-500">CTR</p>
            </div>
             <div>
                <p className="text-2xl font-bold text-gray-900">{data.viewRate || 'Top 46%'}</p>
                <p className="text-xs text-gray-500">6s view rate</p>
            </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
                <p className="font-medium text-gray-900">{data.brand || '-'}</p>
                <p className="text-xs text-gray-500 mt-1">Brand Name</p>
            </div>
             <div>
                <p className="font-medium text-gray-900">{data.region || 'Global'}</p>
                <p className="text-xs text-gray-500 mt-1">Region</p>
            </div>
             <div>
                <p className="font-medium text-gray-900">{data.industry || 'Other'}</p>
                <p className="text-xs text-gray-500 mt-1">Industry</p>
            </div>
        </div>

        <div className="flex items-center gap-1 text-[#00838F] text-sm font-medium mb-8 cursor-pointer hover:underline">
            Landing page <Link size={14} />
        </div>

        <h3 className="text-lg font-bold mb-4">Creative approach</h3>
        <div className="space-y-3">
            {data.creativeApproach ? (
                data.creativeApproach.map((tag: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="text-xs text-gray-500">{tag.label}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 pl-4">{tag.value}</p>
                    </div>
                ))
            ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">No specific creative tags available.</p>
                </div>
            )}
        </div>
    </div>

    {/* Footer Action */}
    <div className="p-6 border-t border-gray-100">
        <button 
            onClick={() => onGenerate && onGenerate(data)}
            className="w-full bg-[#009688] hover:bg-[#00897B] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
            Generate your own with agent
        </button>
    </div>
  </div>
);

// 2. Template Details (Updated to match screenshot)
const TemplateDetails = ({ data, onGenerate }: { data: any, onGenerate?: (video: any) => void }) => (
  <div className="flex flex-col h-full relative font-sans">
    <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Video details</h2>

        <div className="space-y-6">
            {/* Description */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {data.description || 'Showcase a single "hero" as versatile by presenting it in four distinct, fully-styled outfits. Use a fast-paced, "magic change" jump-cut sequence within a single, static studio setting'}
                </p>
            </div>

            {/* Tool */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Tool</h3>
                <p className="text-sm text-gray-600">{data.tool || 'Agent template'}</p>
            </div>

            {/* Industry */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Industry</h3>
                <p className="text-sm text-gray-600">{data.industry || 'Consumer goods'}</p>
            </div>

            {/* Use cases */}
            <div>
                 <h3 className="text-sm font-semibold text-gray-900 mb-2">Use cases</h3>
                 <div className="flex flex-wrap gap-2">
                    {data.useCases ? (
                        data.useCases.map((uc: string, idx: number) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">
                                {uc}
                            </span>
                        ))
                    ) : (
                        <>
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">Viral ads</span>
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">Product demo/showcase</span>
                        </>
                    )}
                 </div>
            </div>

             {/* Inputs */}
             <div>
                 <h3 className="text-sm font-semibold text-gray-900 mb-3">Inputs</h3>
                 <div className="grid grid-cols-2 gap-3 w-3/4"> {/* Constrained width for the inputs grid to look like screenshot */}
                     {[
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400&auto=format&fit=crop'
                     ].map((img, i) => (
                         <div key={i} className="aspect-[3/5] bg-gray-50 rounded-lg border border-gray-100 overflow-hidden relative">
                             <img src={img} alt="Input placeholder" className="w-full h-full object-cover" />
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    </div>

    {/* Footer Action */}
    <div className="p-8 border-t border-gray-100">
        <button 
            onClick={() => onGenerate && onGenerate(data)}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
            Create your own
        </button>
    </div>
  </div>
);

// 3. Clip Details (Based on "T2V.png")
const ClipDetails = ({ data, onGenerate }: { data: any, onGenerate?: (video: any) => void }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">Video details</h2>

        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Name</h3>
                <p className="text-sm text-gray-600">{data.title}</p>
            </div>

             <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Tool</h3>
                <p className="text-sm text-gray-600">{data.tool || 'Text to video'}</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900">Settings</h3>
                </div>
                
                <div className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                         <span className="text-xs text-gray-500">Prompt</span>
                         <Copy size={12} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed">
                        {data.prompt || 'No prompt available for this clip.'}
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Footer Action */}
    <div className="p-6 border-t border-gray-100">
        <button 
            onClick={() => onGenerate && onGenerate(data)}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-medium transition-colors"
        >
            Create your own
        </button>
    </div>
  </div>
);


export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, data, onGenerate }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button - Updated style for white background */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
        >
            <X size={20} />
        </button>

        {/* LEFT: Video Player Area */}
        <div className="w-1/2 bg-black relative flex items-center justify-center bg-gray-900">
            {data.videoUrl ? (
                <video 
                    src={data.videoUrl} 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    controlsList="nodownload"
                />
            ) : (
                <img 
                    src={data.image} 
                    alt={data.title} 
                    className="w-full h-full object-contain opacity-90"
                />
            )}
            
            {/* Video Controls Overlay (Only show if not a real video player, though native controls cover most cases) */}
            {!data.videoUrl && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer group">
                        <div className="w-1/3 h-full bg-white rounded-full relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <button className="hover:text-gray-300"><Play size={20} fill="currentColor" /></button>
                            <button className="hover:text-gray-300"><RotateCw size={18} /></button>
                            <button className="hover:text-gray-300"><Volume2 size={20} /></button>
                            <span className="text-xs font-mono text-gray-300">00:03 / 01:30</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* RIGHT: Details Area */}
        <div className="w-1/2 bg-white relative">
            {data.type === 'top-ad' && <TopAdDetails data={data} onGenerate={onGenerate} />}
            {data.type === 'template' && <TemplateDetails data={data} onGenerate={onGenerate} />}
            {data.type === 'clip' && <ClipDetails data={data} onGenerate={onGenerate} />}
            
            {/* Fallback if type is unknown */}
            {!['top-ad', 'template', 'clip'].includes(data.type) && (
                <div className="p-8 text-center text-gray-500">Details not available</div>
            )}
        </div>

      </div>
    </div>
  );
};
