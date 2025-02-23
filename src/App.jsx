import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutesSystem from './routes';
import { AuthProvider } from './services/context/AuthProvider';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<RoutesSystem />} />
          </Routes>          
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;