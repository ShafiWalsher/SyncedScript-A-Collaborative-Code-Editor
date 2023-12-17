import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Collab from './pages/Collab';

function App() {

  return (
    <>

      <Toaster
        position='top-center'
        gutter={4}
        toastOptions={{
          className: '',
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          iconTheme: {
            primary: '#FFDD4A',
            secondary: '#242325',
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<Collab />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
