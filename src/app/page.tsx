"use client";
import { useRouter } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from "next/image";
import SyncUserToSupabase from "./syncutosupabase";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar styling only (not for fixed positioning)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <SyncUserToSupabase />

      {/* Navigation Bar - Not Fixed */}
      <nav className={`w-full z-10 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-sm py-3 shadow-md" : "bg-transparent py-5"
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Yadharth</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
          </div>
          
          <div>
            {isLoaded && (
              isSignedIn ? (
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
                >
                  Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/sign-in?redirect_url=/dashboard')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-colors duration-300"
                >
                  Get Started
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Adjusted top padding since navbar is not fixed */}
      <section className="pt-12 pb-20 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Free <span className="text-blue-500">Certificate Verification</span> Platform
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Create, distribute, and verify event certificates with QR codes - 100% free. Our platform makes certificate verification simple, secure, and accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => router.push(isSignedIn ? '/dashboard' : '/sign-in?redirect_url=/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-300 flex items-center justify-center"
              >
                {isSignedIn ? 'Go to Dashboard' : 'Start Now - It\'s Free!'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})}
                className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-300 flex items-center justify-center"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
                <div className="p-2 bg-gray-700/50 rounded-xl">
                  <Image
                    src="/certificate-example.png" 
                    alt="Certificate Example"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=Certificate+Example"
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-6 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Certificate Verified</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-40 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">QR Verify</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-4/5"></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>Fast & Free</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your features section remains the same... */}

      {/* CTA Section - Updated to emphasize free service */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to generate QR-verified certificates?</h2>
              <p className="text-xl text-blue-100 mb-8">Start using our completely free certificate verification platform today.</p>
              <button 
                onClick={() => router.push(isSignedIn ? '/dashboard' : '/sign-in?redirect_url=/dashboard')}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-300"
              >
                {isSignedIn ? 'Go to Dashboard' : 'Start Creating Certificates'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Updated pricing to remove mentions of paid services */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">Yadharth</span>
              </div>
              <p className="text-gray-400 max-w-xs">Free QR code certificate verification platform for events and organizations.</p>
            </div>
            
            
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Yadharth. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Style remains the same */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}