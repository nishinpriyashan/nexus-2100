import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NexusNav from './components/navigation/NexusNav'
import Home from './pages/Home'
import Journey from './pages/Journey'
import Tracking from './pages/Tracking'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-primary-text">
        <NexusNav />
        <main className="flex-1 w-full h-full pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
