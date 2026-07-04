import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen } from 'lucide-react';

interface CollagePhoto {
  url: string;
  caption?: string;
  width: string; // Tailwind class e.g. "w-[240px] md:w-[300px]"
  aspectRatio?: string; // e.g., "aspect-square", "aspect-[3/4]"
  rotation: string; // e.g., "rotate-3", "-rotate-6"
  offsetX?: string; // e.g., "left-4", "right-6"
  offsetY?: string; // e.g., "top-10", "bottom-8"
  sticker?: string; // emoji e.g., "❤️"
  stickerPos?: string; // Tailwind placement e.g., "-top-2 -right-2"
  tape?: boolean; // Render a piece of washi tape
}

interface PageSticker {
  emoji: string;
  className: string;
}

interface PageData {
  title: string;
  date?: string;
  location?: string;
  photos: CollagePhoto[];
  pageStickers?: PageSticker[];
}

export default function MemoryAlbum3D() {
  const [activeSheet, setActiveSheet] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const totalSheets = 15; // Cover (0), Spread 1-13 (1-13), Closing/Back Cover (14)

  // Synthesize realistic paper rustle sweep sound using Web Audio API
  const playPageTurnSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Generate 0.35s white noise buffer
      const duration = 0.35;
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to shape white noise like rustling paper
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + duration - 0.05);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      // Volume gain envelope: rapid rise, exponential decay
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
    } catch (err) {
      console.log('Audio synthesis blocked by browser policy:', err);
    }
  };

  const handleNext = () => {
    if (activeSheet >= totalSheets - 1) return;
    setActiveSheet((prev) => prev + 1);
    playPageTurnSound();
  };

  const handlePrev = () => {
    if (activeSheet <= 0) return;
    setActiveSheet((prev) => prev - 1);
    playPageTurnSound();
  };

  const handleMobileNext = () => {
    if (mobilePage >= 28) return; // Stop at 28 (Final Note) so mobile page doesn't close to back cover
    setMobilePage((prev) => prev + 1);
    playPageTurnSound();
  };

  const handleMobilePrev = () => {
    if (mobilePage <= 0) return;
    setMobilePage((prev) => prev - 1);
    playPageTurnSound();
  };

  // Scrapbook Spreads Content (26 pages total) - Enlarged images, no duplicates, exactly 1-2 photos per page
  const albumPages: PageData[] = [
    {
      title: "Where It All Began",
      date: "October 2024",
      location: "RVSCET Main Building",
      photos: [
        {
          url: "/Journey/first_meeting.jpg",
          width: "w-[195px] md:w-[270px]",
          aspectRatio: "aspect-[4/3]",
          rotation: "-rotate-6",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "First sight... ❤️",
          tape: true
        },
        {
          url: "/Journey/first_message.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-8",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-16",
          caption: "Late chats 💬",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌸", className: "bottom-8 left-16" },
        { emoji: "✨", className: "top-4 right-24" }
      ]
    },
    {
      title: "Connected Hearts",
      date: "Oct - Nov 2024",
      location: "Late Nights",
      photos: [
        {
          url: "/Journey/first_call.jpg",
          width: "w-[190px] md:w-[260px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-6 md:top-8",
          caption: "5 hours flew by... 📞",
          tape: true
        },
        {
          url: "/Journey/first_videocall.jpg",
          width: "w-[190px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Hostel stairs call 🎥",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🧸", className: "bottom-6 right-20" },
        { emoji: "💖", className: "top-6 left-28" }
      ]
    },
    {
      title: "First Milestones",
      date: "January 12, 2025",
      location: "Surya Mandir",
      photos: [
        {
          url: "/Journey/first_date.jpg",
          width: "w-[200px] md:w-[280px]",
          aspectRatio: "aspect-[4/3]",
          rotation: "-rotate-3",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "First coffee date ☕",
          tape: true
        },
        {
          url: "/Journey/first_selfie.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-12",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "First selfie together! 📸",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "✨", className: "bottom-10 left-20" },
        { emoji: "🎈", className: "top-4 right-28" }
      ]
    },
    {
      title: "Laughter & Outings",
      date: "March 2025",
      location: "P&N Mall",
      photos: [
        {
          url: "/Journey/funniest_memories.jpg",
          width: "w-[195px] md:w-[270px]",
          aspectRatio: "aspect-[4/3]",
          rotation: "rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Bench laughs 😂",
          tape: true
        },
        {
          url: "/Journey/festival 1.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Beautiful outings 🌟",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🎬", className: "bottom-8 left-16" },
        { emoji: "✨", className: "top-4 right-24" }
      ]
    },
    {
      title: "Blessed Together",
      date: "November 2023",
      location: "RVSCET Garden",
      photos: [
        {
          url: "/Journey/festival 2.jpg",
          width: "w-[195px] md:w-[260px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-6 md:top-8",
          caption: "Stolen pictures & Warden 👀",
          tape: true
        },
        {
          url: "/Book/1.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-8",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Yellow Kurta Vibes 💛",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🧸", className: "bottom-6 right-20" },
        { emoji: "✨", className: "top-6 left-28" }
      ]
    },
    {
      title: "Sunset Ride",
      date: "June 2026",
      location: "Sunset Ride",
      photos: [
        {
          url: "/Journey/favorite_moment1.jpg",
          width: "w-[200px] md:w-[285px]",
          aspectRatio: "aspect-[4/3]",
          rotation: "-rotate-6",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Sunset ride 🌅",
          tape: true
        },
        {
          url: "/Journey/favorite_moment2.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-12 md:top-14",
          caption: "Riding together 🏍️",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🛵", className: "bottom-8 left-24" },
        { emoji: "❤️", className: "top-4 right-24" }
      ]
    },
    {
      title: "Golden Hours",
      date: "Memories Book",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/2.jpg",
          width: "w-[200px] md:w-[265px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Beautiful smile 😊",
          tape: true
        },
        {
          url: "/Book/3.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Special day 🎈",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌸", className: "bottom-8 left-16" },
        { emoji: "☕", className: "top-6 left-32" }
      ]
    },
    {
      title: "Soft Coffee mornings",
      date: "Memories Book",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/4.jpg",
          width: "w-[200px] md:w-[270px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Coffee details ☕",
          tape: true
        },
        {
          url: "/Book/5.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-12 md:top-14",
          caption: "Messy mornings 🧸",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "✨", className: "bottom-8 right-20" },
        { emoji: "🌈", className: "top-4 left-24" }
      ]
    },
    {
      title: "Cozy Fireplace",
      date: "Memories Book",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/6.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-3",
          offsetX: "left-3 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Comfort in winter ❄️",
          tape: true
        },
        {
          url: "/Book/7.png",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Fireside warmth 🔥",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🍀", className: "bottom-8 right-24" },
        { emoji: "🍰", className: "top-10 left-24" }
      ]
    },
    {
      title: "Anniversary sparklers",
      date: "Memories Book",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/8.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Sparkler magic ✨",
          tape: true
        },
        {
          url: "/Book/9.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-8",
          offsetX: "right-2 md:right-4",
          offsetY: "top-12 md:top-14",
          caption: "Sweet hugs 🤗",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌟", className: "bottom-8 left-20" },
        { emoji: "🤍", className: "top-4 right-24" }
      ]
    },
    {
      title: "Cozy Hugs",
      date: "Memories Book",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/10.jpg",
          width: "w-[195px] md:w-[255px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-3",
          offsetX: "left-3 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Quiet support 🤍",
          tape: true
        },
        {
          url: "/Book/11.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-16",
          caption: "Holding close 🤝",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "✨", className: "bottom-8 right-20" },
        { emoji: "🕊️", className: "top-4 left-24" }
      ]
    },
    {
      title: "Candid smiles",
      date: "January 2025",
      location: "College Steps",
      photos: [
        {
          url: "/Book/IMG-20250123-WA0000.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-3",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Hostel outings 🌸",
          tape: true
        },
        {
          url: "/Book/IMG-20250128-WA0011.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-8",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Warm tea mornings ☕",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌸", className: "bottom-8 left-16" },
        { emoji: "☕", className: "top-6 left-32" }
      ]
    },
    {
      title: "Stolen glances",
      date: "Feb - Apr 2025",
      location: "Campus grounds",
      photos: [
        {
          url: "/Book/IMG-20250226-WA0014.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-8",
          offsetX: "left-3 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Watching sunset 🌅",
          tape: true
        },
        {
          url: "/Book/IMG-20250402-WA0010.jpg",
          width: "w-[165px] md:w-[225px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-4",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Beautiful spring walk 🌿",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌿", className: "bottom-8 right-24" },
        { emoji: "✨", className: "top-10 left-24" }
      ]
    },
    {
      title: "Spring blossoms",
      date: "May 2025",
      location: "Garden walks",
      photos: [
        {
          url: "/Book/IMG-20250413-WA0028.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Happy captures 📸",
          tape: true
        },
        {
          url: "/Book/IMG-20250511-WA0025.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-12 md:top-16",
          caption: "Brightest smile 💛",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌻", className: "bottom-8 left-32" },
        { emoji: "🎈", className: "top-4 right-20" }
      ]
    },
    {
      title: "Summer strolls",
      date: "August 2025",
      location: "College Garden",
      photos: [
        {
          url: "/Book/IMG-20250803-WA0016.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Hostel evenings 🌿",
          tape: true
        },
        {
          url: "/Book/IMG-20250809-WA0013.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Walking hand in hand 🧸",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🍀", className: "bottom-8 right-24" },
        { emoji: "🌿", className: "top-6 left-28" }
      ]
    },
    {
      title: "Autumn walks",
      date: "December 2025",
      location: "Sunset Walk",
      photos: [
        {
          url: "/Book/IMG-20251201-WA0118.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-3",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Fading sunlight 🌅",
          tape: true
        },
        {
          url: "/Book/IMG-20260123-WA0010.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-8",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Warm winter cozy vibes ❄️",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🧣", className: "bottom-8 right-20" },
        { emoji: "✨", className: "top-6 left-32" }
      ]
    },
    {
      title: "Winter warmth",
      date: "January 2026",
      location: "Campus grounds",
      photos: [
        {
          url: "/Book/IMG-20260123-WA0013.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Soft sunbeams 💫",
          tape: true
        },
        {
          url: "/Book/IMG-20260123-WA0019.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Beautiful Kashish 🌸",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌟", className: "bottom-8 left-32" },
        { emoji: "🤍", className: "top-6 right-20" }
      ]
    },
    {
      title: "Spring smiles",
      date: "February 2026",
      location: "Happy afternoons",
      photos: [
        {
          url: "/Book/IMG-20260123-WA0023.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Lovely capture ❤️",
          tape: true
        },
        {
          url: "/Book/IMG-20260227-WA0020.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-8",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Shared happiness 😊",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🎈", className: "bottom-8 left-20" },
        { emoji: "🌸", className: "top-6 right-28" }
      ]
    },
    {
      title: "Cozy study support",
      date: "April 2026",
      location: "Library desk",
      photos: [
        {
          url: "/Book/IMG-20260404-WA0012.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-6",
          offsetX: "left-3 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Staying up late 📖",
          tape: true
        },
        {
          url: "/Book/IMG-20260429-WA0001.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-12 md:top-16",
          caption: "Candid laugh 😂",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "📚", className: "bottom-8 right-24" },
        { emoji: "🕯️", className: "top-6 left-28" }
      ]
    },
    {
      title: "Cozy sweaters",
      date: "June 2026",
      location: "Study hours",
      photos: [
        {
          url: "/Book/IMG-20260601-WA0004.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-4",
          offsetX: "left-2 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Messy study desks 📝",
          tape: true
        },
        {
          url: "/Book/IMG-20260601-WA0007.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Cute expression 🥹",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "💛", className: "bottom-8 left-32" },
        { emoji: "🌻", className: "top-6 right-20" }
      ]
    },
    {
      title: "Stolen smiles",
      date: "June 2026",
      location: "Outings",
      photos: [
        {
          url: "/Book/IMG-20260601-WA0009.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-3",
          offsetX: "left-2 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Warm gaze 👀",
          tape: true
        },
        {
          url: "/Book/IMG-20260601-WA0017.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-4",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Sweet moments 🤍",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "✨", className: "bottom-8 right-20" },
        { emoji: "🌹", className: "top-6 left-28" }
      ]
    },
    {
      title: "Everyday magic",
      date: "June 2026",
      location: "Outings",
      photos: [
        {
          url: "/Book/IMG-20260601-WA0020.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-8 md:top-10",
          caption: "Sunshine face ☀️",
          tape: true
        },
        {
          url: "/Book/IMG-20260601-WA0029.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Walking side-by-side 💖",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🎈", className: "bottom-8 left-32" },
        { emoji: "🤍", className: "top-6 right-20" }
      ]
    },
    {
      title: "Heart-to-Heart",
      date: "June 2026",
      location: "Scrapbook Desk",
      photos: [
        {
          url: "/Book/IMG-20260602-WA0008.jpg",
          width: "w-[200px] md:w-[260px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "-rotate-6",
          offsetX: "left-2 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Shared thoughts 🤝",
          tape: true
        },
        {
          url: "/Book/IMG-20260605-WA0006.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-6",
          offsetX: "right-2 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Happy together ✨",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "💞", className: "bottom-8 right-24" },
        { emoji: "✨", className: "top-6 left-28" }
      ]
    },
    {
      title: "Sweet Delights",
      date: "June 2026",
      location: "Desk Memories",
      photos: [
        {
          url: "/Book/IMG-20260620-WA0001.jpg",
          width: "w-[195px] md:w-[250px]",
          aspectRatio: "aspect-square",
          rotation: "-rotate-4",
          offsetX: "left-3 md:left-4",
          offsetY: "top-10 md:top-12",
          caption: "Cutest pose 🧸",
          tape: true
        },
        {
          url: "/Book/IMG-20260620-WA0002.jpg",
          width: "w-[160px] md:w-[220px]",
          aspectRatio: "aspect-[3/4]",
          rotation: "rotate-4",
          offsetX: "right-3 md:right-4",
          offsetY: "top-14 md:top-18",
          caption: "Special date night 🥂",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "🌸", className: "bottom-8 left-32" },
        { emoji: "💖", className: "top-6 right-20" }
      ]
    },
    {
      title: "Together Always",
      date: "June 2026",
      location: "Endless Road",
      photos: [
        {
          url: "/Book/IMG-20260207-WA0013.jpg",
          width: "w-[220px] md:w-[280px]",
          aspectRatio: "aspect-square",
          rotation: "rotate-4",
          offsetX: "left-10 md:left-12",
          offsetY: "top-10",
          caption: "We are forever ❤️",
          tape: true
        }
      ],
      pageStickers: [
        { emoji: "👑", className: "bottom-12 right-20" },
        { emoji: "✨", className: "top-4 right-16" }
      ]
    },
    {
      title: "Our Endless Story",
      date: "The Future",
      location: "All Our Tomorrows",
      photos: [],
      pageStickers: [
        { emoji: "🌸", className: "top-10 left-12" },
        { emoji: "🤍", className: "bottom-16 right-24 animate-pulse" },
        { emoji: "✨", className: "top-20 right-32" }
      ]
    }
  ];

  // Helper function to render a page's scrapbook content
  const renderCollagePageContents = (page: PageData, pageNum: number) => {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-5 md:p-6 text-love-dark select-none overflow-hidden bg-[#faf8f5]">
        {/* Header */}
        <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-[#8c827c] pb-1.5 border-b border-[#e2decb]">
          <span>{page.location || "Memory Book"}</span>
          <span>{page.date || "Our Story"}</span>
          <span>Page {pageNum}</span>
        </div>

        {/* Title */}
        <div className="pt-2 px-1 text-left relative z-10">
          <h5 className="font-serif text-xs md:text-sm font-semibold text-[#4a3a38] tracking-wide">
            {page.title}
          </h5>
        </div>

        {/* Collage Area */}
        <div className="relative flex-grow w-full h-[280px] md:h-[450px] my-1">
          {page.photos.map((photo, pIdx) => {
            const widthClass = photo.width || "w-36";
            const rotationClass = photo.rotation || "rotate-0";
            const positionClass = `${photo.offsetX || "left-4"} ${photo.offsetY || "top-4"}`;
            return (
              <div
                key={pIdx}
                className={`absolute ${widthClass} p-1.5 pb-3 bg-white border border-[#e5e1d5] shadow-xs rounded-[2px] transform ${rotationClass} ${positionClass} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 group/album-card`}
              >
                {/* Washi Tape */}
                {photo.tape && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-rose-gold/15 border border-rose-gold/15 opacity-60 backdrop-blur-xs select-none pointer-events-none rotate-[2deg] shadow-2xs"
                    style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)' }}
                  />
                )}

                {/* Main Photo */}
                <div className="relative w-full overflow-hidden bg-love-dark/5 border border-[#e2decb]/30 rounded-[1px]">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Scrapbook Memory"}
                    className="w-full h-auto block grayscale-[5%] group-hover/album-card:grayscale-0 transition-all duration-300 pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Caption text */}
                {photo.caption && (
                  <span className="font-cursive text-[7px] md:text-[8px] text-center block pt-1 text-[#5e5352] truncate">
                    {photo.caption}
                  </span>
                )}

                {/* Decorative sticker on photo */}
                {photo.sticker && (
                  <span className={`absolute ${photo.stickerPos || "-top-2 -right-2"} text-xs select-none pointer-events-none filter drop-shadow-sm`}>
                    {photo.sticker}
                  </span>
                )}
              </div>
            );
          })}

          {/* Page-level decoration stickers */}
          {page.pageStickers?.map((st, sIdx) => (
            <span key={sIdx} className={`absolute text-sm select-none pointer-events-none filter drop-shadow-xs ${st.className}`}>
              {st.emoji}
            </span>
          ))}

          {/* Sweet quote overlay for final page (Page 26) */}
          {page.photos.length === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 space-y-3">
              <Heart size={24} className="text-love-red animate-pulse" fill="currentColor" />
              <p className="font-cursive text-base md:text-lg text-rose-gold select-none leading-relaxed px-4">
                "Our story has no end... it's only just beginning."
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 relative">

      {/* SECTION ANCHOR TITLE */}
      <div className="flex items-center gap-2.5 mb-8">
        <BookOpen className="text-gold animate-pulse" size={20} />
        <h3 className="font-serif text-2xl text-soft-pink tracking-wide font-light">
          Open Our Memory Book
        </h3>
      </div>

      {/* 3D BOOK DESKTOP IMPLEMENTATION */}
      <div className="hidden md:block w-[960px] h-[640px] relative perspective-[1800px] select-none">

        {/* Book Binding Spine shadow overlay behind */}
        <div className="absolute left-1/2 top-0 w-8 h-full bg-[#1b0c16]/50 blur-xs -translate-x-1/2 z-0 pointer-events-none rounded-full" />

        {/* --- SHEET 0: FRONT COVER & INTRO --- */}
        <div
          className="absolute top-0 left-1/2 w-1/2 h-full transform-style-3d transition-transform duration-1000 origin-left"
          style={{
            transform: activeSheet > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            zIndex: activeSheet > 0 ? 10 : 50,
            pointerEvents: activeSheet === 0 ? 'auto' : 'none'
          }}
        >
          {/* FRONT COVER SIDE */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-r from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-r-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-between items-center text-center"
            style={{ transform: 'rotateY(0deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {/* Gold details */}
            <div className="w-full border-t border-b border-gold/30 py-1.5 text-[10px] tracking-[0.4em] text-gold uppercase font-light">
              Rohit & Kashish
            </div>

            <div className="space-y-4">
              <h4 className="font-serif text-4xl text-soft-pink text-glow-pink font-light tracking-widest">
                Our Journey
              </h4>
              <div className="flex justify-center items-center gap-2">
                <div className="h-[1px] w-6 bg-gold/50" />
                <Heart size={16} className="text-love-red animate-pulse" fill="currentColor" />
                <div className="h-[1px] w-6 bg-gold/50" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-gold font-light block">
                Est. 24 December 2024
              </span>
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-full border border-gold/40 text-gold text-[10px] uppercase tracking-widest hover:bg-gold/15 hover:border-gold transition-all duration-300 cursor-pointer hover-target animate-pulse"
              >
                Open Book
              </button>
            </div>
          </div>

          {/* BACK OF COVER (DEDICATION SCREEN) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f4] text-love-dark rounded-l-3xl p-10 flex flex-col justify-center items-center text-center shadow-inner border-r border-[#eceae2]"
            style={{ transform: 'rotateY(180deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="space-y-6 max-w-sm">
              <Heart size={20} className="text-love-red mx-auto animate-bounce" fill="currentColor" />
              <h5 className="font-serif text-lg tracking-wide italic text-[#4e3c3b]">
                Dedicated to Kashish
              </h5>
              <p className="text-xs font-light text-[#635352] leading-relaxed">
                "This book holds the pages of our lives, the quiet walks, the messy coffees, and the big laughs. Thank you for filling my years with magic, Kashish. This is our love story."
              </p>
              <div className="h-[1px] w-12 bg-rose-gold/50 mx-auto" />
              <span className="font-cursive text-base text-rose-gold">Love always, Rohit</span>
            </div>
          </div>
        </div>

        {/* --- SPREADS SHEETS 1 TO 13 (PAGES CONTENT) --- */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((sheetNum) => {
          const rightPage = albumPages[sheetNum * 2 - 2];
          const leftPage = albumPages[sheetNum * 2 - 1];
          const sheetIdx = sheetNum - 1; // 0 to 12

          return (
            <div
              key={sheetNum}
              className="absolute top-0 left-1/2 w-1/2 h-full transform-style-3d transition-transform duration-1000 origin-left"
              style={{
                transform: activeSheet > sheetNum ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                zIndex: activeSheet === sheetNum ? 45 : (activeSheet > sheetNum ? 10 + sheetIdx : 40 - sheetIdx),
                pointerEvents: activeSheet === sheetNum ? 'auto' : 'none'
              }}
            >
              {/* RIGHT PAGE FRONT SIDE (Shows when sheet is flat on right) */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] rounded-r-3xl border-l border-[#e2decb]/50 shadow-md flex flex-col justify-between"
                style={{ transform: 'rotateY(0deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                {renderCollagePageContents(rightPage, sheetNum * 2 - 1)}

                {/* Footer Controls */}
                <div className="flex justify-between items-center p-4 border-t border-[#e2decb] bg-[#faf8f5] rounded-br-3xl">
                  <button onClick={handlePrev} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={12} /> Back
                  </button>
                  <button onClick={handleNext} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* LEFT PAGE BACK SIDE (Shows when sheet flips to the left) */}
              <div
                className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] rounded-l-3xl border-r border-[#e2decb]/50 shadow-inner flex flex-col justify-between"
                style={{ transform: 'rotateY(180deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                {renderCollagePageContents(leftPage, sheetNum * 2)}

                {/* Footer Controls */}
                <div className="flex justify-between items-center p-4 border-t border-[#e2decb] bg-[#faf8f5] rounded-bl-3xl">
                  <button onClick={handlePrev} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={12} /> Back
                  </button>
                  {sheetNum < 13 ? (
                    <button onClick={handleNext} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                      Next <ChevronRight size={12} />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* --- SHEET 14: BACK COVER CLOSING (Controlled so it does not auto-flip left) --- */}
        <div
          className="absolute top-0 left-1/2 w-1/2 h-full transform-style-3d transition-transform duration-1000 origin-left"
          style={{
            transform: activeSheet > 14 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            zIndex: activeSheet === 14 ? 45 : 20,
            pointerEvents: activeSheet === 14 ? 'auto' : 'none'
          }}
        >
          {/* SPREAD FINAL NOTE SHEET FRONT */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] text-love-dark rounded-r-3xl border-l border-[#e2decb]/50 shadow-md p-10 flex flex-col justify-center items-center text-center"
            style={{ transform: 'rotateY(0deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="space-y-6 max-w-sm">
              <Sparkles className="text-gold mx-auto animate-pulse" size={24} />
              <h5 className="font-serif text-xl text-[#4a3a38] font-light tracking-wide">
                Our Story continues...
              </h5>
              <p className="text-xs font-light text-[#635352] leading-relaxed">
                "We have filled so many pages, Kashish, but the blank sheets ahead are the ones I look forward to most. Let's write the rest of our chapters, together."
              </p>
              <div className="pt-4">
                <button
                  onClick={handlePrev}
                  className="px-6 py-2 rounded-full border border-rose-gold/30 text-rose-gold text-[9px] uppercase tracking-widest hover:bg-rose-gold/10 hover:border-rose-gold transition-colors duration-300 cursor-pointer"
                >
                  Return to Book
                </button>
              </div>
            </div>
          </div>

          {/* BACK COVER SIDE (Shows closed book back cover) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-l from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-l-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-center items-center"
            style={{ transform: 'rotateY(180deg) translateZ(1px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="text-center space-y-4">
              <Heart size={24} className="text-gold/45 mx-auto" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-light block">
                The End of Chapter I
              </span>
            </div>
          </div>
        </div>

        {/* Central Spine Overlay */}
        <div className="absolute left-1/2 top-0 w-[8px] h-full bg-gradient-to-r from-black/35 via-transparent to-black/35 -translate-x-1/2 z-48 pointer-events-none" />

      </div>

      {/* 3D BOOK MOBILE FALLBACK VIEWER */}
      <div className="block md:hidden w-full px-4 max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobilePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {mobilePage === 0 ? (
              // Cover screen
              <div className="w-full h-[430px] bg-gradient-to-r from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-3xl border border-white/10 p-6 flex flex-col justify-between items-center text-center shadow-xl">
                <div className="w-full border-t border-b border-gold/30 py-1 text-[8px] tracking-[0.3em] text-gold uppercase font-light">
                  Rohit & Kashish
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-3xl text-soft-pink font-light tracking-wide">
                    Our Journey
                  </h4>
                  <Heart size={14} className="text-love-red mx-auto animate-pulse" fill="currentColor" />
                </div>
                <button
                  onClick={handleMobileNext}
                  className="px-6 py-2 rounded-full border border-gold/40 text-gold text-[9px] uppercase tracking-widest hover:bg-gold/10 cursor-pointer"
                >
                  Open Album
                </button>
              </div>
            ) : mobilePage === 1 ? (
              // Dedication page
              <div className="w-full h-[430px] bg-[#faf8f5] rounded-3xl border border-[#e2decb] p-6 flex flex-col justify-between items-center text-center shadow-xl text-love-dark">
                <div className="flex justify-between items-center w-full text-[7px] uppercase tracking-widest text-[#8c827c] pb-2 border-b border-[#e2decb]">
                  <span>Dedicated</span>
                  <span>Dedicated</span>
                </div>
                <div className="space-y-4 my-auto">
                  <Heart size={18} className="text-love-red mx-auto" fill="currentColor" />
                  <h5 className="font-serif text-md tracking-wide italic text-[#4e3c3b]">
                    Dedicated to Kashish
                  </h5>
                  <p className="text-[11px] font-light text-[#635352] leading-relaxed">
                    "This book holds the pages of our lives, the quiet walks, the messy coffees, and the big laughs. Thank you for filling my years with magic, Kashish. This is our love story."
                  </p>
                  <span className="font-cursive text-sm text-rose-gold block">Love always, Rohit</span>
                </div>
                <div className="flex justify-between items-center w-full pt-2 border-t border-[#e2decb]">
                  <button onClick={handleMobilePrev} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={10} /> Back
                  </button>
                  <button onClick={handleMobileNext} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ) : mobilePage === 28 ? (
              // Final Note
              <div className="w-full h-[430px] bg-[#faf8f5] rounded-3xl border border-[#e2decb] p-6 flex flex-col justify-between items-center text-center shadow-xl text-love-dark">
                <div className="flex justify-between items-center w-full text-[7px] uppercase tracking-widest text-[#8c827c] pb-2 border-b border-[#e2decb]">
                  <span>Chapter I</span>
                  <span>End</span>
                </div>
                <div className="space-y-4 px-2 my-auto">
                  <Sparkles className="text-gold mx-auto animate-pulse" size={24} />
                  <h5 className="font-serif text-md text-[#4a3a38] font-light">
                    Our Story continues...
                  </h5>
                  <p className="text-[11px] font-light text-[#635352] leading-relaxed">
                    "We have filled so many pages, Kashish, but the blank sheets ahead are the ones I look forward to most. Let's write the rest of our chapters, together."
                  </p>
                </div>
                <div className="flex justify-between items-center w-full pt-2 border-t border-[#e2decb]">
                  <button onClick={handleMobilePrev} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={10} /> Back
                  </button>
                  <button onClick={handleMobileNext} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex-disabled opacity-40 cursor-default flex items-center gap-0.5" disabled>
                    Next <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ) : (
              // Inside collage pages
              <div className="w-full h-[430px] bg-[#faf8f5] rounded-3xl border border-[#e2decb] flex flex-col justify-between shadow-xl">
                {renderCollagePageContents(albumPages[mobilePage - 2], mobilePage - 1)}

                {/* Footer */}
                <div className="flex justify-between items-center p-4 border-t border-[#e2decb] bg-[#faf8f5] rounded-b-3xl">
                  <button onClick={handleMobilePrev} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={10} /> Back
                  </button>
                  <button onClick={handleMobileNext} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
