'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await res.json();
        setProperties(data.properties);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      // Remove the deleted property from the state
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className='text-center p-4 text-red-500'>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Список объектов
      </h1>
      {isAdmin && (
        <div className='text-center mb-8'>
          <Link href='/admin/properties/create'>
            <button className='bg-green-500 text-white px-4 py-2 rounded mr-2'>
              Создать
            </button>
          </Link>
        </div>
      )}
      {properties.length === 0 ? (
        <p className='text-center text-xl'>No properties found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((property) => (
            <div key={property._id}>
              <Link href={`/properties/${property._id}`}>
                <div className='bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:bg-gray-600 transform hover:-translate-y-1 hover:scale-105'>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className='mb-4'>
                    {property.photos.map((photo, index) => (
                      <SwiperSlide key={index}>
                        <Image
                          src={photo}
                          alt={`Property photo ${index + 1}`}
                          width={500}
                          height={300}
                          className='w-full h-48 object-cover rounded-lg'
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <h2 className='text-xl font-bold mb-2 text-red-500'>
                    {property.address}
                  </h2>
                  <p className='text-gray-300'>Type: {property.type}</p>
                  <p className='text-gray-300'>Price: ${property.price}</p>

                  {isAdmin && (
                    <p className='text-gray-300'>Телефон: {property.ownerPhone}</p>
                  )}

                  <p className='text-gray-300'>
                    Occupancy: {property.occupancy || 'Free to enter'}
                  </p>
                  <p className='text-gray-300 mt-2 truncate'>
                    {property.description}
                  </p>
                </div>
              </Link>
              {isAdmin && (
                <div className='mt-2 flex justify-end gap-2'>
                  <Link href={`/admin/properties/edit/${property._id}`}>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded'>
                      Редактировать
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(property._id)}
                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
