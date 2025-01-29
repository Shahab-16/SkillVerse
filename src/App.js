import './App.css';
import { Routes,Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Navbar from './components/Common/Navbar';
function App() {
  return (
    <div className='bg-richblack-900 min-h-screen'>
      <Navbar/>   
      <Routes>
        <Route path='/' element={<Homepage/>}/>
      </Routes>
    </div>
  );
}

export default App;
