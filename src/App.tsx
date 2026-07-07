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
import { Outlet, useLocation } from 'react-router'
import BottomNavBar from './components/bottomnavbar/bottomnavbar.tsx'

function MainLayout() {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);

  return (
    <div>
      {!hideNav && <BottomNavBar />}
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <LiveKitProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>

            <Route path="/createroom" element={<Createaudioroom />} />
            <Route path='/rooms/:roomID' element={<Joinroom />} />
            <Route path='/rooms' element={<Audiorooms />} />
            <Route path='/engageroom/:roomID' element={<EngagedRoom />} />
            <Route path='/record' element={<SimpleRecordButton />} />
            <Route path='/' element={<Signup />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter >
    </LiveKitProvider>
  )
}

export default App
