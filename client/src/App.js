import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';  
import PendingProperties from './Pages/admin/PendingProperties';
import CreateProperty from './Pages/CClient/createProperty';  
import Homepage from './Pages/Client/HomePage';
import AdvancedFilterPage from './Pages/Client/AdvancedFilterPage';
import PropertyDetails from './Pages/Client/PropertyDetails';
import CompareProperties from './Pages/Client/CompareProperties';
import AddUser from './Pages/admin/AddUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin/properties" element={<PendingProperties />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/create-property" element={<CreateProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/advanced-filter" element={<AdvancedFilterPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/compare/:idA/:idB" element={<CompareProperties />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;