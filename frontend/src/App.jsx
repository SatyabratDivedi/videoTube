import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainDashboard from './components/MainDashboard';
import './App.css';
import './index.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
