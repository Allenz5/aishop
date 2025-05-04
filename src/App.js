import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Space from './pages/Space';
import Product from './pages/Product';
import Agent from './pages/Agent';
import Store from './pages/Store';
import Store1 from './pages/Store1';
import Store2 from './pages/Store2';
import Store3 from './pages/Store3';
import Store4 from './pages/Store4';
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
          <Route path="/store/4ref3" element={<Store2 />} />
          <Route path="/store/3f4tc" element={<Store3 />} />
          <Route path="/store/43r87" element={<Store4 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
