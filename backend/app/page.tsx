"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);
  const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const logoSrc = '/logocom.jpg';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return;

    const lines = ['Welcome to', 'Security Rounds', 'Management'];
    h1.innerHTML = '';

    let lineIndex = 0;
    let charIndex = 0;
    const typingTimeouts: NodeJS.Timeout[] = [];

    const type = () => {
      if (lineIndex >= lines.length) return;

      if (!h1.children[lineIndex]) {
        const lineWrapper = document.createElement('div');
        lineWrapper.style.overflow = 'hidden';

        const lineSpan = document.createElement('span');
        lineSpan.style.display = 'inline-block';
        lineSpan.style.transform = 'translateY(120%)';
        lineSpan.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        lineWrapper.appendChild(lineSpan);
        h1.appendChild(lineWrapper);
        
        setTimeout(() => {
          lineSpan.style.transform = 'translateY(0)';
        }, 10 + (lineIndex * 150));
      }

      const currentSpan = h1.children[lineIndex].firstChild as HTMLElement;
      currentSpan.textContent += lines[lineIndex][charIndex];
      charIndex++;

      if (charIndex === lines[lineIndex].length) {
        lineIndex++;
        charIndex = 0;
      }

      const id = setTimeout(type, 50);
      typingTimeouts.push(id);
    };

    type();
    return () => typingTimeouts.forEach(clearTimeout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setBtnPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      cardRef.current.style.transform = `translate(${x}px, ${y}px)`;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes float-blob {
          0% { transform: translate(0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0) scale(1); }
        }
        .animate-blob { animation: float-blob 15s infinite ease-in-out; }
        
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <section className="relative min-h-screen bg-[#080883] flex items-center overflow-hidden">
        
        {/* 1. SMOOTH GRADIENT BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050560] via-[#080883] to-[#02024a] z-0"></div>
        
        {/* 2. REFINED NOISE (Lower opacity for cleaner look) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}>
        </div>

        {/* 3. TOP RIGHT AMBIENT LIGHT (Violet) */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6366F1] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob z-0"></div>
        
        {/* 4. BOTTOM LEFT AMBIENT LIGHT (Changed to Teal/Cyan for Harmony) */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#06B6D4] rounded-full mix-blend-screen filter blur-[120px] opacity-25 animate-blob z-0" style={{animationDelay: '5s'}}></div>

        <div className="max-w-7xl mx-auto w-full px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-6">
            <h1 className="text-white text-[64px] font-bold leading-tight tracking-tight drop-shadow-lg" />
            
            <p className="text-blue-100/80 text-lg max-w-lg font-light leading-relaxed">
              Turning routine security rounds into measurable,
              reliable, and proactive safety operations.
            </p>

            <button
              ref={btnRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => router.push('/login')}
              className="mt-8 group relative px-10 py-4 bg-white text-[#080883] rounded-full font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-transform duration-75 ease-out border border-white/20"
              style={{ transform: `translate(${btnPosition.x}px, ${btnPosition.y}px)` }}
            >
              LOGIN
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shine_1s_infinite]"></div>
            </button>
          </div>

          <div className="flex justify-center perspective-1000">
            <div
              ref={cardRef}
              className={`relative group w-[420px] h-[347px] flex items-center justify-center overflow-hidden transition-all duration-100 ease-out
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
              `}
            >
              {/* Glassmorphism Container */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl z-0"></div>

              {/* Spotlight Glow */}
              <div 
                className="absolute pointer-events-none w-64 h-64 bg-gradient-to-r from-white/40 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  left: mousePosition.x - (cardRef.current?.getBoundingClientRect().left || 0) - 128,
                  top: mousePosition.y - (cardRef.current?.getBoundingClientRect().top || 0) - 128,
                  transition: 'opacity 0.5s, left 0.1s, top 0.1s'
                }}
              ></div>

              <div className="relative z-10 w-full h-full flex items-center justify-center bg-gradient-to-b from-transparent to-black/5 rounded-3xl">
                <div
                  className={`transition-all duration-700 delay-100 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <Image
                    src={logoSrc}
                    alt="Company Logo"
                    width={350}
                    height={300}
                    className="object-contain drop-shadow-2xl relative z-20"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}