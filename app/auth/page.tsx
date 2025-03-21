"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Heart, Sparkles, Sun, Moon, Star, Cloud, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"

type AuthType = 'REGISTER' | 'LOGIN'
type UserType = {
  name: string
  email: string
  password: string
}

export function Auth() {
  const [auth, setAuth] = useState<AuthType>('REGISTER')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [theme, setTheme] = useState({
    gradient: "from-blue-100 via-sky-50 to-background",
    primaryColor: "text-blue-500",
    secondaryColor: "text-sky-400",
    buttonColor: "bg-gradient-to-r from-blue-400 to-sky-500",
    message: auth === 'REGISTER' ? "Begin your mental wellness journey" : "Welcome back to your sanctuary",
    icon: Sparkles,
    particleColor: "bg-blue-300/30",
    inputBorder: "border-blue-200 focus:border-blue-400",
    inputFocus: "focus:ring-blue-300/40"
  })
  
  const route = useRouter()
  
  // Update theme based on auth state
  useEffect(() => {
    if (auth === 'REGISTER') {
      setTheme({
        gradient: "from-indigo-100 via-purple-50 to-background",
        primaryColor: "text-indigo-500",
        secondaryColor: "text-purple-400",
        buttonColor: "bg-gradient-to-r from-indigo-400 to-purple-500",
        message: "Begin your mental wellness journey",
        icon: Moon,
        particleColor: "bg-indigo-300/30",
        inputBorder: "border-indigo-200 focus:border-indigo-400",
        inputFocus: "focus:ring-indigo-300/40"
      })
    } else {
      setTheme({
        gradient: "from-yellow-100 via-orange-50 to-background",
        primaryColor: "text-yellow-500",
        secondaryColor: "text-orange-400",
        buttonColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
        message: "Welcome back to your sanctuary",
        icon: Sun,
        particleColor: "bg-yellow-300/30",
        inputBorder: "border-yellow-200 focus:border-yellow-400",
        inputFocus: "focus:ring-yellow-300/40"
      })
    }
  }, [auth])
  
  // Toggle between signup and signin
  const toggleAuth = () => {
    setAuth(auth === 'REGISTER' ? 'LOGIN' : 'REGISTER')
  }
  
  // Handle Signing up
  const { mutate: handleSignUp, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const payload: UserType = {
        name, email, password
      }
      await axios.post('/api/signup', payload)
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          return toast.error('This email has already been registered, simply login.')
        }
        if (error.response?.status === 400) {
          return toast.error('Please fill all the fields.')
        }
      }
      toast.error('There was an error on server side, please try again.')
    },
    onSuccess: () => {
      toast.success('Your account has been created, you can simply login now.')
      setAuth('LOGIN')
    }
  })
  
  // Handle Signing in
  const { mutate: handleSignIn, isPending: SignInLoader } = useMutation({
    mutationFn: async () => {
      const payload: UserType = {
        name, email, password
      }
      await axios.post('/api/signin', payload)
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          return toast.error('This Email is not registered, you need to sign up first.')
        }
        if (error.response?.status === 401) {
          return toast.error('Password is incorrect.')
        }
        if (error.response?.status === 400) {
          return toast.error('Please fill all the fields.')
        }
      }
      toast.error('There was an error on server side, please try again.')
    },
    onSuccess: () => {
      toast.success('Login successfully.')
      route.push('/home')
    }
  })
  
  const ThemeIcon = theme.icon
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }
  
  const floatingIcons = [Brain, Heart, Star, Cloud, ThemeIcon]
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b ${theme.gradient} py-10 min-h-screen flex items-center justify-center`}>
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${theme.particleColor} rounded-full`}
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`
            }}
            animate={{ 
              y: [0, -50, 0, 50, 0],
              x: [0, 30, 0, -30, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10 + Math.random() * 15,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length]
          const size = Math.random() * 12 + 16
          return (
            <motion.div
              key={`icon-${i}`}
              className="absolute"
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                opacity: 0.1
              }}
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 0.9, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 20 + Math.random() * 10,
                delay: Math.random() * 5
              }}
            >
              <IconComponent 
                className={i % 2 === 0 ? theme.primaryColor : theme.secondaryColor} 
                size={size} 
                strokeWidth={1.5}
              />
            </motion.div>
          )
        })}
      </div>
      
      {/* Cosmic orbit animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.primaryColor.split('-')[1]})` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.secondaryColor.split('-')[1]})` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full border-2 border-dashed"
          style={{ borderColor: `var(--${theme.primaryColor.split('-')[1]})` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              key={auth} // Re-render animation when changing auth type
            >
              <motion.div 
                variants={item}
                className="flex justify-center mb-6"
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    delay: 0.3,
                    duration: 0.6
                  }}
                >
                  <motion.div
                    className="absolute -inset-3 rounded-full opacity-30"
                    style={{ background: `var(--${theme.primaryColor.split('-')[1]})` }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <ThemeIcon className={`w-12 h-12 ${theme.primaryColor}`} />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                variants={item}
                className="text-2xl font-bold text-center mb-2"
              >
                <span className={theme.primaryColor}>{auth === 'REGISTER' ? 'Create' : 'Welcome'}</span> 
                <span className="text-gray-800"> {auth === 'REGISTER' ? 'Account' : 'Back'}</span>
              </motion.h2>
              
              <motion.p 
                variants={item}
                className="text-gray-600 text-center mb-8"
              >
                {theme.message}
              </motion.p>
              
              {/* Form Fields */}
              <form onSubmit={(e) => {
                e.preventDefault()
                auth === 'REGISTER' ? handleSignUp() : handleSignIn()
              }}>
                {auth === 'REGISTER' && (
                  <motion.div 
                    variants={item}
                    className="mb-4"
                  >
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme.primaryColor}`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme.primaryColor}`}>
                        <User size={16} />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`pl-10 w-full p-3 bg-white/50 backdrop-blur-sm border ${theme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${theme.inputFocus} transition-all duration-300`}
                        placeholder="Enter your name"
                      />
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  variants={item}
                  className="mb-4"
                >
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme.primaryColor}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme.primaryColor}`}>
                      <Mail size={16} />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 w-full p-3 bg-white/50 backdrop-blur-sm border ${theme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${theme.inputFocus} transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={item}
                  className="mb-6"
                >
                  <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme.primaryColor}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme.primaryColor}`}>
                      <Lock size={16} />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 w-full p-3 bg-white/50 backdrop-blur-sm border ${theme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${theme.inputFocus} transition-all duration-300`}
                      placeholder={auth === 'REGISTER' ? "Create a password" : "Enter your password"}
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={item}>
                  <motion.button
                    type="submit"
                    className={`w-full ${theme.buttonColor} text-white font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 group`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || SignInLoader}
                  >
                    <span>{auth === 'REGISTER' ? 'Create Account' : 'Sign In'}</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                    
                    {(isLoading || SignInLoader) && (
                      <motion.div 
                        className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1,
                          ease: "linear"
                        }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              </form>
              
              <motion.div 
                variants={item}
                className="mt-6 text-center"
              >
                <p className="text-gray-600">
                  {auth === 'REGISTER' ? 'Already have an account?' : "Don't have an account?"}
                  <motion.button
                    onClick={toggleAuth}
                    className={`ml-1 font-medium ${theme.primaryColor} hover:underline focus:outline-none`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {auth === 'REGISTER' ? 'Sign In' : 'Sign Up'}
                  </motion.button>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth