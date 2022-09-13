import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Forest } from './components'
import './custom.sass'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Forest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
