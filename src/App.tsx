import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Createaudioroom from './components/create-audioroom/create-audioroom.tsx'
import Joinroom from './components/joinroom/joinroom.tsx'
import Audiorooms from './components/audiorooms/audiorooms.tsx'
import EngagedRoom from './components/engageroom/engageroom.tsx'
import { LiveKitProvider } from './util/livekitcontext.tsx'
function App() {
  return (
    <BrowserRouter>
      <LiveKitProvider>
        <Routes>
          <Route path="/createroom" element={<Createaudioroom />} />
          <Route path='/rooms/:userID' element={<Joinroom />} />
          <Route path='/rooms' element={<Audiorooms />} />
          <Route path='/engageroom/:userID' element={<EngagedRoom />} />
        </Routes>
      </LiveKitProvider>
    </BrowserRouter>
  )
}

export default App
