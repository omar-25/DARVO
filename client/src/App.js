import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import PendingProperties from './Pages/admin/PendingProperties';
import CreateProperty from './Pages/CClient/createProperty';
import Homepage from './Pages/Client/HomePage';
import AdvancedFilterPage from './Pages/Client/AdvancedFilterPage';
import PropertyDetails from './Pages/Client/PropertyDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin/properties" element={<PendingProperties />} />
        <Route path="/create-property" element={<CreateProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/advanced-filter" element={<AdvancedFilterPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;