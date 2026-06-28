import React from 'react';
import { Camera, MapPin, Upload, Sparkles, Clock, Compass, Layers, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import local images from the assets folder
import uploadFeatureImg from '../assets/image_story_narration.png';
import reconstructionFeatureImg from '../assets/image_reconstruction.png';
import BuddhaPaintingImg from '../assets/taxila-mural-image.jpg';

// Reusable Craftsmanship Pattern Divider Component
const CraftsmanshipBorder = () => (
  <div className="w-full h-8 relative opacity-25 mix-blend-multiply pointer-events-none" style={{ minHeight: '32px' }}>
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='32' viewBox='0 0 60 32'%3E%3Cpath d='M0 16 L15 0 L30 16 L45 0 L60 16 L45 32 L30 16 L15 32 Z M15 16 L30 8 L45 16 L30 24 Z' fill='%2392400e' fill-opacity='0.6' stroke='%2378350f' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%'
      }}
    />
  </div>
);

const HomePage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  const sites = [
    {
      id: 'taxila',
      name: 'Taxila',
      description: 'Ancient Buddhist city and UNESCO World Heritage Site',
      image: 'https://plus.unsplash.com/premium_photo-1694475128245-999b1ae8a44e?w=800',
      era: '6th Century BCE'
    },
    {
      id: 'mohenjo-daro',
      name: 'Mohenjo-daro',
      description: 'One of the world\'s earliest urban settlements',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Mohenjodaro_-_view_of_the_stupa_mound.JPG/1280px-Mohenjodaro_-_view_of_the_stupa_mound.JPG?w=800',
      era: '2500 BCE'
    },
    {
      id: 'harappa',
      name: 'Harappa',
      description: 'Major center of the Indus Valley Civilization',
      image: 'https://cdn1.byjus.com/wp-content/uploads/2018/11/free-ias-prep/2017/01/13062915/Urban-planning-of-the-Harappan.jpg?w=800',
      era: '3300 BCE'
    },
    {
      id: 'katas-raj',
      name: 'Katas Raj Temples',
      description: 'Ancient complex of Hindu temples connected by a sacred pond',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Katas_Raj_Temples_2.JPG/1280px-Katas_Raj_Temples_2.JPG?w=800',
      era: '7th Century CE'
    },
    {
      id: 'makli',
      name: 'Makli Necropolis',
      description: 'One of the largest funerary sites in the world with stunning stone carvings',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/View_of_Makli_by_Usman_Ghani_%28cropped%29.jpg?w=800',
      era: '14th Century CE'
    },
    {
      id: 'ranikot',
      name: 'Ranikot Fort',
      description: 'Known as the Great Wall of Sindh, the largest fort in the world',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Ranikot_Fort_-_The_Great_Wall_of_Sindh.jpg/1280px-Ranikot_Fort_-_The_Great_Wall_of_Sindh.jpg',
      era: '17th Century CE'
    }
  ];

  return (
    <div className="bg-[#FDFBF7] text-stone-900 min-h-screen selection:bg-amber-200 antialiased">

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(253, 251, 247, 0.75), rgba(253, 251, 247, 0.25)), url('https://images.unsplash.com/photo-1680464140223-eab28aa2fcdc?auto=format&fit=crop&q=80&w=2071')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 font-sans tracking-tight">
              Explore Pakistan's Ancient Civilizations with AI
            </h1>
            <p className="text-xl text-stone-800 mb-8 font-medium leading-relaxed">
              Your personal guide to South Asian heritage. Upload artifacts, discover stories, and experience history through cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* FIXED: Removed duplicate onClick and className properties */}
              <button
                onClick={() => setCurrentPage(user ? 'upload' : 'signup')}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/20"
              >
                <Camera className="w-5 h-5" />
                <span>Upload an Artifact</span>
              </button>
              <button
                onClick={() => setCurrentPage('ar')}
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-50 transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                <span>Explore Sites</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-stone-900 mb-4 font-sans tracking-tight">
          How HeritageAI Works
        </h2>
        <p className="text-center text-stone-600 text-lg max-w-2xl mx-auto mb-16">
          An integrated intelligent ecosystem designed to map, preserve, and explore South Asian historical milestones.
        </p>
      </div>

      {/* Alternating Banners */}
      <div className="space-y-0">

        {/* MODULE 01: ARTIFACT IDENTIFICATION */}
        <div className="relative bg-orange-500/[0.045] py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.22] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1694475128245-999b1ae8a44e?w=1200')` }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-orange-200/80 shadow-md shadow-amber-900/[0.03]">
              <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Upload className="w-3.5 h-3.5" />
                <span>Module 01: Computer Vision Integration</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-sans leading-tight tracking-tight">
                Physical Artifact Capture
              </h2>
              <p className="text-stone-700 text-lg leading-relaxed">
                Document and archive historical fragments instantly. Simply capture or upload an image of any physical relic discovered at excavation coordinates or national museum exhibitions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-stone-600"><strong className="text-stone-900 block mb-0.5">Multi-Class Extraction</strong> Classifies object contours, shapes, and structural patterns dynamically.</p>
                </div>
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-stone-600"><strong className="text-stone-900 block mb-0.5">Confidence Mapping</strong> Computes precise localization vectors and authenticity markers.</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage(user ? 'upload' : 'signup')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-lg transition shadow-md flex items-center gap-2 group text-base"
                >
                  <span>Launch Artifact Uploader</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="text-xs uppercase tracking-widest font-mono text-stone-500 border-b border-stone-200 pb-2">Image Processing Engine</div>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100">
                  <img src={uploadFeatureImg} alt="Artifact upload feature capture workflow" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center text-xs text-stone-500 font-mono pt-1">
                  <span>Status: Image Parsed</span>
                  <span className="text-emerald-600 font-bold">98.4% Acc</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Divider Line */}
        <CraftsmanshipBorder />

        {/* MODULE 02: UNCOVER CHRONICLES */}
        <div className="relative bg-amber-500/[0.04] py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.22] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Mohenjodaro_-_view_of_the_stupa_mound.JPG/1280px-Mohenjodaro_-_view_of_the_stupa_mound.JPG')` }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-5 relative order-last lg:order-first">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4 max-w-sm mx-auto font-mono text-xs text-stone-700">
                <div className="text-xs uppercase tracking-widest text-amber-700 border-b border-stone-200 pb-2">Dataset Reference Registry</div>
                <div className="space-y-2">
                  <p className="text-amber-700 font-bold">// Civilizational Lineage</p>
                  <p><span className="text-stone-400">Origin:</span> Indus Valley Cluster</p>
                  <p><span className="text-stone-400">Period:</span> Mature Harappan (2600-1900 BCE)</p>
                  <p><span className="text-stone-400">Impact:</span> Regional Standardized Trade Systems</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-amber-200/80 shadow-md shadow-amber-900/[0.03]">
              <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Module 02: Knowledge Base Synthesis</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-sans leading-tight tracking-tight">
                Vetted Chronicle Discovery
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Step away from unverified search algorithms. Delve straight into a deeply integrated, descriptive historical ledger context compiling verified knowledge coordinates.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Academic Alignment</strong> Educational profiles mapped cleanly to university and historical research catalogs.</p>
                </div>
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Societal Metrics</strong> Explores regional structural impacts, cultural lineages, and ancestry paths.</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('sites')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-lg transition shadow-md flex items-center gap-2 group text-base"
                >
                  <span>Explore Site Chronicles</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Divider Line */}
        <CraftsmanshipBorder />

        {/* MODULE 03: 2D RECONSTRUCTION */}
        <div className="relative bg-amber-600/[0.035] py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.22] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Katas_Raj_Temples_2.JPG/1280px-Katas_Raj_Temples_2.JPG')` }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-orange-200/80 shadow-md shadow-amber-900/[0.03]">
              <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Module 03: Generative Neural Modeling</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-sans leading-tight tracking-tight">
                Ruins Reconstruction
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Synthesize structural layouts from erosion. Neural imaging pipelines interpret foundational remains to reconstruct comprehensive spatial illustrations of prominent monuments at their pinnacle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Architectural Extrapolation</strong> Completes damaged geometric pillars and masonry coordinates.</p>
                </div>
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Historical Fidelity</strong> Maintains rigorous consistency with regional blueprint records.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="text-xs uppercase tracking-widest font-mono text-stone-500 border-b border-stone-200 pb-2">Generative Layer Renderer</div>
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-200 relative">
                  <img src={reconstructionFeatureImg} alt="Generative architectural reconstruction mesh preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent p-3 flex items-end">
                    <span className="font-mono text-[10px] text-amber-500 font-bold">Rendering Structural Wireframe...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Divider Line */}
        <CraftsmanshipBorder />

        {/* MODULE 04: AGENTIC TOUR PLANNER */}
        <div className="relative bg-orange-500/[0.045] py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.22] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Ranikot_Fort_-_The_Great_Wall_of_Sindh.jpg/1280px-Ranikot_Fort_-_The_Great_Wall_of_Sindh.jpg')` }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-orange-200/80 shadow-md shadow-amber-900/[0.03]">
              <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Module 04: Advanced AI Agentic Framework</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-sans leading-tight tracking-tight">
                Multi-Agent Guardrails
              </h2>
              <p className="text-stone-700 text-lg leading-relaxed">
                Experience Pakistan's historical treasures securely. Our new agentic framework dynamically designs custom historical expeditions while running programmatic background validation loops against active road closures and live safety alerts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Deterministic Guardrails</strong> Blocks out-of-scope or unrelated requests with zero execution leak.</p>
                </div>
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-600 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-gray-600"><strong className="text-stone-900 block mb-0.5">Live Safety Validations</strong> Cross-checks global and local news layers prior to finalizing transit plans.</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('planner')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-lg transition shadow-md flex items-center gap-2 group text-base"
                >
                  <span>Launch Agentic Tour Planner</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4 max-w-sm mx-auto">
                <div className="text-xs uppercase tracking-widest font-mono text-stone-500 border-b border-stone-200 pb-2">LangGraph Pipeline Monitor</div>
                <div className="flex items-center gap-3 text-xs text-emerald-400 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span>[Node: Guardrail] Intent Approved</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-amber-400 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span>[Node: Planner] Structuring Route...</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-stone-400"></div>
                  <span>[Node: Live Validator] Awaiting...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Divider Line */}
        <CraftsmanshipBorder />

        {/* MODULE 05: WEBAR RECONSTRUCTION GAMIFICATION */}
        <div className="relative bg-[#FAF4EB]/90 py-24 overflow-hidden border-t border-b border-amber-600/15">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.25] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1694475128245-999b1ae8a44e?w=1200')` }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-orange-200/80 shadow-md shadow-amber-900/[0.03]">
              <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Module 05: Augmented Reality Integration</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-sans leading-tight tracking-tight">
                Learn with AR: Reassembling History
              </h2>
              <p className="text-stone-700 text-lg leading-relaxed">
                Priceless stucco mural paintings discovered at the <strong>Jinnan Wali Dheri monastery in Taxila</strong> are heavily shattered, presenting massive visual challenges to museum visitors. HeritageAI introduces an interactive tool.
              </p>
              <p className="text-stone-600 font-sans font-light leading-relaxed text-base">
                Our platform implements a custom computer vision pipeline using Mind-AR. Point your device camera directly at the fragmented artifact tray—the system matches the target image to launch an interactive puzzle challenge that makes historical learning active and engaging.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-700 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-stone-600"><strong className="text-stone-900 block mb-0.5">Camera Feature Tracking</strong> Employs a pre-compiled target matrix to recognize the artifact's unique contours instantly.</p>
                </div>
                <div className="flex items-start space-x-3 bg-[#FDFBF7]/90 p-4 rounded-lg border border-stone-200/60">
                  <div className="text-amber-700 font-bold mt-0.5">✓</div>
                  <p className="text-sm text-stone-600"><strong className="text-stone-900 block mb-0.5">Interactive Canvas Grid</strong> Uses an HTML5 canvas drawing matrix to handle piece shuffling and swapping dynamically.</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('learn-ar')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-lg transition shadow-md flex items-center gap-2 group text-base"
                >
                  <span>Launch AR Experience ⚡</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4 max-w-sm mx-auto group">
                <div className="text-xs uppercase tracking-widest font-mono text-stone-500 border-b border-stone-200 pb-2 flex justify-between">
                  <span>WebXR Target Stream</span>
                  <span className="text-amber-700 font-bold">IDX::04_GANDHARA</span>
                </div>

                {/* Container Workspace Frame */}
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-200 relative shadow-inner">
                  {/* Laser Grid Scan Line Animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-amber-500 shadow-[0_0_14px_#d97706] opacity-90 animate-[homeScanLine_3.5s_linear_infinite] z-10"></div>

                  {/* Image Elements displaying inside window boundaries via object-contain properties */}
                  <img
                    src="/assets/restored-buddha.png"
                    alt="AI Reconstructed Buddha Painting Matrix"
                    className="w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out absolute inset-0 z-5 bg-stone-950"
                  />
                  <img
                    src={BuddhaPaintingImg}
                    alt="Fragmented baseline reference target profile"
                    className="w-full h-full object-contain opacity-100 group-hover:opacity-0 transition-all duration-700 ease-in-out absolute inset-0 bg-stone-950"
                  />

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center z-10 pointer-events-none">
                    <span className="absolute bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded border border-amber-600/40 font-mono text-[10px] text-amber-500 tracking-wider uppercase group-hover:scale-95 group-hover:opacity-0 transition-all duration-500">
                      Matrix Scanner Active
                    </span>
                    <span className="absolute bg-emerald-950/80 backdrop-blur-sm px-3 py-1.5 rounded border border-emerald-500/40 font-mono text-[10px] text-emerald-400 tracking-wider uppercase scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                       AI Match Complete
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-stone-500 font-mono pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Tracking Sync: OK
                  </span>
                  <span className="text-stone-500 group-hover:text-emerald-600 font-semibold transition-colors duration-300">
                    Hover to Scan Frame
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation Embed for the scanning indicator line */}
        <style>{`
          @keyframes homeScanLine {
            0% { top: 0%; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>

      </div>

      {/* Featured Heritage Sites Grid */}
      <div className="bg-[#FAF6F0] py-24 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-900 mb-12 font-sans tracking-tight">
            Featured Heritage Sites
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sites.map(site => (
              <div key={site.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer border border-stone-200/40" onClick={() => setCurrentPage(`site-${site.id}`)}>
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img src={site.image} alt={site.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-stone-900">{site.name}</h3>
                    <span className="text-sm text-amber-600 font-semibold">{site.era}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{site.description}</p>
                  <button className="text-amber-600 font-semibold flex items-center space-x-1 hover:text-amber-700 text-sm">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center shadow-xl shadow-orange-950/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans tracking-tight">
            Ready to Explore?
          </h2>
          <p className="text-xl text-amber-50 mb-8">
            Join thousands discovering Pakistan's rich cultural heritage
          </p>
          {/* FIXED: Removed duplicate onClick and className properties */}
          <button
            onClick={() => setCurrentPage(user ? 'upload' : 'signup')}
            className="bg-white text-amber-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition inline-flex items-center space-x-2 shadow-md"
          >
            <span>Get Started Free</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;