'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function NavbarClient() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='bg-gray-900 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          <Link
            href='/'
            className='text-2xl font-bold text-red-600 hover:text-red-500 transition duration-300'>
            D&D Monster Codex
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex space-x-4'>
            <Link
              href='/monsters'
              className='hover:text-red-500 transition duration-300'>
              Monsters
            </Link>
            {status === 'authenticated' && (
              <>
                <Link
                  href='/dashboard'
                  className='hover:text-red-500 transition duration-300'>
                  Dashboard
                </Link>
                <Link
                  href='/heroes'
                  className='hover:text-red-500 transition duration-300'>
                  Heroes
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link
                      href='/admin/users'
                      className='hover:text-red-500 transition duration-300'>
                      Manage Users
                    </Link>
                    <Link
                      href='/admin/monsters'
                      className='hover:text-red-500 transition duration-300'>
                      Manage Monsters
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className='hover:text-red-500 transition duration-300'>
                  Logout
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link
                  href='/login'
                  className='hover:text-red-500 transition duration-300'>
                  Login
                </Link>
                <Link
                  href='/register'
                  className='hover:text-red-500 transition duration-300'>
                  Register
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
              href='/monsters'
              className='block hover:text-red-500 transition duration-300'>
              Monsters
            </Link>
            {status === 'authenticated' && (
              <>
                <Link
                  href='/dashboard'
                  className='block hover:text-red-500 transition duration-300'>
                  Dashboard
                </Link>
                <Link
                  href='/heroes'
                  className='block hover:text-red-500 transition duration-300'>
                  Heroes
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link
                      href='/admin/users'
                      className='block hover:text-red-500 transition duration-300'>
                      Manage Users
                    </Link>
                    <Link
                      href='/admin/monsters'
                      className='block hover:text-red-500 transition duration-300'>
                      Manage Monsters
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className='block hover:text-red-500 transition duration-300'>
                  Logout
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link
                  href='/login'
                  className='block hover:text-red-500 transition duration-300'>
                  Login
                </Link>
                <Link
                  href='/register'
                  className='block hover:text-red-500 transition duration-300'>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}