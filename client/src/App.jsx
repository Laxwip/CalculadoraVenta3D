import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage/Homepage'
import './App.css'

function App() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <Routes>

        <Route
        path='/'
        element={<Homepage></Homepage>}
        
        ></Route>
      </Routes>
    </>
  )
}

export default App
