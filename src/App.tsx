/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Calendar, Clock, Utensils, GlassWater, MessageSquareHeart, ChevronDown, Loader2, Phone } from 'lucide-react';
import heic2any from 'heic2any';

// --- Types ---
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// --- Constants ---
const WEDDING_DATE = new Date('2026-12-27T15:00:00');
const EVENT_TITLE = "Wedding Lunch: H&N";
const EVENT_DESCRIPTION = "Join us for our wedding lunch celebration.";
const EVENT_LOCATION = "ደብረ አሚን አቡነ ተክለሃይማኖት, በሰንበት ትምህርት ቤት አዳራሽ";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6sbAkZxe3K8KxeVdA";
const HERO_IMAGE = "/hero-image-1.jpg";
const INVITATION_TEXT = "በክብር ተጋብዘዋል";

const GALLERY_IMAGES = [
  "/hero-image-1.jpg",
  "/gallery-1.jpg",
  "/gallery-2.jpg",
  "/gallery-3.jpg",
  "/gallery-4.jpg",
  "/gallery-5.jpg",
  "/gallery-6.jpg",
  "/gallery-7.jpg",
  "/gallery-8.jpg",
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// --- Helpers ---
const createGoogleCalendarLink = (date: Date) => {
  const start = new Date(date);
  start.setHours(12, 0, 0); // Lunch at 12:00 PM
  const end = new Date(start);
  end.setHours(16, 0, 0); // Ends around 4:00 PM

  const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const title = encodeURIComponent(EVENT_TITLE);
  const details = encodeURIComponent(EVENT_DESCRIPTION);
  const location = encodeURIComponent(EVENT_LOCATION);
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start)}/${format(end)}&details=${details}&location=${location}`;
};

const formatGregorianDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatEthiopianDate = (date: Date, includeWeekday: boolean = false) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  if (includeWeekday) options.weekday = 'long';

  const formatter = new Intl.DateTimeFormat('am-ET-u-ca-ethiopic', options);
  
  const parts = formatter.formatToParts(date);
  const weekday = parts.find(p => p.type === 'weekday')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;

  if (includeWeekday && weekday) {
    return `${weekday}, ${month} ${day}, ${year}`;
  }
  return `${month} ${day}, ${year}`;
};

// --- Components ---

interface RevealProps {
  children: ReactNode;
  delay?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
    transition={{ 
      duration: 1.2, 
      delay, 
      ease: [0.22, 1, 0.36, 1] // Quintic easeOut for a more premium "liquid" feel
    }}
  >
    {children}
  </motion.div>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center font-sans">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-light text-white">{item.value.toString().padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-16">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6 tracking-tight leading-tight">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-[1px] w-8 md:w-16 bg-champagne/30" />
        <div className="w-2 h-2 rounded-full border border-champagne/40" />
        <div className="h-[1px] w-8 md:w-16 bg-champagne/30" />
      </div>
    </motion.div>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="text-champagne font-medium uppercase text-xs"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const LazyImage = ({ src, className, alt }: { src: string; className?: string; alt?: string }) => {
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    const fullSrc = src.startsWith('/') ? src : `/${src}`;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(fullSrc);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const blob = await response.blob();
        
        // Check for HEIC signature in magic bytes or mime type
        const isHeicMime = blob.type === 'image/heic' || blob.type === 'image/heif';
        const isHeicExt = fullSrc.toLowerCase().endsWith('.heic') || fullSrc.toLowerCase().endsWith('.heif');
        
        // Read first few bytes for magic check (ftyp)
        const buffer = await blob.slice(0, 24).arrayBuffer();
        const header = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        const isHeicMagic = header.includes('6674797068656963') || // ftypheic
                            header.includes('667479706d696631') || // ftypmif1
                            header.includes('6674797068656976');    // ftypheiv

        if (isHeicMime || isHeicExt || isHeicMagic) {
          try {
            const result = await heic2any({
              blob,
              toType: 'image/jpeg',
              quality: 0.8
            });
            const finalBlob = Array.isArray(result) ? result[0] : result;
            objectUrl = URL.createObjectURL(finalBlob);
            setConvertedUrl(objectUrl);
          } catch (heicErr) {
            console.warn('HEIC conversion failed, using as-is:', heicErr);
            setConvertedUrl(fullSrc);
          }
        } else {
          // Check if it's actually an image by trying to create an object URL anyway
          // or just use the source path
          setConvertedUrl(fullSrc);
        }
      } catch (err) {
        console.error('Error loading image:', err, fullSrc);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {loading && (
        <div className="absolute inset-0 bg-charcoal/5 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-champagne animate-spin opacity-40" />
        </div>
      )}
      {convertedUrl && !error && (
        <img
          src={convertedUrl}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 ease-out`}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
      {error && (
        <div className="absolute inset-0 bg-charcoal/5 flex flex-col items-center justify-center text-charcoal/30 p-4">
          <MessageSquareHeart className="w-6 h-6 mb-2 opacity-20" />
          <span className="text-[10px] tracking-widest uppercase">Image Unavailable</span>
        </div>
      )}
    </div>
  );
};

