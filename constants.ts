
import { Home, Clapperboard, Video, Image as ImageIcon, ShoppingBag, User, Type, RefreshCcw, Scissors, Languages, History, LayoutGrid } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Home', icon: Home, active: true, section: 'main' },
];

export const PRODUCTION_ITEMS = [
  { label: 'Scene generator', icon: Clapperboard, hasSubmenu: true },
  { label: 'Avatar videos', icon: User },
  { label: 'Generate TikTok Ads', icon: ShoppingBag },
];

export const POST_PRODUCTION_ITEMS = [
  { label: 'Translate & Dub', icon: Languages },
  { label: 'Refresh ads', icon: RefreshCcw },
  { label: 'Video editor', icon: Scissors },
];

export const LIBRARY_ITEMS = [
  { label: 'History', icon: History },
  { label: 'Products', icon: LayoutGrid },
];

export const HERO_VIDEOS = [
   {
    id: 1,
    type: 'top-ad',
    title: 'Summer Streetwear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=1000&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    category: 'Apparel',
    creator: 'Urban Mode',
    stats: 'Trending',
    views: '5.4M',
    engagement: '0.15%',
    ctr: 'Top 25%',
    viewRate: 'Top 30%',
    brand: 'Urban Mode',
    region: 'Europe',
    industry: 'Apparel & Accessories',
    landingPage: 'urbanmode.store/summer',
    creativeApproach: [
        { label: 'Applicable Scenarios', value: 'Summer Vacation' },
        { label: 'Target Audience', value: 'Gen Z' }
    ]
  },
  {
    id: 2,
    type: 'top-ad',
    title: 'Epic RPG Saga',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&h=1000&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Games',
    creator: 'Mythic Studios',
    stats: '12M Views',
    views: '12.0M',
    engagement: '1.2%',
    ctr: 'Top 10%',
    viewRate: 'Top 20%',
    brand: 'Mythic Studios',
    region: 'Global',
    industry: 'Gaming',
    landingPage: 'mythic.com/download',
    creativeApproach: [
        { label: 'Function & Attribute', value: 'Immersive Gameplay' },
        { label: 'Target Audience', value: 'RPG Fans' }
    ]
  },
 {
    id: 3,
    type: 'top-ad',
    title: 'Hydration Boost Serum',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&h=1000&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Beauty & Care',
    creator: 'GlowLab',
    stats: 'Top 1% CTR',
    // Modal Details
    views: '11.8M',
    engagement: '0.07%',
    ctr: 'Top 38%',
    viewRate: 'Top 46%',
    brand: 'GlowLab',
    region: 'United States',
    industry: 'Beauty & Personal Care',
    landingPage: 'glowlab.com/serum',
    creativeApproach: [
        { label: 'Function & Attribute', value: 'Effective Hydration Solutions' },
        { label: 'Physical Product & Commodity', value: 'Skincare Serum' },
        { label: 'Service', value: 'Free Shipping' },
        { label: 'Applicable Scenarios', value: 'Morning Routine' }
    ]
  },
  {
    id: 4,
    type: 'top-ad',
    title: 'Midnight Cravings',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&h=1000&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    category: 'Food & Beverage',
    creator: 'Burger Joint',
    stats: 'High Conversion',
    views: '8.2M',
    engagement: '0.09%',
    ctr: 'Top 5%',
    viewRate: 'Top 15%',
    brand: 'Burger Joint',
    region: 'United States',
    industry: 'Food & Beverage',
    landingPage: 'burgerjoint.com/delivery',
    creativeApproach: [
        { label: 'Function & Attribute', value: 'Late Night Delivery' }
    ]
  },
  {
    id: 5,
    type: 'top-ad',
    title: 'Smart Home Hub',
    image: 'https://images.unsplash.com/photo-1558002038-10915571e997?q=80&w=600&h=1000&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    category: 'Tech',
    creator: 'NextGen Tech',
    stats: 'Most Shared',
    views: '3.1M',
    engagement: '0.05%',
    ctr: 'Top 15%',
    viewRate: 'Top 40%',
    brand: 'NextGen',
    region: 'Asia Pacific',
    industry: 'Consumer Electronics',
    landingPage: 'nextgen.tech/hub',
    creativeApproach: [
        { label: 'Function & Attribute', value: 'Home Automation' }
    ]
  }
];

