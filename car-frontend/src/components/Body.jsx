import { useSelector } from 'react-redux';
import Header from './Header';
import CarCard from './CarCard';

const Body = () => {
  const cars = useSelector((state) => state.car);
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!cars?.length ? (
          <div className="text-6xl text-gray-300 text-center mx-auto my-32">
            Add your first car
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
