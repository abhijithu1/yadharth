"use client"

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'

// Animation variants matching the main page
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gray-50 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gray-100 rounded-full opacity-20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          repeatType: 'reverse' 
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-20 h-20 bg-black rounded-full opacity-10"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: 'reverse' 
        }}
      />

      {/* Main content container */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header section */}
        <motion.div 
          className="text-center mb-8"
          variants={fadeInUp}
        >
          {/* Logo matching the main page */}
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Yadharth</span>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-3"
            variants={fadeInUp}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            variants={fadeInUp}
          >
            Sign in to access your certificate dashboard
          </motion.p>
        </motion.div>

        {/* Sign-in form card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative"
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50 rounded-2xl pointer-events-none"></div>
          
          {/* Clerk SignIn component */}
          <div className="relative z-10">
            <SignIn 
              appearance={{
                elements: {
                  card: 'bg-transparent shadow-none border-none',
                  headerTitle: 'text-black text-2xl font-bold',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'bg-white border border-gray-300 text-black hover:bg-gray-50 transition-colors duration-200',
                  socialButtonsBlockButtonText: 'text-black font-medium',
                  dividerText: 'text-gray-500',
                  dividerLine: 'bg-gray-200',
                  formFieldLabel: 'text-gray-700 font-medium',
                  formFieldInput: 'border-gray-300 focus:border-black focus:ring-black',
                  formButtonPrimary: 'bg-black hover:bg-gray-800 text-white transition-colors duration-300 font-medium py-3',
                  footerActionText: 'text-gray-600',
                  footerActionLink: 'text-black hover:text-gray-800 font-medium',
                  identityPreviewText: 'text-gray-700',
                  identityPreviewEditButtonIcon: 'text-gray-600',
                  otpCodeFieldInput: 'border-gray-300 focus:border-black focus:ring-black',
                  alternativeMethodsBlockButton: 'text-black hover:text-gray-800 border-gray-300 hover:bg-gray-50',
                },
                variables: {
                  colorPrimary: '#000000',
                  colorText: '#000000',
                  colorTextSecondary: '#6B7280',
                  colorBackground: '#FFFFFF',
                  colorInputBackground: '#FFFFFF',
                  colorInputText: '#000000',
                  borderRadius: '0.5rem',
                  spacingUnit: '1rem',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                }
              }}
              redirectUrl="/dashboard"
            />
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div 
          className="text-center mt-8"
          variants={fadeInUp}
        >
          <p className="text-gray-500 text-sm">
            Free QR code certificate verification platform
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}