export const TREND_SECTIONS = [
  {
    id: 1,
    rank: 1,
    title: "Holiday gift giving",
    views: "1.5B views",
    description: "Why it's trending: Spikes during the holiday season as shoppers search TikTok for ideas and gift guides, and brands push seasonal promos.",
    clips: [
       { 
          id: 106, 
          type: 'template', 
          title: 'Holiday Gift Guide', 
          image: 'https://picsum.photos/400/711?random=11',
          description: 'Fast-paced listicle style template perfect for showing off multiple products.',
          tool: 'Agent template',
          industry: 'E-commerce',
          useCases: ['Gift Guides', 'Top 5 Lists']
      },
      // TOP ADS (5)
      { 
          id: 111, 
          type: 'clip', 
          title: 'Snowy cabin view',
          image: 'https://picsum.photos/400/711?random=16',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          tool: 'Text to video',
          prompt: 'Cinematic shot of a cozy log cabin covered in snow during twilight.'
      },
      {
        id: 101,
        type: 'top-ad',
        title: 'Holiday Sparkle Sale',
        image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        brand: 'GiftBox',
        stats: 'Trending',
        views: '2.1M',
        engagement: '0.12%',
        ctr: 'Top 18%',
        viewRate: 'Top 25%',
        region: 'United States',
        industry: 'E-commerce',
        creativeApproach: [{ label: 'Seasonal', value: 'Holiday Promo' }]
      },
      {
        id: 102,
        type: 'top-ad',
        title: 'VR Headset Launch',
        image: 'https://images.unsplash.com/photo-1622979135228-5b1ed317b078?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        brand: 'TechVision',
        stats: 'Hot Tech',
        views: '4.5M',
        engagement: '0.3%',
        ctr: 'Top 5%',
        industry: 'Electronics'
      },
      {
        id: 103,
        type: 'top-ad',
        title: 'Cozy Winter Vibes',
        image: 'https://images.unsplash.com/photo-1517260739337-6799d2cb9feb?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        brand: 'WarmthCo',
        stats: 'High CTR',
        category: 'Apparel'
      },
      {
        id: 104,
        type: 'top-ad',
        title: 'Winter Roast Blend',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        brand: 'Beanery',
        stats: 'Top Rated',
        category: 'Food & Bev'
      },
      {
        id: 105,
        type: 'top-ad',
        title: 'Smart Home Gift',
        image: 'https://images.unsplash.com/photo-1558002038-10915571e997?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        brand: 'NextGen',
        stats: 'Viral',
        category: 'Tech'
      },
      
      // TEMPLATES (5)
     
      { 
          id: 107, 
          type: 'template', 
          title: 'Unboxing Experience', 
          image: 'https://picsum.photos/400/711?random=12',
          description: 'Focus on the packaging and reveal of a premium product.',
          tool: 'Agent template',
          industry: 'Consumer Goods'
      },
      { 
          id: 108, 
          type: 'template', 
          title: 'Flash Sale Countdown', 
          image: 'https://picsum.photos/400/711?random=13',
          description: 'High urgency text overlays with dynamic product shots.',
          tool: 'Agent template',
          industry: 'Retail'
      },
      { 
          id: 109, 
          type: 'template', 
          title: '3 Gift Ideas for Him', 
          image: 'https://picsum.photos/400/711?random=14',
          description: 'Segmented video layout to compare options.',
          tool: 'Agent template',
          industry: 'Lifestyle'
      },
      { 
          id: 110, 
          type: 'template', 
          title: 'New Year New Me', 
          image: 'https://picsum.photos/400/711?random=15',
          description: 'Motivational transition template for fitness or lifestyle products.',
          tool: 'Agent template',
          industry: 'Fitness'
      },

      // CLIPS (5)
      { 
          id: 111, 
          type: 'clip', 
          title: 'Snowy cabin view',
          image: 'https://picsum.photos/400/711?random=16',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          tool: 'Text to video',
          prompt: 'Cinematic shot of a cozy log cabin covered in snow during twilight.'
      },
      { 
          id: 112, 
          type: 'clip', 
          title: 'Champagne toast',
          image: 'https://picsum.photos/400/711?random=17',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          tool: 'Text to video',
          prompt: 'Close up slow motion of crystal glasses clinking with champagne, golden bokeh.'
      },
      { 
          id: 113, 
          type: 'clip', 
          title: 'Fireplace crackling',
          image: 'https://picsum.photos/400/711?random=18',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          tool: 'Text to video',
          prompt: 'Warm fireplace with burning logs, high detail 4k.'
      },
      { 
          id: 114, 
          type: 'clip', 
          title: 'Wrapping presents',
          image: 'https://picsum.photos/400/711?random=19',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
          tool: 'Text to video',
          prompt: 'Hands wrapping a gift box with red ribbon on a wooden table.'
      },
      { 
          id: 115, 
          type: 'clip', 
          title: 'Fireworks display',
          image: 'https://picsum.photos/400/711?random=20',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          tool: 'Text to video',
          prompt: 'Bright colorful fireworks exploding in the night sky over a city.'
      }
    ]
  },
  {
    id: 2,
    rank: 2,
    title: "Casual wear and lifestyle",
    views: "1.1B views",
    description: "Why it's trending: Feels relatable and easy to create. Resonates with a wide range of creators and viewers looking for authentic content.",
    clips: [
      // TOP ADS (5)
      {
        id: 201,
        type: 'top-ad',
        title: 'Summer Streetwear',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        brand: 'Urban Mode',
        stats: 'Trending',
        category: 'Apparel'
      },
      { 
          id: 202, 
          type: 'template', 
          title: 'Daily OOTD', 
          image: 'https://picsum.photos/400/712?random=25', 
          description: 'Fast paced outfit of the day showcase.',
          tool: 'Agent template',
          industry: 'Fashion'
      },

      { 
          id: 203, 
          type: 'clip', 
          title: 'Outfit transition', 
          image: 'https://picsum.photos/400/712?random=30', 
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
          tool: 'Text to video', 
          prompt: 'Instant outfit change transition from pajamas to street wear.' 
      },
      {
        id: 204,
        type: 'top-ad',
        title: 'Hydration Serum',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        brand: 'GlowLab',
        stats: 'Top 1% CTR',
        category: 'Beauty'
      },
      {
        id: 205,
        type: 'top-ad',
        title: 'Language App',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        brand: 'LingoQuick',
        stats: 'Edu-Trend',
        category: 'Education'
      },

      {
        id: 206,
        type: 'top-ad',
        title: 'Eco-Friendly Kicks',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        brand: 'GreenStep',
        stats: 'Sustainable',
        category: 'Footwear'
      },
      { 
          id: 207, 
          type: 'template', 
          title: 'GRWM Routine', 
          image: 'https://picsum.photos/400/712?random=26', 
          description: 'Get Ready With Me style vlog template.',
          tool: 'Agent template',
          industry: 'Beauty/Fashion'
      },
      { 
          id: 208, 
          type: 'template', 
          title: 'Day in the Life', 
          image: 'https://picsum.photos/400/712?random=27', 
          description: 'Timestamps and quick cuts for a daily vlog.',
          tool: 'Agent template',
          industry: 'Lifestyle'
      },
      { 
          id: 209, 
          type: 'template', 
          title: 'Travel Diary Recap', 
          image: 'https://picsum.photos/400/712?random=28', 
          description: 'Montage of scenic shots with location text overlays.',
          tool: 'Agent template',
          industry: 'Travel'
      },
      { 
          id: 210, 
          type: 'template', 
          title: 'Fitness Transformation', 
          image: 'https://picsum.photos/400/712?random=29', 
          description: 'Split screen or slide transition showing progress.',
          tool: 'Agent template',
          industry: 'Health'
      },
      {
        id: 211,
        type: 'top-ad',
        title: 'Pet Monthly Box',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&h=1000&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        brand: 'PawPal',
        stats: 'Cute Alert',
        category: 'Pets'
      },
    
      { 
          id: 212, 
          type: 'clip', 
          title: 'Morning routine', 
          image: 'https://picsum.photos/400/712?random=31', 
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
          tool: 'Text to video', 
          prompt: 'A peaceful morning routine making tea and reading a book by the window.' 
      },
      { 
          id: 213, 
          type: 'clip', 
          title: 'City walk POV', 
          image: 'https://picsum.photos/400/712?random=32', 
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
          tool: 'Text to video', 
          prompt: 'POV walking through a busy downtown street on a sunny afternoon.' 
      },
      { 
          id: 214, 
          type: 'clip', 
          title: 'Skateboarding tricks', 
          image: 'https://picsum.photos/400/712?random=33', 
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
          tool: 'Text to video', 
          prompt: 'A skater performing a kickflip in a concrete skatepark.' 
      },
      { 
          id: 215, 
          type: 'clip', 
          title: 'Healthy smoothie', 
          image: 'https://picsum.photos/400/712?random=34', 
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
          tool: 'Text to video', 
          prompt: 'Fresh fruits falling into a blender in slow motion, green smoothie.' 
      },
    ]
  }
];
