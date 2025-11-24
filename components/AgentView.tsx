
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, Plus, Image as ImageIcon, X, Edit2, FileText, HelpCircle, GripVertical, Trash2, Save, FileVideo, Loader2, CheckCircle2, Download, RefreshCcw, MoreVertical, Play, ArrowLeft, ExternalLink, ChevronDown, SlidersHorizontal, LayoutTemplate, Upload } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AgentViewProps {
  video: any;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'system' | 'user';
  content?: string;
  type?: 'welcome' | 'brief' | 'text' | 'storyboard_card' | 'video_result';
  data?: any;
}

interface ProductInfo {
  name: string;
  description: string;
  market: {
    region: string;
    language: string;
    audience: string;
  };
  guidelines: {
    tone: string;
    restrictions: string;
  };
  sources?: { uri: string; title: string }[];
  imageUrl?: string;
  images?: string[];
}

interface StoryboardFrame {
  id: string;
  number: number;
  content: string;
}

export const AgentView: React.FC<AgentViewProps> = ({ video, onBack }) => {
  // Common State
  const [prompt, setPrompt] = useState(video.prompt || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- TEMPLATE VIEW STATE ---
  const [templateImages, setTemplateImages] = useState<string[]>([]);
  const [templateFiles, setTemplateFiles] = useState<File[]>([]);
  const templateInputRef = useRef<HTMLInputElement>(null);
  
  // Template Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<'holiday' | 'lighting' | null>(null);
  const [holidayOptions, setHolidayOptions] = useState<string[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState('Christmas');
  const [selectedLighting, setSelectedLighting] = useState('Studio lighting');
  const [isHolidayLoading, setIsHolidayLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const lightingOptions = ['Studio lighting', 'Golden hour', 'Neon atmosphere', 'Soft daylight', 'Cinematic dark', 'Natural sunlight'];


  // --- TOP AD AGENT STATE ---
  const [stage, setStage] = useState<'brief' | 'storyboard' | 'video_generating' | 'video_complete'>('brief');
  const [messages, setMessages] = useState<Message[]>([{ id: '1', role: 'system', type: 'welcome' }]);
  const [briefData, setBriefData] = useState<ProductInfo | null>(null);
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);

  // --- CLIP GENERATOR STATE ---
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);
  const [isClipGenerating, setIsClipGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'image-to-video' | 'text-to-video'>('image-to-video');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  // Check if we are in the initial input state of a template
  const isTemplateInput = video.type === 'template' && stage === 'brief' && messages.length === 1 && !isGenerating;

  // Layout Logic for Top Ad Agent
  const isLayoutCentered = messages.length === 1;

  // --- HANDLERS (Dropdowns) ---
  useEffect(() => {
    // Close dropdowns when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleHolidayDropdown = async () => {
    if (activeDropdown === 'holiday') {
        setActiveDropdown(null);
        return;
    }
    setActiveDropdown('holiday');
    
    // Fetch if empty
    if (holidayOptions.length === 0) {
        setIsHolidayLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'List 5 upcoming major commercial holidays or seasons globally. Return only the names as a comma separated list.',
                config: { tools: [{googleSearch: {}}] }
            });
            const text = response.text || "";
            const list = text.split(/,|\n/).map(s => s.trim()).filter(s => s.length > 2);
            // Dedupe
            const unique = [...new Set(list)];
            setHolidayOptions(unique.length > 0 ? unique : ['Christmas', 'New Year', 'Valentine\'s Day', 'Easter', 'Halloween']);
        } catch (e) {
            console.error("Error fetching holidays:", e);
            setHolidayOptions(['Christmas', 'New Year', 'Valentine\'s Day', 'Easter', 'Halloween']);
        } finally {
            setIsHolidayLoading(false);
        }
    }
  };

  const toggleLightingDropdown = () => {
      setActiveDropdown(activeDropdown === 'lighting' ? null : 'lighting');
  };

  const selectHoliday = (h: string) => {
      setSelectedHoliday(h);
      setActiveDropdown(null);
  };

  const selectLighting = (l: string) => {
      setSelectedLighting(l);
      setActiveDropdown(null);
  };


  // --- HANDLERS (Common) ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  // --- HANDLERS (Template) ---

  const handleTemplateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTemplateImages(prev => [...prev, url]);
      setTemplateFiles(prev => [...prev, file]);
      e.target.value = ''; // Reset so same file can be selected if needed
    }
  };

  const removeTemplateImage = (index: number) => {
    setTemplateImages(prev => prev.filter((_, i) => i !== index));
    setTemplateFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerTemplateInput = () => {
    templateInputRef.current?.click();
  };


  // --- HANDLERS (Clip Generator - Placeholder) ---
  
  const handleClipGenerate = async () => {
      // Logic for placeholders instead of Veo API
      if (!prompt && generationMode === 'text-to-video') return;
      if (generationMode === 'image-to-video' && !video.image && !selectedFile) return;

      setIsClipGenerating(true);
      setGeneratedResults([]); 
      
      // Simulate API delay and return placeholders
      setTimeout(() => {
          const placeholders = [
             'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
             'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
             'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
             'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
          ];
          setGeneratedResults(placeholders);
          setIsClipGenerating(false);
      }, 3000);
  };

  // --- HANDLERS (Top Ad Agent & Nano Banana) ---

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : prompt;
    if (!textToSend && !selectedFile) return;

    // 1. Add User Message
    const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        type: 'text',
        content: textToSend,
        data: { 
            file: selectedFile, 
            previewUrl: previewUrl,
            fileName: selectedFile?.name || 'product_image_1.jpg'
        }
    };
    setMessages(prev => [...prev, newUserMessage]);
    if (typeof textOverride !== 'string') setPrompt('');
    setIsGenerating(true);

    try {
        let description = textToSend; 

        // 2. Image Analysis (Mocked)
        // If a file is selected, we first get a visual description
        if (selectedFile) {
             // Simulate network delay
             await new Promise(r => setTimeout(r, 1500));
             
             // Mock description matching the screenshot requirement
             description = "Luxury skincare serum bottle on white marble surface, surrounded by fresh rose petals and water droplets, soft morning light streaming through, minimalist aesthetic.";
             
             const descMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'system',
                type: 'text',
                content: description
            };
            setMessages(prev => [...prev, descMsg]);
            
            // Allow a small delay for UI to update before starting next step
            await new Promise(r => setTimeout(r, 800));
        }

        // 3. Product Brief Generation (Using Gemini + Google Search)
        // Automatically kick off brief generation if we are in the 'brief' stage
        if (stage === 'brief') {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             
             const searchPrompt = `Research and generate a detailed product brief for: "${description}". 
             Use Google Search to find real information if the input mentions a known brand or product type.
             If the input is generic, generate a realistic product brief based on current market trends for such products.
             
             Return the result as a raw JSON object (no markdown formatting) with this structure:
             {
               "name": "Product Name",
               "description": "Detailed description of the product, its key features, and benefits.",
               "market": { 
                 "region": "Target Region (e.g., Malaysia, US, Global)", 
                 "language": "Primary Language", 
                 "audience": "Target Audience description" 
               },
               "guidelines": { 
                 "tone": "Brand Tone (e.g., Professional, Fun, Luxury)", 
                 "restrictions": "Any common restrictions or safety guidelines" 
               }
             }`;

             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: searchPrompt,
                config: {
                    tools: [{googleSearch: {}}]
                }
             });

             // Extract Sources
             const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
             const sources = groundingChunks.map((chunk: any) => {
                if (chunk.web) {
                    return { uri: chunk.web.uri, title: chunk.web.title };
                }
                return null;
             }).filter((s: any) => s !== null);

             // Parse JSON
             let extractedInfo: ProductInfo | null = null;
             try {
                let jsonStr = response.text || "{}";
                // Cleanup potentially returned markdown code blocks
                jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                
                extractedInfo = {
                    ...parsed,
                    imageUrl: previewUrl || video.image || "https://images.unsplash.com/photo-1585232351009-140992387f71?q=80&w=200&h=200",
                    images: [previewUrl || video.image || "https://images.unsplash.com/photo-1585232351009-140992387f71?q=80&w=200&h=200"].filter(Boolean) as string[],
                    sources: sources
                };
             } catch (e) {
                 console.error("Failed to parse JSON from Gemini response", e);
                 // Fallback if parsing fails but text exists
                 extractedInfo = {
                    name: "Generated Product Brief",
                    description: response.text || "Could not generate description.",
                    market: { region: "Global", language: "English", audience: "General" },
                    guidelines: { tone: "Standard", restrictions: "None" },
                    imageUrl: previewUrl || video.image || "https://images.unsplash.com/photo-1585232351009-140992387f71?q=80&w=200&h=200",
                    images: [previewUrl || video.image || "https://images.unsplash.com/photo-1585232351009-140992387f71?q=80&w=200&h=200"].filter(Boolean) as string[],
                    sources: sources
                };
             }
             
             setBriefData(extractedInfo);
             
             const briefMsg: Message = {
                  id: (Date.now() + 2).toString(),
                  role: 'system',
                  type: 'brief',
                  content: 'Done! I\'ve researched and generated a product brief. Review the details below.',
            };
            setMessages(prev => [...prev, briefMsg]);
        } else {
             // Handle other stages (storyboard feedback etc)
              const systemResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'system',
                    type: 'text',
                    content: 'I\'ve updated the project based on your feedback.',
                };
                setMessages(prev => [...prev, systemResponse]);
        }
        
        // Clear file input only after processing is done to keep preview during generation
        clearFile();

    } catch (error) {
        console.error("Error:", error);
         const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'system',
            type: 'text',
            content: "Sorry, I encountered an error processing your request."
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleTemplateStart = async () => {
    // Transition from "Template Input" to "Brief Generation"
    // Include data from previous step in the user message
    const submittedInfo = `Submitted details:\n- Holiday: ${selectedHoliday}\n- Lighting: ${selectedLighting}\n- Promo: "exclusive colors, only at target"`;
    
    const userMsg: Message = { 
        id: Date.now().toString(), 
        role: 'user', 
        type: 'text', 
        content: `Here are my product details. Let's use this template!\n\n${submittedInfo}`,
        data: { images: templateImages }
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 2000));
        
        // Fallback Mock Data matching screenshot exactly
        const mockData = {
            name: "WALCH OXI Clean Anti-bacterial Detergent",
            description: "Anti-bacterial, kills 99% germs, removes 99.9% dust mites, removes stubborn stains, safe for any types of clothes, removes unpleasant odor, leaves clean scent.",
            market: { 
                region: "Malaysia", 
                language: "Malay", 
                audience: "Consumers seeking effective and safe laundry detergent for stain removal and odor control" 
            },
            guidelines: { 
                tone: "Emphasize effectiveness, safety, and cleanliness", 
                restrictions: "" 
            },
            imageUrl: templateImages.length > 0 ? templateImages[0] : "https://m.media-amazon.com/images/I/61N+Rk4+i+L._AC_SL1500_.jpg", // Use a placeholder that looks like detergent if no image
            images: templateImages.length > 0 ? templateImages : [video.image]
        };
        setBriefData(mockData);
        
        const systemResponse: Message = {
              id: (Date.now() + 1).toString(),
              role: 'system',
              type: 'brief',
              content: 'Done! Review the product brief. Select Edit to make changes if you need. When you\'re ready, tap "Looks good, next"',
        };
        setMessages(prev => [...prev, systemResponse]);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleProceedToStoryboard = () => {
    const userConfirmMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: 'Looks good, next' };
    setMessages(prev => [...prev, userConfirmMsg]);
    setIsGenerating(true);
    setTimeout(() => {
        const systemIntermediate: Message = { id: (Date.now() + 1).toString(), role: 'system', type: 'text', content: 'Awesome. We\'re now going to create a storyboard from your product brief.' };
        setMessages(prev => [...prev, systemIntermediate]);
        setTimeout(() => {
            // Mock storyboard data with more detail to match screenshot reference
            const initialFrames: StoryboardFrame[] = [
                { 
                    id: 'f1', 
                    number: 1, 
                    content: `*Action*: Woman holds up the product. Quick cut to an ECU on the packaging.\n*Voiceover*: "Okay, let's look at this amazing new serum!"` 
                }, 
                { 
                    id: 'f2', 
                    number: 2, 
                    content: `*Action*: Applying the serum to face in a bright bathroom setting.\n*Voiceover*: "It feels so hydrating and fresh."` 
                }
            ];
            setFrames(initialFrames);
            setStage('storyboard');
            const systemFinal: Message = { id: (Date.now() + 2).toString(), role: 'system', type: 'storyboard_card', content: 'Done! You can make edits directly in the storyboard panel.' };
            setMessages(prev => [...prev, systemFinal]);
            setIsGenerating(false);
        }, 2000);
    }, 1000);
  };

  const handleGenerateFullVideo = () => {
     const userMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: 'Generate full video' };
     setMessages(prev => [...prev, userMsg]);
     setStage('video_generating');
     setIsGenerating(true);
     setTimeout(() => {
         setStage('video_complete');
         setIsGenerating(false);
         setFinalVideoUrl(video.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
         const systemSuccess: Message = {
             id: (Date.now() + 1).toString(), role: 'system', type: 'video_result', 
             content: 'Success! We generated your full video. Preview, download, or sync it to Ads Manager. You can make edits in the Video Editor.',
             data: { title: 'Full video', duration: '00:13', thumbnail: video.image, videoUrl: video.videoUrl }
         };
         setMessages(prev => [...prev, systemSuccess]);
     }, 3000);
  };
  
  // Storyboard CRUD Handlers
  const handleAddFrame = () => {
      const newFrame: StoryboardFrame = {
          id: Date.now().toString(),
          number: frames.length + 1,
          content: '*Action*: \n*Voiceover*: '
      };
      setFrames([...frames, newFrame]);
  };

  const handleDeleteFrame = (id: string) => {
      const updatedFrames = frames.filter(f => f.id !== id).map((f, index) => ({ ...f, number: index + 1 }));
      setFrames(updatedFrames);
  };

  const handleUpdateFrame = (id: string, newContent: string) => {
      setFrames(frames.map(f => f.id === id ? { ...f, content: newContent } : f));
  };
  
  // Drag Handlers for Storyboard
  const handleDragStart = (e: React.DragEvent, index: number) => { dragItem.current = index; };
  
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (dragItem.current === null) return;
    if (dragItem.current !== index) {
        const newFrames = [...frames];
        const draggedItemContent = newFrames[dragItem.current];
        newFrames.splice(dragItem.current, 1);
        newFrames.splice(index, 0, draggedItemContent);
        
        // Renumber frames based on new order
        const reorderedFrames = newFrames.map((f, idx) => ({ ...f, number: idx + 1 }));
        
        setFrames(reorderedFrames);
        dragItem.current = index;
    }
  };

  const handleDragEnd = () => {
      dragItem.current = null;
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, stage]);


  // --- RENDER: CLIP GENERATOR LAYOUT ---
  if (video.type === 'clip') {
      return (
          <div className="h-[calc(100vh-60px)] bg-[#F8F9FB] flex flex-col relative overflow-hidden">
              
              {/* Header Actions (Top Right) */}
              {/* REMOVED as per previous request to remove buttons on light background */}

              {/* Main Canvas (Results) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center bg-[#F8F9FB] pb-[200px]">
                   <div className="w-full max-w-[1400px]">
                        {!generatedResults.length && !isClipGenerating ? (
                            // Initial State: Show Reference or Placeholder
                            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
                                    <Sparkles size={40} className="text-gray-400" />
                                </div>
                                <p className="text-lg font-medium text-gray-500">Enter a prompt to start generating with Veo</p>
                            </div>
                        ) : (
                            // Results Grid
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {isClipGenerating ? (
                                    // Loading Skeletons
                                    [1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-[9/16] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center border border-gray-200">
                                            <Loader2 size={32} className="text-gray-400 animate-spin" />
                                        </div>
                                    ))
                                ) : (
                                    // Actual Results
                                    generatedResults.map((result, idx) => (
                                        <div key={idx} className="aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden relative group shadow-sm hover:shadow-md transition-all border border-gray-200">
                                            <video 
                                              src={result} 
                                              className="w-full h-full object-cover" 
                                              autoPlay 
                                              loop 
                                              muted 
                                              playsInline 
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                 <div className="flex flex-col gap-2 h-full justify-end relative">
                                                     {/* Centered Play Button */}
                                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                         <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                                             <Play size={24} fill="white" className="ml-1"/>
                                                         </button>
                                                     </div>

                                                     {/* Bottom Actions Row */}
                                                     <div className="flex flex-col gap-2 w-full mt-auto">
                                                         <div className="flex items-center gap-2">
                                                            <button 
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 text-xs font-medium border border-white/10 transition-colors"
                                                            >
                                                                <Download size={14} />
                                                                Download
                                                            </button>
                                                            <button 
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 text-xs font-medium border border-white/10 transition-colors"
                                                                onClick={handleClipGenerate}
                                                            >
                                                                <RefreshCcw size={14} />
                                                                Regenerate
                                                            </button>
                                                         </div>
                                                         <button 
                                                            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FE2C55]/80 backdrop-blur-md rounded-lg text-white hover:bg-[#FE2C55] text-xs font-medium border border-white/10 transition-colors"
                                                         >
                                                             <Upload size={14} />
                                                             Sync to TTAM
                                                         </button>
                                                     </div>
                                                 </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                   </div>
              </div>

              {/* Floating Prompt Bar (Bottom) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200">
                      
                      {/* Top Bar of Prompt Box */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                          {/* Generation Mode Dropdown */}
                          <div className="relative">
                              <button 
                                  onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                                  className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-200/50 px-2 py-1 rounded transition-colors"
                              >
                                  {generationMode === 'image-to-video' ? 'Image to video' : 'Text to video'}
                                  <ChevronDown size={14} className="text-gray-500" />
                              </button>
                              
                              {isModeDropdownOpen && (
                                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                      <button 
                                          onClick={() => { setGenerationMode('image-to-video'); setIsModeDropdownOpen(false); }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                      >
                                          Image to video
                                          {generationMode === 'image-to-video' && <CheckCircle2 size={14} className="text-black" />}
                                      </button>
                                      <button 
                                          onClick={() => { setGenerationMode('text-to-video'); setIsModeDropdownOpen(false); }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                      >
                                          Text to video
                                          {generationMode === 'text-to-video' && <CheckCircle2 size={14} className="text-black" />}
                                      </button>
                                  </div>
                              )}
                          </div>
                          
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                              <LayoutTemplate size={14} />
                              Templates
                          </button>
                      </div>

                      {/* Text Input Area */}
                      <div className="p-4 bg-white rounded-b-2xl">
                          <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Describe the video you want to generate..."
                              className="w-full min-h-[60px] max-h-[120px] resize-none outline-none text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent"
                              onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleClipGenerate();
                                  }
                              }}
                          />
                          
                          {/* Attachments & Actions */}
                          <div className="flex items-end justify-between mt-3">
                              <div className="flex items-center gap-2">
                                  {/* Upload Button */}
                                  <div className="relative">
                                      <input 
                                          type="file" 
                                          className="hidden" 
                                          id="clip-upload"
                                          onChange={handleFileSelect} 
                                      />
                                      <label 
                                          htmlFor="clip-upload"
                                          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                                      >
                                          <Plus size={20} />
                                      </label>
                                  </div>

                                  {/* Thumbnail Previews */}
                                  {video.image && generationMode === 'image-to-video' && (
                                      <div className="relative group w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                          <img src={video.image} alt="Ref" className="w-full h-full object-cover" />
                                          <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                              <X size={14} className="text-white" />
                                          </button>
                                      </div>
                                  )}
                                   {previewUrl && (
                                      <div className="relative group w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                          <img src={previewUrl} alt="Upload" className="w-full h-full object-cover" />
                                          <button 
                                            onClick={clearFile}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <X size={14} className="text-white" />
                                          </button>
                                      </div>
                                  )}
                              </div>

                              <div className="flex items-center gap-3">
                                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                      <SlidersHorizontal size={20} />
                                  </button>
                                  <button 
                                      onClick={handleClipGenerate}
                                      disabled={isClipGenerating}
                                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
                                          !isClipGenerating
                                          ? 'bg-black text-white hover:bg-gray-800' 
                                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                      }`}
                                  >
                                      {isClipGenerating ? 'Generating...' : 'Generate'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      );
  }

  // --- RENDER: TEMPLATE LAYOUT (New) ---
  if (isTemplateInput) {
    return (
      <div className="h-[calc(100vh-60px)] bg-[#F8F9FB] flex flex-col relative overflow-hidden font-sans">
         {/* Hidden Input for Triggering */}
         <input 
            type="file" 
            ref={templateInputRef} 
            className="hidden" 
            onChange={handleTemplateFileSelect} 
            accept="image/*"
         />

         {/* Header */}
         <div className="h-16 px-6 flex items-center gap-4 z-20 sticky top-0 bg-[#F8F9FB]/80 backdrop-blur-sm">
             <h2 className="text-lg font-bold text-gray-900">Agent</h2>
         </div>
  
         {/* Main Scrollable Content */}
         <div className="flex-1 overflow-y-auto pb-[300px] scroll-smooth">
            <div className="max-w-3xl mx-auto pt-8 px-4 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               
               {/* AI Message */}
               <div className="flex items-start gap-3 text-left w-full max-w-lg justify-center">
                  <Sparkles className="w-6 h-6 text-[#25F4EE] flex-shrink-0 mt-1" fill="currentColor" />
                  <p className="text-xl text-gray-800 font-medium leading-relaxed">
                    Nice! You can easily replace the product in that video with your own.
                  </p>
               </div>
  
               {/* Video Card */}
               <div className="relative w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white transform transition-transform hover:scale-[1.02] duration-300">
                  <img src={video.image} alt="Template Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm flex items-center gap-1">
                     POV 👀
                  </div>
               </div>
            </div>
         </div>
  
         {/* Floating Bottom Card */}
         <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB] to-transparent pointer-events-none">
            <div ref={dropdownRef} className="w-full max-w-3xl bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500 delay-100 relative">
               {/* Upload Slots */}
               <div className="flex gap-4 mb-6">
                  {[0,1,2,3].map(index => {
                    const img = templateImages[index];
                    return img ? (
                       <div key={index} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 group">
                           <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                           <button 
                              onClick={() => removeTemplateImage(index)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <X size={16} className="text-white" />
                           </button>
                       </div>
                    ) : (
                        <button 
                            key={index} 
                            onClick={triggerTemplateInput}
                            className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:border-gray-300 cursor-pointer transition-all"
                        >
                           <ImageIcon size={24} />
                        </button>
                    );
                  })}
               </div>
  
               {/* Prompt Display (Interactive Editable Rich Text) */}
               <div className="text-lg text-gray-800 leading-relaxed mb-8 font-light text-left">
                  <span 
                     contentEditable 
                     suppressContentEditableWarning
                     className="outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-500 transition-colors rounded px-1 -ml-1 cursor-text"
                  >
                     POV 👀 your product gets a
                  </span>
                  
                  {/* Holiday Dropdown */}
                  <div className="relative inline-block mx-1.5 align-middle">
                      <button 
                        onClick={toggleHolidayDropdown}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-base font-medium transition-colors ${activeDropdown === 'holiday' ? 'bg-[#3F51B5] text-white' : 'bg-[#E8EAF6] text-[#3F51B5] hover:bg-[#C5CAE9]'}`}
                      >
                         Holiday: {selectedHoliday} <ChevronDown size={14}/>
                      </button>
                      
                      {activeDropdown === 'holiday' && (
                          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 overflow-hidden">
                              <h4 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Holiday</h4>
                              <div className="max-h-[200px] overflow-y-auto">
                                  {isHolidayLoading ? (
                                      <div className="p-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                          <Loader2 size={16} className="animate-spin" />
                                          <span>Searching Google...</span>
                                      </div>
                                  ) : (
                                      holidayOptions.length > 0 ? holidayOptions.map((h, i) => (
                                          <button 
                                              key={i} 
                                              onClick={() => selectHoliday(h)}
                                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                          >
                                              {h}
                                          </button>
                                      )) : (
                                        ['Christmas', 'New Year', 'Halloween', 'Black Friday'].map((h, i) => (
                                          <button 
                                              key={i} 
                                              onClick={() => selectHoliday(h)}
                                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                          >
                                              {h}
                                          </button>
                                      ))
                                      )
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  <span 
                     contentEditable 
                     suppressContentEditableWarning
                     className="outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-500 transition-colors rounded px-1 cursor-text"
                  >
                      glow-up. Use 
                  </span>
                  
                  {/* Lighting Dropdown */}
                   <div className="relative inline-block mx-1.5 align-middle">
                      <button 
                         onClick={toggleLightingDropdown}
                         className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-base font-medium transition-colors ${activeDropdown === 'lighting' ? 'bg-[#00695C] text-white' : 'bg-[#E0F2F1] text-[#00695C] hover:bg-[#B2DFDB]'}`}
                      >
                         Lighting: {selectedLighting} <ChevronDown size={14}/>
                      </button>

                      {activeDropdown === 'lighting' && (
                          <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 overflow-hidden">
                              <h4 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Lighting</h4>
                              <div className="max-h-[200px] overflow-y-auto">
                                  {lightingOptions.map((l, i) => (
                                      <button 
                                          key={i} 
                                          onClick={() => selectLighting(l)}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                      >
                                          {l}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="mt-3">
                     <div 
                        contentEditable 
                        suppressContentEditableWarning
                        className="outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-500 transition-colors rounded p-1 -ml-1 cursor-text"
                     >
                        At the end of the video, add promotional text: ✨<span className="font-bold">exclusive colors</span>✨, <span className="font-bold">only at target</span>
                     </div>
                  </div>
               </div>
  
               {/* Footer Actions */}
               <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-50 rounded-full">
                     <SlidersHorizontal size={20} />
                  </button>
                  <button 
                    onClick={handleTemplateStart}
                    className="w-10 h-10 bg-[#009688] hover:bg-[#00897B] text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 active:scale-95"
                  >
                     <ArrowUp size={22} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // --- RENDER: TOP AD AGENT LAYOUT (Existing - fallback for 'top-ad' or active 'template') ---
  return (
    <div className={`h-[calc(100vh-60px)] bg-[#F8F9FB] ${isLayoutCentered ? '' : 'flex'}`}>
      
      {/* --- LEFT PANEL: AGENT CHAT --- */}
      <div className={`
        flex flex-col h-full transition-all duration-500 ease-in-out
        ${isLayoutCentered 
            ? 'w-full max-w-3xl mx-auto' 
            : 'w-full md:w-[420px] border-r border-gray-200 bg-white md:bg-[#F8F9FB]'
        }
      `}>
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-200 flex-shrink-0 ${isLayoutCentered ? 'border-transparent' : 'bg-white md:bg-transparent'}`}>
           <h2 className="font-bold text-lg text-gray-900">
             Agent
           </h2>
        </div>

        {/* Chat Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth no-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${isLayoutCentered && msg.type === 'welcome' ? 'max-w-xl mx-auto text-center' : ''}`}>
                {/* SYSTEM WELCOME */}
                {msg.type === 'welcome' && (
                  <div className="space-y-4">
                      {/* Icon and Header */}
                      <div className={`flex items-center gap-2 ${isLayoutCentered ? 'justify-center' : ''}`}>
                         <Sparkles className="text-[#25F4EE]" size={20} fill="currentColor" />
                      </div>
                      <h3 className="text-gray-900 font-medium text-lg leading-snug">
                        Nice! You're about to turn your product into a top-ad style video.
                      </h3>

                      {/* Large Image */}
                      <div className={`w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative ${isLayoutCentered ? 'aspect-[3/4] max-w-xs mx-auto' : 'aspect-[3/4]'}`}>
                         <img src={video.image} alt="Ref" className="w-full h-full object-cover" />
                      </div>

                      <div className="text-gray-600 text-[15px] leading-relaxed">
                        Just upload a clean product pic (plain background, no faces or extras) and tell me a bit about it. I'll take it from there. <span className="text-[#FE2C55]">✨</span>
                      </div>
                  </div>
                )}
                {/* USER MESSAGE */}
                {msg.role === 'user' && (
                  <div className="flex flex-col items-end gap-2 mt-6">
                      {msg.data?.previewUrl && (
                          <div className="flex items-center gap-3 bg-[#E3F2FD] p-2 pr-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[90%] border border-blue-100">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                                  <img src={msg.data.previewUrl} alt="Upload" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-700 font-medium truncate max-w-[150px]">
                                  {msg.data.fileName || 'product_image_1.jpg'}
                              </span>
                          </div>
                      )}
                      
                      {/* NEW SECTION FOR TEMPLATE IMAGES */}
                      {msg.data?.images && Array.isArray(msg.data.images) && (
                          <div className="flex flex-wrap gap-2 justify-end mb-1 max-w-[90%]">
                              {msg.data.images.map((img: string, idx: number) => (
                                  <div key={idx} className="w-40 aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                                      <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                                  </div>
                              ))}
                          </div>
                      )}

                      {msg.content && (
                        <div className="bg-[#E3F2FD] text-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] shadow-sm max-w-[90%] whitespace-pre-wrap">
                            {msg.content}
                        </div>
                      )}
                  </div>
                )}
                {/* SYSTEM TEXT (Generic) */}
                {msg.type === 'text' && msg.role === 'system' && (
                     <div className="text-gray-800 text-[15px] leading-relaxed">
                        {msg.data?.previewUrl && (
                             <div className="mb-3 w-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img src={msg.data.previewUrl} alt="Generated" className="w-full h-full object-cover" />
                             </div>
                        )}
                        {msg.content}
                     </div>
                )}
                {/* SYSTEM BRIEF CONFIRMATION */}
                {msg.type === 'brief' && (
                  <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2 text-[#00838F] font-medium">
                          <Sparkles size={18} />
                          <span>Generated</span>
                      </div>
                      <div className="border border-gray-200 bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                              <FileText size={20} className="text-gray-500" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-900">Product brief</p>
                              <p className="text-xs text-gray-400">11:23:00 10/28/2025</p>
                          </div>
                      </div>
                      <p className="text-gray-800 text-[15px] leading-relaxed">
                          {msg.content}
                      </p>
                  </div>
                )}
                {/* SYSTEM STORYBOARD CARD */}
                {msg.type === 'storyboard_card' && (
                    <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2 text-[#00838F] font-medium">
                          <Sparkles size={18} />
                          <span>Generated</span>
                      </div>
                      <p className="text-gray-800 text-[15px] leading-relaxed mb-4">
                          {msg.content}
                      </p>
                      <div className="border border-[#009688] bg-white p-4 rounded-lg flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                              <FileVideo size={20} className="text-gray-900" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-900">Storyboard_v1</p>
                              <p className="text-xs text-gray-400">11:23:00 10/28/2025</p>
                          </div>
                      </div>
                      <div className="text-gray-800 text-[15px] leading-relaxed mt-4">
                        Once your storyboard is in good shape, click "Generate full video" to make it come to life.
                      </div>
                  </div>
                )}
                {/* SYSTEM VIDEO RESULT */}
                {msg.type === 'video_result' && (
                   <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2 text-[#00838F] font-medium">
                          <Sparkles size={18} />
                          <span>Generation complete</span>
                      </div>
                      <p className="text-gray-800 text-[15px] leading-relaxed mb-4">
                          {msg.content}
                      </p>
                      <div className="border border-[#009995] bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm transition-shadow hover:shadow-md">
                          <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 group cursor-pointer"
                            onClick={() => msg.data?.videoUrl && window.open(msg.data.videoUrl, '_blank')}
                          >
                             <img src={msg.data.thumbnail} alt="Thumb" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                 <Play size={20} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" fill="currentColor" />
                             </div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{msg.data.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{msg.data.duration}</p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-1 text-gray-400">
                              <button className="p-1.5 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Download">
                                  <Download size={16} />
                              </button>
                              <button className="p-1.5 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Regenerate">
                                  <RefreshCcw size={16} />
                              </button>
                              <button className="p-1.5 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                                  <Edit2 size={16} />
                              </button>
                              <button className="p-1.5 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="More">
                                  <MoreVertical size={16} />
                              </button>
                          </div>
                      </div>
                   </div>
                )}
             </div>
           ))}
           {isGenerating && (
             <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
               <Sparkles size={14} />
               <span>Thinking...</span>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className={`p-6 border-t ${isLayoutCentered ? 'border-transparent bg-transparent' : 'bg-white border-gray-100'}`}>
            {stage === 'brief' && briefData && !isGenerating && (
                <div className="flex justify-end mb-4">
                     <button 
                        onClick={handleProceedToStoryboard}
                        className="bg-[#009688] hover:bg-[#00897B] text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all flex items-center gap-2"
                     >
                        Looks good, next
                    </button>
                </div>
            )}
             {stage === 'storyboard' && !isGenerating && (
                <div className="flex justify-end mb-4">
                     <button 
                        onClick={handleGenerateFullVideo}
                        className="bg-[#009688] hover:bg-[#00897B] text-white px-8 py-3 rounded-lg font-medium text-base shadow-sm transition-all flex items-center gap-2"
                     >
                        Generate full video
                    </button>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-gray-300 focus-within:shadow-md transition-all p-4">
                {stage === 'video_complete' && (
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E0F7FA] text-[#006064]">
                            @ Full video
                        </span>
                    </div>
                )}
                {stage === 'storyboard' && (
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                            @storyboard_v1
                        </span>
                    </div>
                )}
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={stage === 'video_complete' ? "Describe your changes..." : "Details about your product..."}
                  className="w-full min-h-[60px] resize-none outline-none text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
                  rows={1}
                  onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                      }
                  }}
                />
                
                <div className="flex items-center justify-between mt-3">
                    <div className="relative">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileSelect} 
                            accept="image/*"
                        />
                        <button 
                           onClick={triggerFileInput}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                        >
                          <Plus size={14} />
                          Product
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleSend()}
                            disabled={!prompt && !selectedFile}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                prompt || selectedFile ? 'bg-black text-white hover:bg-gray-800 shadow-md' : 'bg-gray-100 text-gray-300'
                            }`}
                        >
                            <ArrowUp size={16} />
                        </button>
                    </div>
                </div>

                {selectedFile && previewUrl && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                    <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={clearFile}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
                        >
                            <X size={12} />
                        </button>
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{selectedFile.name}</span>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (Top Ad Specific) --- */}
      {!isLayoutCentered && (
        <div className="flex-1 flex flex-col bg-white h-full border-l border-gray-200 overflow-hidden relative animate-in slide-in-from-right-10 duration-500">
         {/* Brief, Storyboard, and Video Result panels logic remains here */}
         {stage === 'brief' && (
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth pb-24">
                {!briefData ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6 opacity-40">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                          <FileText size={36} strokeWidth={1.5} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-400">Product brief will appear here</p>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* HEADER */}
                      <div className="flex items-center justify-between mb-6">
                          <h2 className="text-[#00838F] text-lg font-bold">Product brief</h2>
                          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                              <Edit2 size={14} />
                              Edit
                          </button>
                      </div>

                      <div className="p-6 bg-white">
                          {/* PRODUCT INFORMATION SECTION */}
                          <div className="mb-8">
                              <h3 className="text-lg font-bold text-gray-900 mb-6">Product information</h3>
                              <div className="space-y-6">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-900 mb-1">Name</label>
                                      <div className="text-sm text-gray-500">{briefData.name}</div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                                      <div className="text-sm text-gray-500 leading-relaxed">{briefData.description}</div>
                                  </div>
                                  {(briefData.images && briefData.images.length > 0) ? (
                                      <div>
                                          <label className="block text-sm font-bold text-gray-900 mb-2">Image</label>
                                          <div className="flex gap-4 overflow-x-auto pb-2">
                                              {briefData.images.map((img, idx) => (
                                                  <div key={idx} className="w-24 h-32 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-2 flex items-center justify-center">
                                                      <img src={img} alt={`Product ${idx}`} className="w-full h-full object-contain" />
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  ) : briefData.imageUrl && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Image</label>
                                        <div className="w-24 h-32 rounded-lg border border-gray-200 bg-white p-2 flex items-center justify-center">
                                            <img src={briefData.imageUrl} alt="Product" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                  )}
                              </div>
                          </div>

                          {/* MARKET INFORMATION SECTION */}
                          <div className="mb-8">
                              <h3 className="text-lg font-bold text-gray-900 mb-6">Market information</h3>
                              <div className="grid grid-cols-2 gap-8 mb-6">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-900 mb-1">Region</label>
                                      <div className="text-sm text-gray-500">{briefData.market.region}</div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-900 mb-1">Language</label>
                                      <div className="text-sm text-gray-500">{briefData.market.language}</div>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-900 mb-1">Target audience</label>
                                  <div className="text-sm text-gray-500">{briefData.market.audience}</div>
                              </div>
                          </div>

                          {/* VIDEO GUIDELINES SECTION - Kept inside to maintain single box look if present */}
                          <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-6">Video guidelines</h3>
                              <div>
                                  <label className="block text-sm font-bold text-gray-900 mb-1">Brand tone</label>
                                  <div className="text-sm text-gray-500">{briefData.guidelines.tone}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                )}
             </div>
         )}
         {stage === 'storyboard' && (
             <div className="flex-1 overflow-y-auto p-8 bg-white h-full relative">
                 <div className="max-w-3xl mx-auto pb-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-4 border-b border-gray-100">
                        <h2 className="text-[#0D47A1] text-lg font-semibold cursor-pointer hover:underline">storyboard_v1</h2>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Save size={16} />
                            Save
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-8">
                        {frames.map((frame, index) => (
                            <div 
                                key={frame.id} 
                                className="group transition-all"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="flex items-center justify-between mb-3 text-gray-500">
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab hover:text-gray-800 p-1">
                                            <GripVertical size={20} />
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm">Frame {index + 1}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteFrame(frame.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                
                                <textarea 
                                    value={frame.content}
                                    onChange={(e) => handleUpdateFrame(frame.id, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-800 leading-relaxed shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white font-mono"
                                    rows={4}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Add Frame Button */}
                    <div className="mt-8">
                        <button 
                            onClick={handleAddFrame}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                        >
                            <Plus size={16} />
                            Add frame
                        </button>
                    </div>
                 </div>
             </div>
         )}
         {stage === 'video_complete' && finalVideoUrl && (
             <div className="flex-1 flex flex-col bg-white h-full relative">
                 {/* Header */}
                 <div className="h-[60px] px-8 flex items-center border-b border-gray-100">
                    <h2 className="text-[#0D47A1] text-lg font-semibold">Video_01</h2>
                 </div>
                 
                 {/* Video Area */}
                 <div className="flex-1 p-8 flex items-center justify-center bg-white">
                      <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl">
                          <video 
                             src={finalVideoUrl} 
                             className="w-full h-full object-cover" 
                             controls 
                             autoPlay 
                             loop 
                             muted 
                          />
                          {/* Duration Badge */}
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
                              00:13
                          </div>
                      </div>
                 </div>
             </div>
         )}
      </div>
      )}
    </div>
  );
};
