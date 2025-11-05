import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogDetails from './pages/BlogDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BackToTop from './components/BackToTop'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import { Roles } from './lib/auth'
import CreatePost from './pages/CreatePost'
import ScrollToTop from './components/ScrollToTop'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Header />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute roles={[Roles.Admin]} />}> 
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={[Roles.Admin, Roles.User]} />}> 
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </div>
  )
}

export default App
