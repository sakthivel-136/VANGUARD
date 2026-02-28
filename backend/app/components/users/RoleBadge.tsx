'use client';

export default function RoleBadge({ role }) {
  const getBadgeClasses = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'Guard':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClasses(role)}`}>
      {role}
    </span>
  );
}