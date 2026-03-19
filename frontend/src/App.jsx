/* eslint-disable no-useless-catch */

import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast' 
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './constant/url.js'
import LoadingSpinner from './components/common/LoadingSpinner'

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json();
      if (res.status === 401) {
        return null;
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      return data;
    },
    retry: false,
  })
  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>
      <LoadingSpinner size='lg' />
    </div>;
  }
  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar authUser={authUser} />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' replace />} />
        <Route path='/login' element={authUser ? <Navigate to='/' replace /> : <LoginPage />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' replace /> : <SignupPage />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' replace />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' replace />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App