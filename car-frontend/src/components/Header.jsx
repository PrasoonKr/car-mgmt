import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeUser } from '../store/slices/userSlice';
import { clearCar } from '../store/slices/carSlice';


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(clearCar());
    navigate('/login');
  };

  if (!user) {
    return null; // Or show a different header for non-logged-in users
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-4xl font-bold text-red-600">
        CarDekho.com
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/add-car')} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
          Add Car
        </button>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-100"
        >
          Logout
        </button>
          <span className="text-gray-700">
          Hi, {user?.username || 'Guest'}
        </span>
      </div>
    </header>
  );
};

export default Header;