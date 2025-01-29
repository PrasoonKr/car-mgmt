import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Body from './components/Body';
import Login from './components/Login';
import AddCar from './components/AddCar';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-car" element={<AddCar />} />
      </Routes>
    </div>
  );
}

export default App;