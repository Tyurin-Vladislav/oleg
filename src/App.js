import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllEmployeesPage from './pages/AllEmployeesPage';
import SingleEmployeePage from './pages/SingleEmployeePage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AllEmployeesPage />} />
          <Route path="/employee/:id" element={<SingleEmployeePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
