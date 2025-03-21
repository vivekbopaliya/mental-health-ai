"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Info, MessageCircle, Brain, Heart, Sparkles, Sun, Moon, Star, Cloud, Settings, Menu, X, Flower, Zap, Droplet, Music, Feather, Rainbow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { ChatService } from '@/lib/chat-service'
import { useToast } from '@/components/ui/use-toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const chatService = new ChatService()
const TEMP_USER_ID = 'temp-user-id'

export default function MentalHealthChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userMood, setUserMood] = useState(7)
  const [showSidebar, setShowSidebar] = useState(false)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [theme, setTheme] = useState({
    gradient: "from-indigo-900/30 via-purple-900/20 to-gray-900",
    primaryColor: "text-indigo-400",
    secondaryColor: "text-purple-300",
    buttonColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
    bubbleGradient: "bg-gradient-to-br from-indigo-600 to-purple-700",
    message: "Your mental wellness journey",
    icon: Sparkles,
    particleColor: "bg-indigo-400/20"
  })

  useEffect(() => {
    if (userMood >= 8) {
      setTheme({
        gradient: "from-amber-900/30 via-orange-900/20 to-gray-900",
        primaryColor: "text-amber-400",
        secondaryColor: "text-orange-300",
        buttonColor: "bg-gradient-to-r from-amber-500 to-orange-600",
        bubbleGradient: "bg-gradient-to-br from-amber-600 to-orange-700",
        message: "Shine on! Today is your day",
        icon: Sun,
        particleColor: "bg-amber-400/20"
      })
    } else if (userMood >= 5) {
      setTheme({
        gradient: "from-blue-900/30 via-cyan-900/20 to-gray-900",
        primaryColor: "text-blue-400",
        secondaryColor: "text-cyan-300",
        buttonColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
        bubbleGradient: "bg-gradient-to-br from-blue-600 to-cyan-700",
        message: "Welcome to your mental wellness journey",
        icon: Sparkles,
        particleColor: "bg-blue-400/20"
      })
    } else {
      setTheme({
        gradient: "from-indigo-900/30 via-purple-900/20 to-gray-900",
        primaryColor: "text-indigo-400",
        secondaryColor: "text-purple-300",
        buttonColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
        bubbleGradient: "bg-gradient-to-br from-indigo-600 to-purple-700",
        message: "Take it one step at a time. You're not alone",
        icon: Moon,
        particleColor: "bg-indigo-400/20"
      })
    }
  }, [userMood])

  const ThemeIcon = theme.icon

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true)
        const history = await chatService.loadChatHistory(TEMP_USER_ID)
        if (history.length > 0) {
          setMessages(history)
        } else {
          setMessages([{
            role: 'assistant',
            content: "Hello, I'm here to support your mental wellbeing. How are you feeling today? You can share whatever's on your mind in a safe, judgment-free space.",
            timestamp: new Date(),
          }])
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setTimeout(scrollToBottom, 100)
      }
    }

    loadHistory()
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }

  useEffect(() => scrollToBottom(), [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const newUserMessage: Message = { role: 'user', content: userMessage, timestamp: new Date() }
      setMessages(prev => [...prev, newUserMessage])
      const response = await chatService.sendMessage(TEMP_USER_ID, userMessage)
      console.log(response)
      const newAIMessage: Message = { role: 'assistant', content: response, timestamp: new Date() }
      setMessages(prev => [...prev, newAIMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced floating icons array
  const floatingIcons = [Brain, Heart, Star, Cloud, ThemeIcon, Flower, Zap, Droplet, Music, Feather, Rainbow, Sun, Moon, Sparkles];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900 text-gray-100 transition-colors duration-500">
      {/* Enhanced animated background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} transition-colors duration-500`}>
        {/* More animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${theme.particleColor} rounded-full`}
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`
              }}
              animate={{ 
                y: [0, -60, 0, 60, 0],
                x: [0, 40, 0, -40, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8 + Math.random() * 10,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Enhanced floating icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const size = Math.random() * 16 + 12;
            return (
              <motion.div
                key={`icon-${i}`}
                className="absolute"
                initial={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`,
                  opacity: 0.15
                }}
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.15, 1, 0.85, 1],
                  opacity: [0.15, 0.3, 0.15],
                  y: [0, -30, 0, 30, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 15 + Math.random() * 10,
                  delay: Math.random() * 4,
                  ease: "easeInOut"
                }}
              >
                <IconComponent 
                  className={i % 2 === 0 ? theme.primaryColor : theme.secondaryColor} 
                  size={size} 
                  strokeWidth={1.2}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced cosmic orbit animation */}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-15 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute inset-0 rounded-full border border-dashed"
              style={{ 
                borderColor: `rgba(255,255,255,${0.2 - i * 0.05})`,
                margin: `${i * 15}px`
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ 
                duration: 30 + i * 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div> */}

        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.1), transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.1), transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.1), transparent 70%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <header className="py-4 px-6 border-b backdrop-blur-md bg-gray-900/40 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <motion.div className="absolute -inset-2 rounded-full opacity-30" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                <div className={`h-10 w-10 rounded-full ${theme.bubbleGradient} flex items-center justify-center`}>
                  <ThemeIcon className="text-white h-5 w-5" />
                </div>
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Mental Wellbeing Assistant</h1>
              <p className="text-xs opacity-70">{theme.message}</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className={`gap-1.5 ${theme.primaryColor} border-current`}>
                  <Info className="h-4 w-4" />
                  <span>Resources</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Crisis Resources</h3>
                  <p className="text-xs">If you're in crisis, please contact:</p>
                  <ul className="text-xs space-y-1">
                    <li>988 Suicide & Crisis Lifeline: Call or text 988</li>
                    <li>Crisis Text Line: Text HOME to 741741</li>
                    <li>If it's an emergency, call 911</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Sidebar */}
      <Drawer open={showSidebar} onOpenChange={setShowSidebar}>
        <DrawerContent>
          <div className="p-4 bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
                <div className="flex justify-between items-center gap-4">
                  <Button variant={userMood < 5 ? "default" : "outline"} onClick={() => setUserMood(3)} className="flex-1">
                    <Moon className="h-4 w-4 mr-2" />
                    Low
                  </Button>
                  <Button variant={userMood >= 5 && userMood < 8 ? "default" : "outline"} onClick={() => setUserMood(6)} className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Neutral
                  </Button>
                  <Button variant={userMood >= 8 ? "default" : "outline"} onClick={() => setUserMood(9)} className="flex-1">
                    <Sun className="h-4 w-4 mr-2" />
                    Good
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Help Resources</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 border border-gray-700 rounded-lg">
                    <p className="font-medium">988 Suicide & Crisis Lifeline</p>
                    <p className="text-sm opacity-70">Call or text 988</p>
                  </div>
                  <div className="p-3 border border-gray-700 rounded-lg">
                    <p className="font-medium">Crisis Text Line</p>
                    <p className="text-sm opacity-70">Text HOME to 741741</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto flex flex-col p-4 md:p-6 relative z-10">
        <Card className="flex-1 overflow-hidden backdrop-blur-md bg-gray-900/60 border-gray-700/50 shadow-lg">
          {isLoading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity, ease: "easeInOut" } }}>
                <ThemeIcon className={`h-12 w-12 ${theme.primaryColor}`} />
              </motion.div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-220px)]" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4 text-white p-4 md:p-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.05 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mr-2 mt-2">
                          <div className={`h-8 w-8 rounded-full ${theme.bubbleGradient} flex items-center justify-center shadow-md`}>
                            <ThemeIcon className="text-white h-4 w-4" />
                          </div>
                        </motion.div>
                      )}
                      <motion.div whileHover={{ scale: 1.01 }} className={`max-w-[75%] rounded-2xl p-4 shadow-md ${message.role === 'user' ? theme.bubbleGradient + ' text-white' : 'bg-gray-800/90'}`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className={`text-xs mt-2 block ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                      {message.role === 'user' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="ml-2 mt-2">
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center shadow-md">
                            <span className="text-xs font-medium">You</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && messages.length > 0 && (
                  <div className="flex justify-start items-start">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mr-2 mt-2">
                      <div className={`h-8 w-8 rounded-full ${theme.bubbleGradient} flex items-center justify-center shadow-md`}>
                        <ThemeIcon className="text-white h-4 w-4" />
                      </div>
                    </motion.div>
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-[75%] rounded-2xl p-4 bg-gray-800/90 shadow-md">
                      <div className="flex space-x-2">
                        <motion.div className="w-3 h-3 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="w-3 h-3 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                        <motion.div className="w-3 h-3 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <div className="p-4 border-t border-gray-700/50 backdrop-blur-md">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 max-w-4xl mx-auto">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts here..."

                className="flex-1  text-white bg-gray-800/50 border-gray-700/50 backdrop-blur-md"
                disabled={isLoading}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" className={`rounded-full ${theme.buttonColor} text-white`} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                </Button>
              </motion.div>
            </form>
          </div>
        </Card>
      </main>

      {/* Mood control */}
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
        <Button variant="outline" onClick={() => setShowSidebar(true)} className="rounded-full shadow-lg bg-gray-800/90 border-gray-700 backdrop-blur-md px-6 py-6 h-auto flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Mood & Settings</span>
        </Button>
      </motion.div>

      {/* Floating mood selector (desktop) */}
      <div className="hidden md:block fixed left-6 top-1/2 transform -translate-y-1/2 z-20">
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }} className="p-4 rounded-xl bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-700">
          <h3 className="text-sm font-medium mb-4 text-center">How are you feeling?</h3>
          <div className="flex flex-col gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button onClick={() => setUserMood(9)} className={`p-3 rounded-lg flex items-center justify-center ${userMood >= 8 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : ''}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Sun className="h-6 w-6" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">Good mood</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button onClick={() => setUserMood(6)} className={`p-3 rounded-lg flex items-center justify-center ${userMood >= 5 && userMood < 8 ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' : ''}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Sparkles className="h-6 w-6" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">Neutral mood</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button onClick={() => setUserMood(3)} className={`p-3 rounded-lg flex items-center justify-center ${userMood < 5 ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : ''}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Moon className="h-6 w-6" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">Low mood</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>

      <footer className="py-3 px-6 text-center text-xs text-gray-400 backdrop-blur-md bg-transparent z-10">
        <p>This is a supportive space, not a replacement for professional mental health care.</p>
      </footer>
    </div>
  )
}