const Envelope = ({ onOpen }: { onOpen: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(onOpen, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(20px)" }}
      className={`fixed inset-0 z-[100] bg-[#FDFCF9] flex items-center justify-center transition-all duration-1000 ease-in-out ${isOpen ? 'p-0' : 'p-6 md:p-12'}`}
      id="envelope-overlay"
    >
      <div 
        className={`relative cursor-pointer group transition-all duration-1000 ease-in-out ${
          isOpen 
            ? 'w-full h-full max-w-none shadow-none rounded-none' 
            : 'w-full max-w-lg aspect-[3/2] shadow-2xl rounded-sm'
        }`}
        onClick={handleOpen}
        style={{ perspective: '2000px' }}
        id="envelope-interactive"
      >
        {/* Main Envelope Body */}
        <div 
          className={`absolute inset-0 bg-[#F5F2EA] border-charcoal/5 transition-all duration-1000 ${isOpen ? 'border-0' : 'border shadow-none'}`} 
          id="envelope-base"
        />

        {/* The Card (Inside) */}
        <motion.div 
          animate={{ 
            y: isOpen ? '-25%' : '0%', 
            scale: isOpen ? 1.05 : 1,
            opacity: isOpen ? 1 : 0.9 
          }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          className={`absolute inset-[10%] bg-white z-10 flex flex-col items-center justify-center p-8 md:p-16 border border-charcoal/5 transition-shadow duration-1000 ${isOpen ? 'shadow-2xl' : 'shadow-sm'}`}
          id="invitation-card"
        >
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <p className="font-amharic italic text-2xl md:text-5xl text-charcoal/90 text-center leading-tight mb-4">
              {INVITATION_TEXT}
            </p>
            <div className="w-16 h-px bg-champagne my-6 md:my-10" id="card-divider" />
            <p className="text-xs md:text-sm uppercase tracking-[0.6em] text-charcoal/50 font-medium">
              H & N
            </p>
          </motion.div>
        </motion.div>

        {/* Lower Flap (Pocket) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[60%] bg-[#F5F2EA] z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]" 
          style={{ clipPath: 'polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0% 100%)' }} 
          id="envelope-pocket"
        />

        {/* Upper Flap */}
        <motion.div 
          animate={{ rotateX: isOpen ? -175 : 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-0 left-0 w-full h-[60%] bg-[#EFECE4] origin-top z-30 shadow-md border-t border-charcoal/5 flex items-end justify-center"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformStyle: 'preserve-3d' }}
          id="envelope-flap"
        >
          {!isOpen && (
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="mb-10 w-16 h-16 bg-[#801818] z-40 relative flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_-4px_8px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(255,255,255,0.2)]"
              style={{ 
                borderRadius: '48% 52% 50% 50% / 50% 48% 52% 50%',
                border: '1px solid rgba(0,0,0,0.2)'
              }}
              id="seal-wax"
            >
              {/* Inner ring for the "stamp" effect */}
              <div className="absolute inset-1.5 rounded-full border-2 border-black/10 opacity-40 shadow-inner" />
              <span className="text-[#FDFCF9]/90 font-serif text-xl font-bold tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] select-none">
                H&N
              </span>
            </motion.div>
          )}
        </motion.div>

        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full"
            id="envelope-hint"
          >
            <p className="text-charcoal/30 uppercase tracking-[0.5em] text-[10px] font-bold font-sans animate-pulse">
              Click to uncover the joy
            </p>
            <ChevronDown className="text-charcoal/20 animate-bounce" size={20} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const handleCalendarClick = (e: React.MouseEvent) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    e.preventDefault();
    
    const start = new Date(WEDDING_DATE);
    start.setHours(12, 0, 0); // Lunch at 12:00 PM
    const end = new Date(start);
    end.setHours(16, 0, 0); // Ends around 4:00 PM

    const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";
    
    const startDate = formatICSDate(start);
    const endDate = formatICSDate(end);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//H&N Wedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${EVENT_TITLE}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `DESCRIPTION:${EVENT_DESCRIPTION}`,
      `LOCATION:${EVENT_LOCATION}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding-hn.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setGalleryIndex((prev) => (prev + newDirection + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  return (
    <div className="bg-cream min-h-screen text-charcoal selection:bg-champagne/20 overflow-x-hidden">
      <AnimatePresence>
        {!isOpened && <Envelope onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      {/* Main Content (Nav + Sections) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpened ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        {/* Global Floral Decorations */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-80 backdrop-grayscale-[0.5]">
          <motion.img 
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: [0, 15, 0],
              rotate: [12, 13, 12]
            }}
            transition={{ 
              opacity: { duration: 2 },
              x: { duration: 2 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            src="https://images.unsplash.com/photo-1523626752472-b55a629f735a?auto=format&fit=crop&q=80&w=1000" 
            className="absolute -top-10 -left-10 w-[30rem] md:w-[45rem] mix-blend-darken contrast-125"
            id="floral-top-left"
            alt=""
            referrerPolicy="no-referrer"
          />
          <motion.img 
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: [0, -15, 0],
              rotate: [-12, -13, -12]
            }}
            transition={{ 
              opacity: { duration: 2 },
              x: { duration: 2 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }}
            src="https://images.unsplash.com/photo-1523626752472-b55a629f735a?auto=format&fit=crop&q=80&w=1000" 
            className="absolute -bottom-10 -right-10 w-[30rem] md:w-[45rem] scale-x-[-1] mix-blend-darken contrast-125"
            id="floral-bottom-right"
            alt=""
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Petals Layer Removed */}

        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-[#171515]">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-xl tracking-tighter"
          >
            H&N
          </motion.span>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium hidden md:flex">
            {['Home', 'The Day', 'Gallery'].map((item, i) => (
              <motion.a 
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + (i * 0.1) }}
                href={`#${item.toLowerCase().replace(' ', '')}`} 
                className="hover:text-champagne transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {/* 
                  OPACITY CONTROL: 
                  Change "opacity-100" to "opacity-80", "opacity-50", etc. 
                  to adjust the background image visibility.
              */}
              <LazyImage 
                src={HERO_IMAGE} 
                alt="Wedding Hero" 
                className="w-full h-full object-cover brightness-[0.7] contrast-[1.05] opacity-100"
              />
            </motion.div>
            {/* Floral Overlay on Hero */}
            <div className="absolute inset-0 opacity-30 mix-blend-soft-light pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover brightness-50 contrast-125"
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/60" />
          </div>

          <div className="relative z-10 text-center px-4 w-full max-w-4xl pt-10 md:mt-10">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="relative"
            >
              <p className="text-white font-sans uppercase tracking-[0.5em] text-[10px] md:text-sm mb-4 drop-shadow-sm">
                We are getting married
              </p>
              <h1 className="font-amharic italic font-bold text-6xl md:text-[101px] md:leading-[131px] text-white mb-6 drop-shadow-md">
                ሄኖክ <span className="italic font-amharic text-4xl md:text-7xl block md:inline opacity-80 font-light">እና</span> ናርዶስ
              </h1>
              <div className="flex flex-col items-center gap-6">
                <div className="h-px w-20 bg-white/20" />
                <div className="flex flex-col md:flex-row items-center gap-6 font-sans text-lg md:text-xl tracking-[0.3em] uppercase text-white drop-shadow-lg">
                  <span className="font-semibold">{formatGregorianDate(WEDDING_DATE)}</span>
                  <span className="hidden md:block opacity-30 text-2xl font-light">|</span>
                  <span className="font-amharic font-medium">{formatEthiopianDate(WEDDING_DATE)}</span>
                </div>
                <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                  <CountdownTimer />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-charcoal/40"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        <section id="day" className="py-24 md:py-40 bg-charcoal text-cream relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <div className="text-center mb-20">
                <h2 className="font-serif text-4xl md:text-6xl mb-4">
                  The Big Day
                </h2>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-champagne font-medium tracking-[0.3em] uppercase text-sm mb-1">
                    {WEDDING_DATE.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-cream/80 tracking-[0.3em] uppercase text-sm font-amharic">
                    {formatEthiopianDate(WEDDING_DATE, true)}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-16">
              {[
                { time: "06:00 Local Time / 12:00 PM", title: "የምሳ ፕሮግራም", icon: <Utensils />, location: "ደብረ አሚን አቡነ ተክለሃይማኖት, በሰንበት ትምህርት ቤት አዳራሽ" },
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.2}>
                  <div className="grid md:grid-cols-[1fr_2fr] gap-4 md:gap-12 group cursor-default">
                    <div className="flex md:flex-col items-center justify-center md:justify-start gap-4">
                      <span className="text-champagne font-mono text-lg tracking-widest text-center">{item.time}</span>
                      <div className="w-10 h-10 rounded-full border border-champagne/30 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-charcoal transition-all duration-500">
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-center md:text-left border-l border-white/10 pl-0 md:pl-12 py-2">
                      <h3 className="font-amharic font-bold text-2xl mb-2">{item.title}</h3>
                      <p className="text-cream/60 flex items-center justify-center md:justify-start gap-2 text-sm mb-4">
                        <MapPin size={14} className="text-champagne shrink-0" /> <span className="font-amharic">{item.location}</span>
                      </p>
                      {'detail' in item && item.detail && (
                        <p className="text-cream/40 text-sm leading-relaxed max-w-sm ml-auto mr-auto md:ml-0">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div className="mt-24 flex flex-col md:flex-row gap-6 justify-center items-center">
                <a 
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-champagne text-charcoal px-10 py-5 rounded-full font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-champagne-light hover:scale-105 transition-all shadow-xl"
                >
                  <MapPin size={18} />
                  Open in Google Maps
                </a>
                <a 
                  href={createGoogleCalendarLink(WEDDING_DATE)}
                  onClick={handleCalendarClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md text-white px-10 py-5 rounded-full font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-white/20 hover:scale-105 transition-all shadow-xl"
                >
                  <Calendar size={18} />
                  Add to Calendar
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 md:py-40 relative px-6">
          <Reveal>
            <SectionHeader title="Gallery" subtitle="Captured Moments" />
          </Reveal>
          <div className="max-w-4xl mx-auto flex justify-center">
            {/* Gallery Content with improved visibility */}
            <div className="relative group w-full max-w-sm">
              <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl relative bg-charcoal/10 border border-charcoal/5">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={galleryIndex}
                    custom={direction}
                    initial={(d: number) => ({ x: d > 0 ? '100%' : '-100%' })}
                    animate={{ x: 0 }}
                    exit={(d: number) => ({ x: d > 0 ? '-100%' : '100%' })}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full cursor-pointer touch-pan-y"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      if (x < rect.width / 2) {
                        paginate(-1);
                      } else {
                        paginate(1);
                      }
                    }}
                  >
                    <LazyImage
                      src={GALLERY_IMAGES[galleryIndex]}
                      className="w-full h-full object-cover pointer-events-none"
                      alt={`Gallery moment ${galleryIndex + 1}`}
                    />
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Slider Controls */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center items-center z-20 pointer-events-none">
                  <div className="flex gap-1.5 md:gap-2">
                    {GALLERY_IMAGES.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${i === galleryIndex ? 'bg-champagne w-6 md:w-8' : 'bg-white/40 w-1.5 md:w-2'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-champagne/10 py-12 border-t border-charcoal/5 text-center px-6">
          <p className="text-sm uppercase tracking-[0.1em] text-charcoal/40 font-amharic font-bold">የእርሶንም ያማረ ዲጂታል መጥሪያ ያሰሩ</p>
          <p className="text-charcoal/40">•</p>
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal/40 mt-2">
            <span>0921058888</span>
            <Phone size={14} />
            <span>0936686830</span>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
