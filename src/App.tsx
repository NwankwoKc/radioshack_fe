import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Createaudioroom from './components/create-audioroom/create-audioroom.tsx'
import Joinroom from './components/joinroom/joinroom.tsx'
import Audiorooms from './components/audiorooms/audiorooms.tsx'
import EngagedRoom from './components/engageroom/engageroom.tsx'
import { LiveKitProvider } from './util/livekitcontext.tsx'
import Login from './components/login/login.tsx'
import Signup from './components/signup/signup.tsx'
import SimpleRecordButton from './util/record.tsx'
function App() {
  return (
    <LiveKitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/createroom" element={<Createaudioroom />} />
          <Route path='/rooms/:userID' element={<Joinroom />} />
          <Route path='/rooms' element={<Audiorooms />} />
          <Route path='/engageroom/:userID' element={<EngagedRoom />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/record' element={<SimpleRecordButton />} />
        </Routes>
      </BrowserRouter >
    </LiveKitProvider>
  )
}

export default App
