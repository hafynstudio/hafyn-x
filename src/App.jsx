import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import CalculatorPage from './pages/CalculatorPage'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/pro" element={<PricingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
