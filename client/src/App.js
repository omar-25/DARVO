import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import PendingProperties from './Pages/admin/PendingProperties';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/properties" element={<PendingProperties />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
