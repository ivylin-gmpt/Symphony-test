import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { PromptCard } from './components/PromptCard';
import { VideoModal } from './components/VideoModal';
import { AgentView } from './components/AgentView';
import { HERO_VIDEOS, TREND_SECTIONS } from './constants';
import { Sparkles, Search, Play, Plus, TrendingUp, Clapperboard, Video } from 'lucide-react';

// Common badge style for consistency
const pillBaseClass = "absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 z-10 border border-white/10";

// Helper to safely play video
const safePlay = (videoEl: HTMLVideoElement | null) => {
    if (videoEl) {
        const promise = videoEl.play();
        if (promise !== undefined) {
            promise.catch(() => {
                // Auto-play was prevented or interrupted, ignore error
            });
        }
    }
};

// --- Component 1: Top Ad Card (Hero Version) ---
// Large vertical card for the hero section with detailed stats and "Generate my own" CTA.
const TopAdCard = ({ video, onClick }: { video: any, onClick: () => void }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div 
      onClick={onClick} 
      className="min-w-[260px] md:min-w-[300px] h-[500px] md:h-[600px] relative rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 bg-gray-900 shadow-sm"
      onMouseEnter={() => safePlay(videoRef.current)}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {video.videoUrl ? (
        <video 
          ref={videoRef}
          src={video.videoUrl}
          poster={video.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loop
          muted
          playsInline
        />
      ) : (
        <img 
          src={video.image} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 transition-colors"></div>
      
      {/* Stats Badge */}
      {video.stats && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
          <TrendingUp size={12} className="text-[#25F4EE]" />
          {video.stats}
        </div>
      )}

      {/* CTA Button on Hover */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 w-[85%] z-20 transform translate-y-2 group-hover:translate-y-0">
        <button className="w-full bg-[#FE2C55] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#E61B45] shadow-lg">
          <Plus size={18} />
          Generate my own
        </button>
      </div>
      
      {/* Card Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex flex-col gap-2 transform transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="font-bold text-xl leading-tight drop-shadow-sm line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                    <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{video.category}</span>
                </div>
                <span className="text-xs text-white/70">@{video.creator}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- Component 1b: Small Top Ad Card (List Version) ---
// Smaller vertical card for inspiration lists
const SmallTopAdCard = ({ data, onClick }: { data: any, onClick: () => void }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    return (
        <div 
            onClick={onClick} 
            className="min-w-[200px] w-[200px] aspect-[9/16] relative rounded-xl overflow-hidden group cursor-pointer bg-gray-900 border border-gray-200"
            onMouseEnter={() => safePlay(videoRef.current)}
            onMouseLeave={() => {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }}
        >
            {data.videoUrl ? (
                <video
                    ref={videoRef}
                    src={data.videoUrl}
                    poster={data.image}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                />
            ) : (
                <img src={data.image} alt="ad" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Consistent Pill */}
            <div className={`${pillBaseClass} bg-black/60 text-white`}>
                <TrendingUp size={12} className="text-[#25F4EE]" />
                Top Ad
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <p className="text-white text-xs font-semibold mb-1 line-clamp-1">{data.title}</p>
                <p className="text-white/60 text-[10px] line-clamp-1">@{data.brand}</p>
            </div>
        </div>
    );
};

// --- Component 2: Template Card ---
// Smaller vertical card for inspiration lists. Features "Template" label and "Use template" action.
const TemplateCard = ({ data, onClick }: { data: any, onClick: () => void }) => (
  <div onClick={onClick} className="min-w-[200px] w-[200px] aspect-[9/16] relative rounded-xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200">
    <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
    
    {/* Consistent Pill */}
    <div className={`${pillBaseClass} bg-[#4F46E5]/90 text-white`}>
      <Clapperboard size={12} />
      Template
    </div>
    
    {/* Overlay Info */}
    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <p className="text-white text-xs font-semibold mb-1 line-clamp-1">{data.title}</p>
        <p className="text-white/60 text-[10px]">Click to use</p>
    </div>

    {/* Hover Action */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/20">
       <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
         Use template
       </button>
    </div>
  </div>
);

// --- Component 3: Clip Card ---
// Simple video clip card for inspiration lists. Features "Clip" label and Play button.
const ClipCard = ({ data, onClick }: { data: any, onClick: () => void }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div 
      onClick={onClick} 
      className="min-w-[200px] w-[200px] aspect-[9/16] relative rounded-xl overflow-hidden group cursor-pointer bg-gray-900 border border-gray-200"
      onMouseEnter={() => safePlay(videoRef.current)}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
       {data.videoUrl ? (
         <video
           ref={videoRef}
           src={data.videoUrl}
           poster={data.image}
           className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
           muted
           loop
           playsInline
         />
       ) : (
         <img src={data.image} alt="clip" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
       )}
       
       {/* Consistent Pill */}
       <div className={`${pillBaseClass} bg-black/60 text-white`}>
         <Video size={12} />
         Clip
       </div>
       
       {/* Play Button Overlay */}
       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
           <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
               <Play size={20} className="text-white ml-1" fill="white" />
           </div>
       </div>
    </div>
  );
};

// Sub-component for Inspiration Rows
const InspirationRow: React.FC<{ section: any, onCardClick: (item: any) => void }> = ({ section, onCardClick }) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl mb-6 shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
          section.rank === 1 ? 'bg-[#FFE58F] text-[#5B4900]' : 'bg-gray-200 text-gray-600'
        }`}>
          #{section.rank}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            {section.description}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="font-semibold text-gray-900">{section.views}</span>
      </div>
    </div>

    {/* Clips Scroll */}
    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
      {section.clips.map((item: any) => (
        <React.Fragment key={item.id}>
          {item.type === 'template' ? (
            <TemplateCard data={item} onClick={() => onCardClick(item)} />
          ) : item.type === 'top-ad' ? (
            <SmallTopAdCard data={item} onClick={() => onCardClick(item)} />
          ) : (
            <ClipCard data={item} onClick={() => onCardClick(item)} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const App = () => {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [view, setView] = useState<'home' | 'agent'>('home');
  const [agentVideo, setAgentVideo] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGenerateWithAgent = (video: any) => {
    setAgentVideo(video);
    setSelectedCard(null); // Close modal
    setView('agent');
  };

  const handleBackToHome = () => {
    setView('home');
    setAgentVideo(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <TopNav 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        showBackButton={view === 'agent'} 
        onBack={handleBackToHome}
      />
      
      {/* Modal Overlay */}
      <VideoModal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        data={selectedCard}
        onGenerate={handleGenerateWithAgent}
      />

      <div className="flex flex-1">
        {view === 'home' && <Sidebar isOpen={isSidebarOpen} />}
        
        <main className={`flex-1 overflow-x-hidden max-w-[100vw] ${view === 'agent' ? 'p-0' : 'p-6 md:p-8'}`}>
          
          {view === 'agent' && agentVideo ? (
            <AgentView video={agentVideo} onBack={handleBackToHome} />
          ) : (
            <>
              {/* Main Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Make 
                <span className="inline-flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]">
                    <Sparkles size={24} className="text-[#FFE58F]" />
                    TikTok-native
                    <Sparkles size={24} className="text-[#FFE58F]" />
                </span> 
                ads
              </h1>

              {/* Horizontal Scroll Hero Section */}
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory">
                
                {/* 1. Prompt Card (Sticky-ish feel in snap) */}
                <div className="snap-center">
                  <PromptCard />
                </div>

                {/* 2. Top Ad Cards */}
                {HERO_VIDEOS.map((video) => (
                  <div key={video.id} className="snap-center">
                    <TopAdCard video={video} onClick={() => setSelectedCard(video)} />
                  </div>
                ))}
              </div>

              {/* Inspiration Section Header */}
              <div className="mt-12 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get inspired with TikTok Top trends</h2>
                
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 w-64"
                    />
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    All inspiration
                    <span className="text-gray-400">▼</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Industry
                    <span className="text-gray-400">▼</span>
                  </button>
                </div>
              </div>

              {/* Inspiration Rows */}
              <div className="space-y-6">
                {TREND_SECTIONS.map((section) => (
                  <InspirationRow 
                    key={section.id} 
                    section={section} 
                    onCardClick={(item) => setSelectedCard(item)}
                  />
                ))}
              </div>
            </>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default App;