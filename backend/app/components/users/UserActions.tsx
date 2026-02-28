'use client';

export default function UserActions({ user, onEdit, onToggleStatus }) {
  const isAdmin = user.role === 'Admin';

  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => onEdit(user)}
        className="text-blue-600 hover:text-blue-900 focus:outline-none"
      >
        Edit
      </button>
      {!isAdmin && (
        <button
          onClick={() => onToggleStatus(user.id)}
          className={`${
            user.status === 'Active'
              ? 'text-red-600 hover:text-red-900'
              : 'text-green-600 hover:text-green-900'
          } focus:outline-none`}
        >
          {user.status === 'Active' ? 'Disable' : 'Enable'}
        </button>
      )}
    </div>
  );
}