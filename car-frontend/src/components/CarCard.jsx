import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div 
      onClick={() => navigate(`/car-details/${car._id}`)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 cursor-pointer"
    >
      <img 
        src={car.images[0]} 
        alt={car.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
        <p className="text-gray-600">
          {truncateText(car.description, 100)}
        </p>
      </div>
    </div>
  );
};
//Define PropTypes for validation
CarCard.propTypes = {
  car: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of image URLs
  }).isRequired, // Entire car object is required
};
export default CarCard;

