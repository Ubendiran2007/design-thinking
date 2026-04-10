import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes.jsx'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  )
}

export default App
