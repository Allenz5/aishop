import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Space from './pages/Space';
import Product from './pages/Product';
import Agent from './pages/Agent';
import Store from './pages/Store';
import Store1 from './pages/Store1';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/space" element={<Space />} />
          <Route path="/product" element={<Product />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/store/jx518" element={<Store />} />
          <Route path="/store/8w4ft" element={<Store1 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
