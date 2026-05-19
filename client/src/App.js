import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import PendingProperties from './Pages/admin/PendingProperties';
import CreateProperty from './Pages/CClient/createProperty';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/properties" element={<PendingProperties />} />
        <Route path="/create-property" element={<CreateProperty />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;