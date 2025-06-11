import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronRight as ArrowRight } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

// Styles CSS pour les animations
const styles = {
  '@keyframes appear': {
    '0%': { 
      opacity: 0,
      transform: 'scale(0.98) translateY(10px)'
    },
    '100%': { 
      opacity: 1,
      transform: 'scale(1) translateY(0)'
    }
  },
  '.animation-appear': {
    animation: 'appear 0.3s ease-out forwards'
  }
};

// Injecter les styles dans le document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes appear {
      0% { 
        opacity: 0;
        transform: scale(0.98) translateY(10px);
      }
      100% { 
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animation-appear {
      animation: appear 0.3s ease-out forwards;
    }
    .accent-color {
      color: #ab2b37;
    }
    .accent-bg {
      background-color: #ab2b37;
    }
    .accent-border {
      border-color: #ab2b37;
    }
    .accent-gradient {
      background: linear-gradient(to right, #ab2b37, #c63d4a);
    }
  `;
  document.head.appendChild(styleSheet);
}

// Types for the slides
interface SlideContent {
  title: string;
  content: React.ReactNode;
}

interface PresentationSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresentationSlider({ isOpen, onClose }: PresentationSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Function to handle key presses for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  // Functions for touch swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Slide content based on the MARP markdown
  const slides: SlideContent[] = [
    {
      title: "Présentation",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Présentation</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img src="/ressources/logo.svg" alt="Innovac'tool Logo" className="w-14 h-14 mr-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Louis Cléon</h2>
            </div>
            <ul className="space-y-2 text-base">
              {[
                "10 ans d'expérience dans la profession",
                "7 ans en audit (cabinet de 600 personnes, réseau international)",
                "3 ans en expertise comptable (cabinet de 60 personnes à Dijon)",
                "9 ans de développement et maintenance d'applications métier"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-gray-100 text-[#ab2b37] rounded-full h-6 w-6 mt-0.5 mr-3 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Automatiser, toujours",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Automatiser, toujours</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-row-reverse items-center mb-5">
              <img src="/ressources/Sans titre - 1-13.svg" alt="Automation" className="w-16 h-16 ml-4" />
              <p className="text-base leading-relaxed">
                Lorsqu'une tâche répétitive m'a été confiée, j'ai systématiquement recherché une solution technique. 
                Ce réflexe a accompagné chaque étape de mon parcours professionnel.
              </p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <blockquote className="italic text-base text-gray-700">
                "I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it."
              </blockquote>
              <p className="mt-2 text-gray-600 text-right text-sm">
                — Attribué à Bill Gates<br />
                <a href="https://quoteinvestigator.com/2014/03/10/lazy-job/" className="text-[#ab2b37] hover:underline" target="_blank" rel="noopener noreferrer">Quote Investigator</a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Un déclencheur dès le premier jour",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Un déclencheur dès le premier jour</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-5">
              <img src="/ressources/Sans titre - 1-05.svg" alt="Disruption" className="w-16 h-16 mr-4" />
              <p className="text-base leading-relaxed">
                Le premier jour de stage, une conférence de Stéphane Mallard a planté une idée.
              </p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm mb-5">
              <blockquote className="italic text-base text-gray-700">
                "Tous les métiers seront disruptés, sans exception. Et cela viendra de l'extérieur."
              </blockquote>
              <p className="mt-2 text-gray-600 text-right text-sm">
                — Stéphane Mallard, <em>Disruption</em><br />
                <a href="https://www.welcometothejungle.com/fr/articles/stephane-mallard-disruption" className="text-[#ab2b37] hover:underline" target="_blank" rel="noopener noreferrer">Welcome to the Jungle</a>
              </p>
            </div>
            
            <p className="text-base mb-4 leading-relaxed font-medium text-[#ab2b37]">
              Un acteur externe ne voit pas nos contraintes. Il voit des opportunités.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ce qui fait notre valeur",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Ce qui fait notre valeur</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <p className="text-base leading-relaxed">
                La mission de l'expert-comptable repose sur :
              </p>
              <img src="/ressources/Sans titre - 1-02.svg" alt="Value" className="w-14 h-14 ml-4" />
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-5">
              <ul className="space-y-2 text-base">
                {[
                  "des données structurées",
                  "des procédures rigoureuses",
                  "une assurance professionnelle"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 bg-[#ab2b37] text-white rounded-full flex items-center justify-center mt-0.5 mr-3 text-xs">{index+1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <blockquote className="italic text-base text-gray-700">
                "Uber drivers spend a significantly higher fraction of their time and miles with a passenger in the car than taxi drivers."
              </blockquote>
              <p className="mt-2 text-gray-600 text-right text-sm">
                — Judd Cramer & Alan B. Krueger, <em>Disruptive Change in the Taxi Business</em><br />
                <a href="https://www.aeaweb.org/articles?id=10.1257/aer.p20161002" className="text-[#ab2b37] hover:underline" target="_blank" rel="noopener noreferrer">AEA – American Economic Association</a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Le mémoire",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Le mémoire</h1>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-base mb-4 leading-relaxed">
              Le mémoire propose :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#ab2b37] text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="font-bold mb-1 text-[#ab2b37]">Data warehouse</p>
                <p className="text-xs">mutualisé</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#ab2b37] text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="font-bold mb-1 text-[#ab2b37]">Applications IA</p>
                <p className="text-xs">utiles et concrètes</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#ab2b37] text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="font-bold mb-1 text-[#ab2b37]">Adoption commune</p>
                <p className="text-xs">levier essentiel de l'innovation</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <blockquote className="italic text-base text-gray-700">
                "If you can't explain it simply, you don't understand it well enough."
              </blockquote>
              <p className="mt-2 text-gray-600 text-right text-sm">
                — Attribué à Albert Einstein<br />
                <a href="https://quoteinvestigator.com/2011/05/13/einstein-simple/" className="text-[#ab2b37] hover:underline" target="_blank" rel="noopener noreferrer">Quote Investigator</a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pourquoi une application",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Pourquoi une application</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex-1">
                <ul className="space-y-3 text-base">
                  {[
                    "Un cabinet fictif, Innovactif Conseil, traverse ce cheminement dans le mémoire.",
                    "L'outil présenté aujourd'hui incarne ce qu'il aurait pu construire.",
                    "Les technologies sont opérationnelles, les données simulées.",
                    "Chaque fonctionnalité est reliée à une section précise du mémoire."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-[#ab2b37] rounded-full h-6 w-6 mt-0.5 mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: item.replace(/Innovactif Conseil/, "<em class='text-[#ab2b37]'>Innovactif Conseil</em>") }} />
                    </li>
                  ))}
                </ul>
              </div>
              <img src="/ressources/Sans titre - 1-11.svg" alt="Application" className="w-24 h-24 ml-4" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Une continuité concrète",
      content: (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-1 text-[#ab2b37] border-b pb-3 border-gray-200">Une continuité concrète</h1>
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
              <p className="text-base mb-4 leading-relaxed">
                Après le mémoire, et après <em className="text-[#ab2b37]">Innovactif</em> comme cas théorique,<br />
                voici <em className="text-[#ab2b37]">Innovac'tool</em> : une mise en pratique possible, concrète,<br />
                de ce que pourrait devenir notre métier, demain.
              </p>
              
              <div className="flex justify-center mt-6">
                <Link href="/modules/stack-technique" passHref>
                  <Button 
                    className="bg-[#ab2b37] hover:bg-[#9a1927] text-white px-5 py-2 shadow-md hover:shadow-lg transition-all"
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Explorer la Stack Technique
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <blockquote className="italic text-base text-gray-700">
                "The next big thing will start out looking like a toy."
              </blockquote>
              <p className="mt-2 text-gray-600 text-right text-sm">
                — Chris Dixon<br />
                <a href="https://a16z.com/2010/09/16/the-next-big-thing-will-start-out-looking-like-a-toy/" className="text-[#ab2b37] hover:underline" target="_blank" rel="noopener noreferrer">a16z.com – Andreessen Horowitz</a>
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-hidden backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animation-appear" 
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        {/* Header with title and close button */}
        <div className="bg-white text-[#ab2b37] px-6 py-3 flex justify-between items-center shadow-md border-b border-gray-200">
          <h3 className="font-semibold text-xl flex items-center">
            Soutenance DEC – Louis Cléon
            <span className="ml-3 text-sm bg-gray-100 text-[#ab2b37] px-2 py-0.5 rounded-full">
              {currentSlide + 1}/{slides.length}
            </span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            aria-label="Fermer la présentation"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* Slide content area */}
        <div 
          className="flex-1 overflow-hidden relative bg-white"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 p-6 md:p-10 overflow-y-auto"
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
          
          {/* Slide number */}
          <div className="absolute top-3 right-3 opacity-20 text-6xl font-bold text-[#ab2b37]">
            {currentSlide + 1}
          </div>
          
          {/* Pagination dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all transform ${
                  index === currentSlide 
                    ? 'bg-[#ab2b37] scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows with improved styling */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-[#ab2b37] p-2 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl border border-gray-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          {currentSlide < slides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-[#ab2b37] p-2 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl border border-gray-100"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Footer with navigation buttons */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600 font-medium">
            Louis Cléon – 20 Mai 2025
          </div>
          <div className="flex space-x-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 border-gray-200 hover:border-[#ab2b37] text-[#ab2b37]'}
            >
              <ChevronLeft size={16} className="mr-1" />
              Précédent
            </Button>
            {currentSlide === slides.length - 1 ? (
              <Button 
                size="sm" 
                onClick={onClose}
                className="bg-[#ab2b37] hover:bg-[#9a1927] text-white px-4 shadow-sm hover:shadow"
              >
                Terminer
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={nextSlide}
                className="bg-[#ab2b37] hover:bg-[#9a1927] text-white px-4 shadow-sm hover:shadow"
              >
                Suivant
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 