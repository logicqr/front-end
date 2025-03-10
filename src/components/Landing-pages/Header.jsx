import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Calculate scroll progress for progress indicator
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <nav className={`fixed w-full z-40 transition-all duration-500 py-5 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="LogicQR Home"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
                isScrolled ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-white text-blue-700'
              }`}>
                <span className="font-bold text-2xl">Q</span>
              </div>
              <span className={`text-2xl font-bold transition-all duration-300 ${
                isScrolled ? 'text-blue-600 hover:text-blue-700' : 'text-white hover:text-white/80'
              } `}>
                LogicQR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" isScrolled={isScrolled} exact>
                Home
              </NavLink>
              <NavLink to="/docs" isScrolled={isScrolled}>
                Documents
              </NavLink>
              <NavLink to="/features" isScrolled={isScrolled}>
                Features
              </NavLink>
              {/* <Link to="/login">
              <button 
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Get Started
              </button>
              </Link> */}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-blue-600' 
                }`}
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                <div className="w-6 flex flex-col items-center justify-center">
                  <span 
                    className={`block h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${
                      isOpen 
                        ? 'transform rotate-45 translate-y-1.5 bg-gray-800' 
                        : `${isScrolled ? 'bg-gray-700' : 'bg-white'}`
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-full rounded-full my-1 transition-all duration-300 ease-in-out ${
                      isOpen 
                        ? 'opacity-0' 
                        : `${isScrolled ? 'bg-gray-700' : 'bg-white'}`
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-full rounded-full transition-all duration-300 ease-in-out ${
                      isOpen 
                        ? `transform -rotate-45 -translate-y-1.5 bg-gray-800`
                        : `${isScrolled ? 'bg-gray-700' : 'bg-white'}`
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100 mt-5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`px-4 pt-4 pb-6 space-y-2 shadow-xl rounded-b-2xl `}>
            <MobileLink to="/" exact>
              Home
            </MobileLink>
            <MobileLink to="/docs">
              Documents
            </MobileLink>
            <MobileLink to="/features">
              Features
            </MobileLink>
            <button className={`w-full mt-6 px-6 py-3  rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isScrolled?'bg-gradient-to-r from-blue-500 to-indigo-600 text-white':'bg-blue-50 text-blue-700'}`}>
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ to, children, isScrolled, exact }) {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`relative px-3 py-2 font-medium transition-all duration-300 group overflow-hidden ${
        isActive 
          ? isScrolled ? 'text-blue-600' : 'text-white font-semibold' 
          : isScrolled ? 'text-gray-700' : 'text-white'
      }`}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500 ease-out ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

function MobileLink({ to, children, exact }) {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
        isActive 
          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
}