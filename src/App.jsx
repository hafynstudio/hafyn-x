import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import CalculatorPage from './pages/CalculatorPage'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import ProSuccessPage from './pages/ProSuccessPage'
import CoachChat from './components/coach/CoachChat'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0a]">
          <Navbar />
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/calculator"   element={<CalculatorPage />} />
            <Route path="/pricing"      element={<PricingPage />} />
            <Route path="/pro"          element={<PricingPage />} />
            <Route path="/pro-success"  element={<ProSuccessPage />} />
          </Routes>
          <CoachChat />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App