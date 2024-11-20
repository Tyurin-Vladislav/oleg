import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllEmployeesPage from './pages/AllEmployeesPage';
import SingleEmployeePage from './pages/SingleEmployeePage';
import 'react-toastify/dist/ReactToastify.css';
import AddEmployeePage from './pages/AddEmployeePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AllEmployeesPage />} />
          <Route path="/employee/:id" element={<SingleEmployeePage />} />
          <Route path="/add-employee" element={<AddEmployeePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
