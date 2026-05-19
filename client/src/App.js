import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PendingProperties from './pages/admin/PendingProperties';
import CreateProperty from './pages/CClient/createProperty';
import Homepage from './pages/Client/HomePage';
import AdvancedFilterPage from './pages/Client/AdvancedFilterPage';
import PropertyDetails from './pages/Client/PropertyDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin/properties" element={<PendingProperties />} />
        <Route path="/create-property" element={<CreateProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/advanced-filter" element={<AdvancedFilterPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;