import './index.css';
import { Login } from '../pages/Login';
import { DashBoard } from '../pages/DashBoard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/dashboard' element={<DashBoard />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
