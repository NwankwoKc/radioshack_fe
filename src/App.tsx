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
import Search from './components/search/search.tsx'
import ProfileCard from './components/profile/profile.tsx'
import { useEffect } from 'react'

function MainLayout() {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);
  // Debug logging
  useEffect(() => {
    console.log('Current path:', location.pathname);
    console.log('Should hide nav:', hideNav);
  }, [location, hideNav]);
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
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route element={<MainLayout />}>
            <Route path="/createroom" element={<Createaudioroom />} />
            <Route path='/rooms/:roomID' element={<Joinroom />} />
            <Route path='/rooms' element={<Audiorooms />} />
            <Route path='/engageroom/:roomID' element={<EngagedRoom />} />
            <Route path='/profile' element={<ProfileCard />} />
            <Route path='/search' element={<Search />} />
            <Route path='/record' element={<SimpleRecordButton />} />
            <Route path='/' element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </LiveKitProvider>
  )
}

export default App
