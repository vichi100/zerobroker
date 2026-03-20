"use client";

import React, { useState, useRef, useEffect } from "react";

interface Listing {
  id: number;
  type: "WANT" | "HAVE";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"blue" | "dark">("dark");
  const [feed, setFeed] = useState<Listing[]>([
    { id: 1, type: "WANT", text: "I am looking for a 2bhk in Andheri West in 40-60k rent" },
    { id: 2, type: "HAVE", text: "I have 2bkh in andheri west rent is 55k" },
  ]);
  const [showInitialGlow, setShowInitialGlow] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isZeroBroker, setIsZeroBroker] = useState(true);
  const [isOkBroker, setIsOkBroker] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholders = [
    "I'm looking for 2BHK in Andheri West for 40-60k rent...",
    "Looking for a budget-friendly flat near Khar station...",
    "I want to buy a 3BHK penthouse in South Mumbai...",
    "Find me a studio apartment in Bandra for under 30k..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowInitialGlow(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply theme class on change
    if (theme === "blue") {
      document.documentElement.classList.add("blue-theme");
    } else {
      document.documentElement.classList.remove("blue-theme");
    }
  }, [theme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const lowerText = input.toLowerCase();
    const type = (lowerText.includes("looking") || lowerText.includes("want") || lowerText.includes("need")) ? "WANT" : "HAVE";

    const newListing: Listing = {
      id: Date.now(),
      type,
      text: input,
    };

    setFeed([newListing, ...feed]);
    setInput("");
    setSelectedImages([]);
  };

  // Validation logic
  const hasProperty = /(?:1|2|3|4|5|one|two|three|four|five)\s*bhk|apartment|flat|studio|house|room|office|shop|godown|warehouse|commercial|land|plot/i.test(input);
  const hasLocation = /(?:in|at|near|around)\s+[a-z0-9]+/i.test(input);
  const hasBudget = /(?:\d+|one|two|three|four|five|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\s*(?:k|l|lac|lakh|thousand|thousend|cr|rs|inr)/i.test(input);
  const intentMatch = input.match(/\b(rent|buy|lease|sell|sale|resale|pg|commercial)\b/i);
  const detectedIntent = intentMatch ? intentMatch[1].toUpperCase() : "Type";

  const toggleTheme = () => setTheme(theme === "blue" ? "dark" : "blue");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative">
      <header className="sticky top-0 w-full px-2 py-1 md:px-6 md:py-3 flex justify-between items-center max-w-6xl z-50 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col items-start">
          <div className="text-1xl font-bold tracking-tighter">
            <span className="text-[#ff2c2c]"></span>
            <span className="brand-text">MOVEINTODAY</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium md:hidden mt-0.5">
            Real Estate, Deciphered by AI
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className={`hidden md:flex p-1.5 rounded-full glass transition-all cursor-pointer ${theme === "blue" ? "text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "text-gray-400"}`}
            title={`Switch to ${theme === "blue" ? "Dark" : "Blue"} Mode`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <div className="hidden md:block text-xs text-white/60 uppercase tracking-widest">Real Estate, Deciphered by AI</div>
        </div>
      </header>

      <main className="w-full max-w-3xl space-y-12 md:space-y-20 z-10 pt-10 md:pt-10">
        <div className="text-center space-y-20 md:space-y-4 mb-30 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-2 md:mb-8">

            <span className="gradient-text">Searching is Over.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            <span className="hidden md:inline">You say it. We find it. No filters, no endless scrolling, no noise. </span>
            Just your requirement and our AI on the hunt.
          </p>
        </div>

        <div className="flex flex-col">
          <div className={`glass rounded-[2rem] px-4 py-2 relative group transition-all duration-700 ${showInitialGlow ? "ai-glow" : ""}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />

              {/* Image Previews */}
              {selectedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2 px-2 no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {selectedImages.map((src, idx) => (
                    <div key={idx} className="relative flex-shrink-0 group/img">
                      <img src={src} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 active:scale-125 opacity-0 group-hover/img:opacity-100 transition-all shadow-lg"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent p-2 py-1 text-lg leading-tight outline-none resize-none overflow-hidden placeholder:text-white/40 text-foreground min-h-[28px] transition-all duration-700"
              />


              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4 text-gray-400 min-h-[40px]">
                  {input.length > 0 && !/(?:looking|want|need)/i.test(input) && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:text-white active:scale-95 active:bg-white/10 transition-all p-2 -m-1 animate-in fade-in zoom-in duration-300"
                      title="Add Images"
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`p-2 active:scale-95 transition-all flex items-center justify-center ${input.trim() ? "text-foreground hover:opacity-80" : "text-foreground/10 cursor-not-allowed"
                      }`}
                    title="Post Requirement"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M228.44,112,68.45,20.08A16,16,0,0,0,45.45,41.41L76.54,128,45.45,214.59A16,16,0,0,0,68.45,235.92l159.99-91.92a16,16,0,0,0,0-27.75ZM61.55,212,88,140H144a8,8,0,0,0,0-16H88L61.55,44,212,128Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            {/* Guidance Checklist */}
            {input.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 mt-4 pt-4 border-t border-white/5 text-[10px] items-center">
                {[
                  { label: detectedIntent, valid: !!intentMatch },
                  { label: "Property", valid: hasProperty },
                  { label: "Location", valid: hasLocation },
                  { label: "Budget", valid: hasBudget },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 transition-colors ${item.valid ? "text-green-400" : "text-gray-400"}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${item.valid ? "bg-green-400/20" : "bg-gray-400/10"}`}>
                      {item.valid ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <span className="uppercase tracking-widest font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Broker Preferences */}
          <div className="flex gap-4 px-6 mt-[10px] text-[10px] uppercase tracking-wider font-bold">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isZeroBroker}
                onChange={(e) => setIsZeroBroker(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
                {isZeroBroker && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className={`${isZeroBroker ? "text-blue-400" : "text-gray-500"} group-hover:text-white transition-colors`}>Zero Broker</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isOkBroker}
                onChange={(e) => setIsOkBroker(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all">
                {isOkBroker && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className={`${isOkBroker ? "text-purple-400" : "text-gray-500"} group-hover:text-white transition-colors`}>Ok Broker</span>
            </label>
          </div>
        </div>

        <div className="space-y-6 pb-4">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Recent Listings</h3>
          <div className="space-y-4">
            {feed.map((listing, index) => (
              <div
                key={listing.id}
                className={`glass p-4 rounded-2xl text-sm border-l-4 ${listing.type === "WANT" ? "border-blue-500" : "border-purple-500"
                  } transition-all duration-500 ${index === 0 ? "animate-in fade-in slide-in-from-top-4" : ""}`}
              >
                <span className={`${listing.type === "WANT" ? "text-blue-400" : "text-purple-400"} font-mono mr-2`}>
                  [{listing.type}]
                </span>
                <span className="text-gray-400">"{listing.text}"</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-white/60 text-[10px] uppercase tracking-widest opacity-80">
        ZeroBroker Engine v2.0 &copy; 2026
      </footer>
    </div>
  );
}
