'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NavbarClient() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Handle session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Optionally redirect to login page
      router.push('/login');
      
      // Close mobile menu if it's open
      setIsMenuOpen(false);
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setIsMenuOpen(false);
  };

  return (
    <nav className='bg-gray-900 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          <Link
            href='/'
            className='text-2xl font-bold text-red-600 hover:text-red-500 transition duration-300'>
            Аренда недвижимости
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex space-x-4'>
            <Link
              href='/properties'
              className='hover:text-red-500 transition duration-300'>
              Квартиры
            </Link>
            {status === 'authenticated' && (
              <>
                <Link
                  href='/dashboard'
                  className='hover:text-red-500 transition duration-300'>
                  Панель управления
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link
                      href='/admin/users'
                      className='hover:text-red-500 transition duration-300'>
                      Управление пользователями
                    </Link>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className='hover:text-red-500 transition duration-300'>
                  Выйти
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link
                  href='/login'
                  className='hover:text-red-500 transition duration-300'>
                  Войти
                </Link>
                <Link
                  href='/register'
                  className='hover:text-red-500 transition duration-300'>
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-white focus:outline-none'>
              <svg
                className='h-6 w-6'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden mt-4 space-y-2'>
            <Link
              href='/properties'
              className='block hover:text-red-500 transition duration-300'>
              Квартиры
            </Link>
            {status === 'authenticated' && (
              <>
                <Link
                  href='/dashboard'
                  className='block hover:text-red-500 transition duration-300'>
                  Панель управления
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link
                      href='/admin/users'
                      className='block hover:text-red-500 transition duration-300'>
                      Управление пользователями
                    </Link>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className='block hover:text-red-500 transition duration-300'>
                  Выйти
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link
                  href='/login'
                  className='block hover:text-red-500 transition duration-300'>
                  Войти
                </Link>
                <Link
                  href='/register'
                  className='block hover:text-red-500 transition duration-300'>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
