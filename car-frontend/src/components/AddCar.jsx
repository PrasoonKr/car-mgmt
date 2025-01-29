import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOneCar } from '../store/slices/carSlice';
import { useDispatch } from 'react-redux';
const AddCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoUrl: '',
    tags: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      setLoading(true);
      const requestData = {
        title: formData.title,
        description: formData.description,
        photoUrl: formData.photoUrl,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };
      console.log('Sending request with:', requestData);

      const response = await fetch('http://localhost:3000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });
      //data received from server
      const data = await response.json();

      if (response.ok) {//status code 200
        //add one car to redux store after adding car to server
        dispatch(addOneCar(data.carData));
        //console log the carsData
        console.log('Server response:', data.carData);
        //navigate to home page
        console.log('Success! Navigating to home page');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/');
        }, 3000);
      } else {
        throw new Error(`Failed to add car: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding car:', error);
      setError('Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-500 ease-in-out">
          Car added successfully!
        </div>
      )}
      <div className="max-w-xl w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Add New Car
        </h2>
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-400 text-center text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-6">
            <div>
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Title"
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
              />
            </div>
            <div>
              <label htmlFor="photoUrl" className="sr-only">
                Photo URL
              </label>
              <input
                id="photoUrl"
                name="photoUrl"
                type="url"
                required
                value={formData.photoUrl}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Photo URL"
              />
            </div>
            <div>
              <label htmlFor="tags" className="sr-only">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-50% flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Adding...' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddCar; 