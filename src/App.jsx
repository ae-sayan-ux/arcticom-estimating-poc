import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import FormVariationA from './pages/FormVariationA'
import FormVariationB from './pages/FormVariationB'
import FormVariationC from './pages/FormVariationC'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/form/a" element={<FormVariationA />} />
      <Route path="/form/b" element={<FormVariationB />} />
      <Route path="/form/c" element={<FormVariationC />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
