import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Donations from './pages/Donations'
import Events from './pages/Events'
import Volunteers from './pages/Volunteers'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rotas principais */}
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          <Route path="/users" element={
            <Layout>
              <Users />
            </Layout>
          } />
          
          <Route path="/donations" element={
            <Layout>
              <Donations />
            </Layout>
          } />
          
          <Route path="/events" element={
            <Layout>
              <Events />
            </Layout>
          } />
          
          <Route path="/volunteers" element={
            <Layout>
              <Volunteers />
            </Layout>
          } />
          
          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  )
}

export default App
