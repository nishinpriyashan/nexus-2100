import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import NexusNav from './components/navigation/NexusNav'
import Home from './pages/Home'
import Journey from './pages/Journey'
import Tracking from './pages/Tracking'
import { useJourneyStore } from './store/journeyStore'

function App() {
  const { passport } = useJourneyStore()
  
  return (
    <ThemeProvider>
      <Router basename="/nexus-2100">
        <div 
          className={`flex flex-col min-h-screen bg-background text-primary-text 
            ${passport.mobility.visualAssistance ? 'nexus-visual-assistance' : ''} 
            ${passport.mobility.reducedMotion ? 'nexus-reduced-motion' : ''}
          `}
        >
          {/* Global screen reader announcement region for Phase 6 */}
          <div aria-live="polite" className="sr-only" id="nexus-live-announcer" />
          
          <NexusNav />
          <main className="flex-1 w-full h-full pt-20">
            <Routes>
              <Route path="/" element={<Tracking />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/tracking" element={<Tracking />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
