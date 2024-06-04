import { Link } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces([...response.data]);
    });
  }, []);

  return (
    <div className="mt-8 grid gap-x-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 && places.map(place => (
        <Link key={place._id} to={'/place/' + place._id} className="block">
          <div className="bg-gray-100 rounded-2xl mb-2 flex overflow-hidden">
            {place.photos?.[0] && (
              <img className="object-cover w-95 h-60 rounded-2xl border border-gray-500" src={'http://localhost:8000/uploads/' + place.photos?.[0]} alt="" />
            )}
          </div>
          <h3 className="font-bold">{place.address}</h3>
          <h2 className="text-sm text-gray-500">{place.title}</h2>
          <div className="mt-1"><span className="font-bold">${place.price}</span> per night</div>
        </Link>
      ))}
    </div>
  );
};

export default IndexPage;
