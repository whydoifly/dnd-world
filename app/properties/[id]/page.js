'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import FsLightbox from 'fslightbox-react';
import Image from 'next/image';

export default function PropertyDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState({
    property: null,
    loading: true,
    error: null,
    lightbox: { toggler: false, slide: 1 },
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const id = pathname.split('/').pop();

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();
        setState((prevState) => ({ ...prevState, property: data, loading: false }));
      } catch (error) {
        console.error('Error fetching property:', error);
        setState((prevState) => ({ ...prevState, error: error.message, loading: false }));
      }
    }

    fetchProperty();
  }, [id]);

  const openLightboxOnSlide = (slideIndex) => {
    setState((prevState) => ({
      ...prevState,
      lightbox: { toggler: !prevState.lightbox.toggler, slide: slideIndex },
    }));
  };

  const { property, loading, error, lightbox } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderPropertyInfo = (title, info) => (
    <div>
      <h2 className='text-2xl font-bold mb-4 text-red-500'>{title}</h2>
      {info.map(({ label, value }) => (
        <p key={label}>
          <strong className='text-red-400'>{label}:</strong> {value}
        </p>
      ))}
    </div>
  );

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <button
        className='mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
        onClick={() => router.push('/properties')}
      >
        Get to the list of properties
      </button>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        {property.address}
      </h1>
      <div className='bg-gray-700 p-6 rounded-lg shadow-lg'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {renderPropertyInfo('Basic Info', [
            { label: 'Type', value: property.type },
            { label: 'Size', value: property.size },
            { label: 'Bedrooms', value: property.bedrooms },
            { label: 'Price', value: `$${property.price}` },
            { label: 'Commission', value: property.commission },
            { label: 'District', value: property.district },
            { label: 'Occupancy', value: property.occupancy || 'Free to enter' },
            ...(isAdmin ? [{ label: 'Owner Phone', value: property.ownerPhone }] : []),
          ])}
          {renderPropertyInfo('Features', [
            { label: 'Allowed Pets', value: property.allowedPets ? '✅' : '❌' },
            { label: 'Allowed Children', value: property.allowedChildren ? '✅' : '❌' },
            { label: 'Features', value: property.features.join(', ') },
          ])}
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4 text-red-500'>Description</h2>
          <p className='text-gray-300'>{property.description}</p>
        </div>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4 text-red-500'>Photos</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {property.photos.map((photo, index) => (
              <Image
                key={index}
                src={photo}
                alt={`Property photo ${index + 1}`}
                className='rounded-lg shadow-lg cursor-pointer'
                onClick={() => openLightboxOnSlide(index + 1)}
                width={600}
                height={600}
              />
            ))}
          </div>
        </div>
      </div>
      <FsLightbox
        toggler={lightbox.toggler}
        sources={property.photos}
        slide={lightbox.slide}
      />
    </div>
  );
}
