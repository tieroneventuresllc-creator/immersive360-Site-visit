import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ClipboardList,
  Layers,
  Box,
  ChevronDown,
  ChevronUp,
  Camera,
  MapPin,
  Check,
  Download,
  FileCode,
  BoxSelect,
  Sparkles,
  FileJson,
  Database,
  ExternalLink,
  Zap,
  HardHat,
  Eye,
  Info,
  Users,
  Calendar,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  Search,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Lock,
  Sun,
  Moon
} from 'lucide-react';

const App = () => {
  const brandColor = "#1F8cac";
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sector, setSector] = useState('commercial'); 
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(true);
  const [isDemosOpen, setIsDemosOpen] = useState(false);
  const [expandedTier, setExpandedTier] = useState(null);
  
  const [clientInfo, setClientInfo] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    notes: '',
    preferredDate: '',
    siteVisitDate: '',
    consultationDate: '',
    consultationTime: '10:00 AM',
    travelZone: '0',
    incentive: 'none',
    publicSpacePercent: '0'
  });

  // Pricing State
  const [commSizeIdx, setCommSizeIdx] = useState(0);
  const [commTier, setCommTier] = useState('tier3');
  const [commAddons, setCommAddons] = useState([]);
  const [resSizeIdx, setResSizeIdx] = useState(0);
  const [resPackage, setResPackage] = useState('photo');
  const [resAddons, setResAddons] = useState([]);

  // TBD Items for Commercial
  const [tbdItems, setTbdItems] = useState({
    renderings: false,
    cadFileTbd: false,
    bimFileTbd: false
  });

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Constants
  const demoLinks = [
    { cat: "Corporate", name: "Quantum", url: "https://my.immersive360.tech/en/tour/quantum" },
    { cat: "Auto", name: "Dealership Demo", url: "https://captur3d.io/view/dealership-demo/dealershipdemo" },
    { cat: "Fitness", name: "Iron Culture", url: "https://captur3d.io/view/iron-culture-cedar-knolls/northbergen" },
    { cat: "Education", name: "My Little University", url: "https://my.immersive360.tech/en/tour/mylittleuniversity" },
    { cat: "Healthcare", name: "Long Term Care", url: "https://my.immersive360.tech/en/tour/longtermcare" },
    { cat: "Sports", name: "Padel Haus", url: "https://my.immersive360.tech/en/tour/padelhaus" },
    { cat: "Events", name: "The Manhattan Center", url: "https://my.immersive360.tech/en/tour/themanhattancenter" },
    { cat: "Mobile", name: "Cigar Lounge", url: "https://my.immersive360.tech/en/tour/themobilecigarlounge" },
    { cat: "AI", name: "Treedis TAI", url: "https://www.treedis.com/product-by-feature/tai" },
  ];

  const tierDetails = {
    tier3: ["4K Matterport Digital Twin", "5-10 4K Interior Photos", "6 Months Hosting", "Basic Info Tags"],
    tier2: ["All Essentials Included", "15-20 4K Interior Photos", "1 Year Hosting", "Custom Branding", "Google Street View Integration"],
    tier1: ["All Stand Out Included", "30+ 4K Interior Photos", "2 Years Hosting", "Advanced Multimedia Tags", "MatterPak / E57 Discount"],
    photo: ["Professional Wide Angle HDR", "Blue Sky Replacement", "Vertical/Portrait Crops", "Next-Day Delivery"],
    bundle: ["25+ HDR Photos", "Full 3D Walkthrough", "2D Floor Plan with Dimensions", "MLS / Zillow Ready Links"]
  };

  const getTechnicalPrice = (base, stepIdx) => base + (stepIdx * 50);

  const commercialSizes = [
    { id: 'small', name: 'Up to 2,500 sq ft', tier3: 450, tier2: 580, tier1: 710 },
    { id: 'medium', name: '2,501 - 5,000 sq ft', tier3: 650, tier2: 780, tier1: 910 },
    { id: 'large', name: '5,001 - 10,000 sq ft', tier3: 850, tier2: 1020, tier1: 1190 },
    { id: 'xl', name: '10,001 - 15,000 sq ft', tier3: 1150, tier2: 1370, tier1: 1590 },
    { id: 'xxl', name: '15,001 - 20,000 sq ft', tier3: 1550, tier2: 1830, tier1: 2110 },
    { id: 'deluxe', name: '30,001 - 50,000 sq ft', tier3: 2650, tier2: 3080, tier1: 3510 },
  ];

  const residentialSizes = [
    { id: 'small', name: 'Up to 2,000 sq ft', photo: 249, bundle: 380, addons: { mp: 95, floor2d: 95, floor3d: 125, droneBoth: 450, staging: 45 } },
    { id: 'medium', name: '2,000 - 3,000 sq ft', photo: 375, bundle: 565, addons: { mp: 145, floor2d: 145, floor3d: 175, droneBoth: 500, staging: 45 } },
    { id: 'large', name: '3,000 - 4,000 sq ft', photo: 449, bundle: 765, addons: { mp: 220, floor2d: 195, floor3d: 215, droneBoth: 600, staging: 45 } }
  ];

  const getPrice = (id) => {
    if (sector === 'commercial') {
      if (id === 'google') return (commSizeIdx <= 2 ? 45 : 65);
      if (id === 'floorPlan') return getTechnicalPrice(95, commSizeIdx);
      if (id === 'revit') return getTechnicalPrice(200, commSizeIdx);
      if (id === 'e57') return getTechnicalPrice(270, commSizeIdx);
      if (id === 'droneP') return (commSizeIdx >= 5 ? 675 : 275);
    } else {
      const size = residentialSizes[resSizeIdx];
      return size.addons[id] || 0;
    }
    return 0;
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    if (sector === 'commercial') {
      subtotal += commercialSizes[commSizeIdx][commTier];
      commAddons.forEach(a => subtotal += getPrice(a));
    } else {
      subtotal += resPackage === 'bundle' ? residentialSizes[resSizeIdx].bundle : residentialSizes[resSizeIdx].photo;
      resAddons.forEach(a => {
        if (resPackage === 'bundle' && (a === 'mp' || a === 'floor2d')) return;
        subtotal += getPrice(a);
      });
    }

    let flatDiscount = 0;
    if (clientInfo.incentive === 'commitment') flatDiscount = 50;
    if (clientInfo.incentive === 'veteran') flatDiscount = 35;
    if (clientInfo.incentive === 'repeat') flatDiscount = 25;
    if (clientInfo.incentive === 'friends') flatDiscount = 20;

    const travelFee = parseInt(clientInfo.travelZone);
    const publicSpaceSurcharge = subtotal * (parseInt(clientInfo.publicSpacePercent) / 100);

    return { 
      subtotal: Math.round(subtotal), 
      discount: flatDiscount,
      travelFee, 
      publicSpaceFee: Math.round(publicSpaceSurcharge),
      grand: Math.round(subtotal - flatDiscount + travelFee + publicSpaceSurcharge) 
    };
  }, [sector, commSizeIdx, commTier, commAddons, resSizeIdx, resPackage, resAddons, clientInfo]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y); ctx.stroke();
  };

  // Dynamic Tailwind Classes based on Theme
  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-[#f8f9fa]';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedText = isDarkMode ? 'text-white/50' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-zinc-900/30' : 'bg-white shadow-sm';
  const cardBorder = isDarkMode ? 'border-zinc-800/50' : 'border-slate-200';
  const inputBg = isDarkMode ? 'bg-zinc-900/50' : 'bg-slate-100/50';
  const inputBorder = isDarkMode ? 'border-zinc-800' : 'border-slate-300';
  
  const modernSelectClass = `w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700/50' : 'bg-white border-slate-300'} border rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] focus:ring-1 focus:ring-[#1F8cac] outline-none appearance-none cursor-pointer hover:${isDarkMode ? 'bg-zinc-800' : 'bg-slate-50'} transition-all ${isDarkMode ? 'text-white' : 'text-slate-900'} font-medium`;

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} font-sans overflow-x-hidden p-4 md:p-8 transition-colors duration-300`}>
      {isDarkMode && <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#111_0%,_transparent_50%)] pointer-events-none"></div>}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex-1 flex justify-start items-center gap-4">
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-full border transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-yellow-400 hover:bg-zinc-800' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>

          <div className="text-center group">
            <h1 className={`text-4xl md:text-5xl font-light tracking-tighter ${textColor} uppercase`}>
              IMMERSIVE <span className="text-red-600 font-light">360</span>
            </h1>
            <p className={`text-[10px] tracking-[0.5em] ${isDarkMode ? 'text-white/40' : 'text-slate-400'} font-black uppercase mt-2`}>Site Evaluation & Project Proposal</p>
          </div>

          <div className="flex-1 flex justify-end relative">
            <button 
              onClick={() => setIsDemosOpen(!isDemosOpen)}
              className={`px-5 py-2.5 rounded-xl border ${isDarkMode ? 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'} transition-all flex items-center gap-2 text-xs font-bold shadow-lg`}
            >
              <Eye size={14} /> View Live Demos <ChevronDown size={14} className={isDemosOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            {isDemosOpen && (
              <div className={`absolute top-full mt-2 right-0 w-72 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} border rounded-xl shadow-2xl z-[100] p-2 overflow-hidden animate-in`}>
                <div className="max-h-[400px] overflow-y-auto custom-scroll">
                  {demoLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-3 hover:bg-[#1F8cac]/10 rounded-lg group transition-colors border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'} last:border-0`}
                    >
                      <div>
                        <p className={`text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} font-black uppercase tracking-widest`}>{link.cat}</p>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} group-hover:text-[#1F8cac]`}>{link.name}</p>
                      </div>
                      <ExternalLink size={12} className={`${isDarkMode ? 'text-zinc-600' : 'text-slate-300'} group-hover:text-[#1F8cac]`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Navigation */}
        <div className="flex justify-center mb-10">
          <div className={`${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-200/50 border-slate-200'} p-1.5 rounded-2xl border flex shadow-inner transition-colors`}>
            <button onClick={() => setSector('commercial')} className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${sector === 'commercial' ? 'bg-[#1F8cac] text-white shadow-lg' : isDarkMode ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>COMMERCIAL</button>
            <button onClick={() => setSector('residential')} className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${sector === 'residential' ? 'bg-[#1F8cac] text-white shadow-lg' : isDarkMode ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>REAL ESTATE</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Project Logistics */}
            <section className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden transition-colors`}>
              <button onClick={() => setIsLogisticsOpen(!isLogisticsOpen)} className={`w-full flex items-center justify-between p-6 hover:${isDarkMode ? 'bg-zinc-900/40' : 'bg-slate-50'} transition-colors border-b ${isDarkMode ? 'border-zinc-800/20' : 'border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${isDarkMode ? 'bg-[#1F8cac]/10 border-[#1F8cac]/30' : 'bg-[#1F8cac]/5 border-[#1F8cac]/20'} rounded-lg flex items-center justify-center border`}>
                    <ClipboardList size={20} style={{color: brandColor}} />
                  </div>
                  <div className="text-left">
                    <h2 className={`text-lg font-bold ${textColor} tracking-tight`}>Project Logistics</h2>
                    <p className={`text-[10px] ${mutedText} font-black uppercase tracking-widest`}>Client, Region & Media</p>
                  </div>
                </div>
                {isLogisticsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isLogisticsOpen && (
                <div className="p-6 pt-0 space-y-6 animate-in mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Company Name</label>
                      <input type="text" className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] outline-none transition-colors ${textColor}`} value={clientInfo.company} onChange={e => setClientInfo({...clientInfo, company: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contact Person</label>
                      <input type="text" className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] outline-none transition-colors ${textColor}`} value={clientInfo.contactName} onChange={e => setClientInfo({...clientInfo, contactName: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 relative group">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-1 block">Travel Zone</label>
                      <div className="relative">
                        <select className={modernSelectClass} value={clientInfo.travelZone} onChange={e => setClientInfo({...clientInfo, travelZone: e.target.value})}>
                          <option value="0">NJ (North/Central)</option>
                          <option value="50">NJ (South Jersey/Shore) (+$50)</option>
                          <option value="150">NYC / Philly / AC (+$150)</option>
                          <option value="450">Out of State (+$450)</option>
                        </select>
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} pointer-events-none group-focus-within:text-[#1F8cac]`} />
                      </div>
                    </div>
                    <div className="space-y-1 relative group">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-1 block">Incentives</label>
                      <div className="relative">
                        <select className={modernSelectClass} value={clientInfo.incentive} onChange={e => setClientInfo({...clientInfo, incentive: e.target.value})}>
                          <option value="none">No Incentive Selection</option>
                          <option value="commitment">On Site Commitment (-$50)</option>
                          <option value="veteran">Veteran (-$35)</option>
                          <option value="repeat">Repeat Client (-$25)</option>
                          <option value="friends">Friends and Family (-$20)</option>
                        </select>
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} pointer-events-none group-focus-within:text-[#1F8cac]`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1"><Calendar size={10}/> Site Visit Date</label>
                      <input type="date" className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700/50' : 'bg-white border-slate-300'} border rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] outline-none ${textColor}`} value={clientInfo.siteVisitDate} onChange={e => setClientInfo({...clientInfo, siteVisitDate: e.target.value})} />
                    </div>
                    <div className="space-y-1 relative group">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1 mb-1"><Clock size={10}/> Consult Time</label>
                      <div className="relative">
                        <select className={modernSelectClass} value={clientInfo.consultationTime} onChange={e => setClientInfo({...clientInfo, consultationTime: e.target.value})}>
                          {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} pointer-events-none group-focus-within:text-[#1F8cac]`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1"><Search size={10}/> Preferred Date</label>
                      <input type="date" className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700/50' : 'bg-white border-slate-300'} border rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] outline-none ${textColor}`} value={clientInfo.preferredDate} onChange={e => setClientInfo({...clientInfo, preferredDate: e.target.value})} />
                    </div>
                    <div className="space-y-1 relative group">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1 mb-1"><Users size={10}/> Public Space</label>
                      <div className="relative">
                        <select className={modernSelectClass} value={clientInfo.publicSpacePercent} onChange={e => setClientInfo({...clientInfo, publicSpacePercent: e.target.value})}>
                          <option value="0">Standard (0%)</option>
                          <option value="5">Low Traffic (5%)</option>
                          <option value="10">Active (10%)</option>
                          <option value="15">High/Event (15%)</option>
                        </select>
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} pointer-events-none group-focus-within:text-[#1F8cac]`} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1"><FileText size={10}/> Internal Project Notes</label>
                    <textarea rows="2" placeholder="Specific access instructions, lighting notes..." className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-3 text-sm focus:border-[#1F8cac] outline-none transition-colors ${textColor}`} value={clientInfo.notes} onChange={e => setClientInfo({...clientInfo, notes: e.target.value})} />
                  </div>
                </div>
              )}
            </section>

            {/* Scale Slider */}
            <section className={`${cardBg} border ${cardBorder} rounded-2xl p-6 transition-colors`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Property Scale</h3>
                <div className="text-xs font-black text-[#1F8cac] px-4 py-1.5 bg-[#1F8cac]/10 border border-[#1F8cac]/20 rounded-lg">
                  {sector === 'commercial' ? commercialSizes[commSizeIdx].name : residentialSizes[resSizeIdx].name}
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max={sector === 'commercial' ? commercialSizes.length - 1 : residentialSizes.length - 1} 
                value={sector === 'commercial' ? commSizeIdx : resSizeIdx} 
                onChange={(e) => sector === 'commercial' ? setCommSizeIdx(parseInt(e.target.value)) : setResSizeIdx(parseInt(e.target.value))} 
                className={`w-full h-1.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-200'} rounded-lg appearance-none cursor-pointer accent-[#1F8cac]`} 
              />
            </section>

            {/* Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(sector === 'commercial' ? ['tier3', 'tier2', 'tier1'] : ['photo', 'bundle']).map(id => {
                const active = sector === 'commercial' ? commTier === id : resPackage === id;
                const price = sector === 'commercial' ? commercialSizes[commSizeIdx][id] : (id === 'photo' ? residentialSizes[resSizeIdx].photo : residentialSizes[resSizeIdx].bundle);
                const label = sector === 'commercial' ? { tier3: 'Essentials', tier2: 'Stand Out', tier1: 'All In' }[id] : (id === 'photo' ? 'HDR Photos' : 'Premium Bundle');
                const isExpanded = expandedTier === id;

                return (
                  <div key={id} className="relative">
                    <div 
                      onClick={() => sector === 'commercial' ? setCommTier(id) : setResPackage(id)} 
                      className={`group p-6 rounded-2xl border transition-all cursor-pointer flex flex-col h-full ${active ? 'bg-[#1F8cac] border-[#1F8cac] text-white shadow-xl shadow-[#1F8cac]/30' : isDarkMode ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                    >
                      <div className="mb-4">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? 'text-white/70' : isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</p>
                        <div className="text-3xl font-medium tracking-tight">${price}</div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setExpandedTier(isExpanded ? null : id); }}
                        className={`mt-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${active ? 'text-white/80' : isDarkMode ? 'text-zinc-400' : 'text-slate-500'} hover:text-white transition-colors`}
                      >
                        {isExpanded ? 'Hide Specs' : 'View Specs'} {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-60 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <ul className="space-y-2 border-t border-white/10 pt-4">
                          {tierDetails[id].map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] leading-tight">
                              <Check size={10} className="mt-0.5 flex-shrink-0" /> {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 flex items-center justify-between text-[10px] font-black uppercase">
                        <span>{active ? 'Selected' : 'Select'}</span>
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${active ? 'bg-white border-white text-[#1F8cac]' : isDarkMode ? 'border-zinc-700' : 'border-slate-300'}`}>{active && <Check size={14} strokeWidth={4} />}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2">
                  <Zap size={14} className="text-[#1F8cac]" />
                  <h3 className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} tracking-[0.2em]`}>Premium Marketing</h3>
                </div>
                <div className="space-y-2">
                  {(sector === 'commercial' ? [
                    { id: 'google', name: 'Google Street View', icon: <MapPin size={14} /> },
                    { id: 'droneP', name: 'Aerial Photography', icon: <Camera size={14} /> },
                    { id: 'renderings', name: 'Virtual Renderings', icon: <Sparkles size={14} />, isTbd: true }
                  ] : [
                    { id: 'mp', name: 'Matterport 3D Tour', icon: <Box size={14} /> },
                    { id: 'droneBoth', name: 'Aerial Package', icon: <Camera size={14} /> },
                    { id: 'staging', name: 'Virtual Staging', icon: <Sparkles size={14} /> }
                  ]).map(a => {
                    const isInc = sector === 'residential' && resPackage === 'bundle' && (a.id === 'mp');
                    const isActive = sector === 'commercial' ? (a.isTbd ? tbdItems.renderings : commAddons.includes(a.id)) : resAddons.includes(a.id);
                    return (
                      <button key={a.id} disabled={isInc} onClick={() => {
                        if (a.isTbd) { setTbdItems({...tbdItems, renderings: !tbdItems.renderings}); return; }
                        sector === 'commercial' ? setCommAddons(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id]) : setResAddons(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id]);
                      }} className={`w-full flex justify-between items-center p-4 rounded-xl border text-[10px] font-black transition-all ${isActive ? 'bg-[#1F8cac] text-white border-[#1F8cac] shadow-lg' : isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3 uppercase tracking-tight">
                          {a.icon} {a.name}
                        </div>
                        <span className={isActive ? 'text-white/80' : 'text-[#1F8cac]'}>
                          {isInc ? 'INCLUDED' : a.isTbd ? 'TBD' : `+$${getPrice(a.id)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2">
                  <HardHat size={14} className="text-[#1F8cac]" />
                  <h3 className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} tracking-[0.2em]`}>Technical Deliverables</h3>
                </div>
                <div className="space-y-2">
                  {(sector === 'commercial' ? [
                    { id: 'floorPlan', name: 'Floor Plan (2D)', icon: <Layers size={14} /> },
                    { id: 'revit', name: 'Revit/AutoCAD Export', icon: <FileCode size={14} /> },
                    { id: 'e57', name: 'E57 High-Density File', icon: <Database size={14} /> },
                    { id: 'cadFileTbd', name: 'CAD File Mapping', icon: <FileJson size={14} />, isTbd: true },
                    { id: 'bimFileTbd', name: 'BIM Generation', icon: <BoxSelect size={14} />, isTbd: true }
                  ] : [
                    { id: 'floor2d', name: '2D Schematic Floor Plan', icon: <Layers size={14} /> },
                    { id: 'floor3d', name: '3D Floor Plan', icon: <BoxSelect size={14} /> }
                  ]).map(a => {
                    const isInc = sector === 'residential' && resPackage === 'bundle' && (a.id === 'floor2d');
                    const isActive = sector === 'commercial' ? (a.isTbd ? tbdItems[a.id] : commAddons.includes(a.id)) : resAddons.includes(a.id);
                    return (
                      <button key={a.id} disabled={isInc} onClick={() => {
                        if (a.isTbd) { setTbdItems({...tbdItems, [a.id]: !tbdItems[a.id]}); return; }
                        sector === 'commercial' ? setCommAddons(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id]) : setResAddons(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id]);
                      }} className={`w-full flex justify-between items-center p-4 rounded-xl border text-[10px] font-black transition-all ${isActive ? (isDarkMode ? 'bg-zinc-100 text-black border-white' : 'bg-slate-800 text-white border-slate-800') : isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3 uppercase tracking-tight">
                          {a.icon} {a.name}
                        </div>
                        <span className={isActive ? (isDarkMode ? 'text-zinc-600' : 'text-slate-300') : isDarkMode ? 'text-zinc-400' : 'text-slate-400'}>
                          {isInc ? 'INCLUDED' : a.isTbd ? 'TBD' : `+$${getPrice(a.id)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-2xl space-y-6 transition-colors`}>
              <div className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'} pb-4 flex justify-between items-center`}>
                <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Project Investment</h3>
                {clientInfo.company && <span className="text-[10px] font-bold text-[#1F8cac] truncate max-w-[120px]">{clientInfo.company}</span>}
              </div>

              <div className="space-y-3">
                <div className={`flex justify-between text-xs font-bold ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <span>Gross Subtotal</span>
                  <span className={textColor}>${totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-emerald-500">
                    <span>Incentives Applied</span>
                    <span>-${totals.discount}</span>
                  </div>
                )}
                {totals.travelFee > 0 && <div className="flex justify-between text-xs font-bold text-red-500"><span>Regional Logistics</span><span>+${totals.travelFee}</span></div>}
                {totals.publicSpaceFee > 0 && <div className="flex justify-between text-xs font-bold text-[#1F8cac]"><span>Public Space</span><span>+${totals.publicSpaceFee}</span></div>}
              </div>

              <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                <div className={`text-5xl font-light ${textColor} tracking-tighter transition-colors`}>${totals.grand}</div>
                <div className={`text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} uppercase font-black mt-2 tracking-widest`}>Est. Final Investment</div>
              </div>

              <div className={`${isDarkMode ? 'bg-white' : 'bg-slate-50'} p-2 rounded-xl border ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'} shadow-inner`}>
                <div className="flex justify-between p-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Authorization Signature</span>
                </div>
                <canvas 
                  ref={canvasRef} 
                  width={400} height={100} 
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)}
                  onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={() => setIsDrawing(false)}
                  className="w-full h-24 bg-white rounded-lg cursor-crosshair touch-none"
                />
              </div>

              <button className="w-full bg-[#1F8cac] text-white hover:brightness-110 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase transition-all shadow-xl shadow-[#1F8cac]/30 active:scale-95">
                <Download size={16} /> Generate Proposal
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-20 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'} pt-12 pb-10`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#1F8cac]">
                <ShieldCheck size={18} />
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${textColor}`}>Usage & Rights</h4>
              </div>
              <p className={`text-[10px] ${mutedText} leading-relaxed font-medium`}>
                Immersive 360 grants a limited, non-exclusive license for marketing purposes. Raw data remains property of Immersive 360 unless specified.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                <CreditCard size={18} />
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${textColor}`}>Payment Terms</h4>
              </div>
              <p className={`text-[10px] ${mutedText} leading-relaxed font-medium`}>
                A <span className={textColor}>25% deposit</span> is required. Full balance is due on delivery. Late payments incur a 5% monthly charge.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={18} />
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${textColor}`}>Guarantee</h4>
              </div>
              <p className={`text-[10px] ${mutedText} leading-relaxed font-medium`}>
                Delivery within <span className={textColor}>48-72 hours</span>. Rescheduling within 24 hours incurs a $75 fee.
              </p>
            </div>
          </div>
          
          <div className={`mt-20 flex flex-col items-center gap-4 text-center border-t ${isDarkMode ? 'border-zinc-800/50' : 'border-slate-100'} pt-10`}>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'} mb-2`}>
              <Lock size={12} />
              <p className="text-[10px] font-bold uppercase tracking-widest max-w-xl">
                The provided information is proprietary and intended solely for the designated individual. Unauthorized sharing is <span className={isDarkMode ? 'text-red-900' : 'text-red-600'}>STRICTLY PROHIBITED</span>.
              </p>
            </div>
            <p className={`text-[9px] font-black ${isDarkMode ? 'text-zinc-700' : 'text-slate-300'} uppercase tracking-[0.5em]`}>© 2024 IMMERSIVE 360 TECH • ALL RIGHTS RESERVED</p>
          </div>
        </footer>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb { 
          -webkit-appearance: none; 
          width: 22px; 
          height: 22px; 
          background: #1F8cac; 
          border-radius: 8px; 
          border: 3px solid white; 
          cursor: pointer; 
          box-shadow: 0 4px 10px rgba(0,0,0,${isDarkMode ? '0.5' : '0.1'});
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${isDarkMode ? 'invert(1)' : 'invert(0)'};
          cursor: pointer;
          opacity: 0.6;
        }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#333' : '#cbd5e1'}; border-radius: 10px; }
        .animate-in { animation: in 0.2s ease-out; }
        @keyframes in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        
        select option {
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          color: ${isDarkMode ? 'white' : '#0f172a'};
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
