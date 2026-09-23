import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Specials from './pages/Specials';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cakes" element={<Gallery />} />
        <Route path="/specials" element={<Specials />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin" element={<Admin />} />

      <Route
        path="*"
        element={
          <div className="center-page">
            <h1>404</h1>
            <a href="/">Back home</a>
          </div>
        }
      />
    </Routes>
  );
}
