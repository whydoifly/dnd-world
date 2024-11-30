import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {session.user.nickname}
      </h1>

      {/* Content for all users */}

      {/* Admin-only content */}
      {session.user.role === 'admin' && (
        <div>
          <h2 className='text-xl font-semibold mb-2'>Admin Actions</h2>
          <ul>
            <li>
              <Link
                href='/admin/users'
                className='text-blue-500 hover:underline'>
                Управление пользователями
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
