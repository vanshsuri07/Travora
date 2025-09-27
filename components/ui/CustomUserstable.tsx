import React from 'react';
import { cn } from '~/lib/utlis';

interface UserData {
  name: string;
  email: string;
  joinedAt: string;
  status: 'user' | 'admin';
  imageUrl: string;
  

}

interface CustomTableProps {
  users: UserData[];
}

const CustomUsersTable = ({ users }: CustomTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm border">
      {/* Table Header */}
      <div className="bg-gray-50 border-b">
        <div className="grid grid-cols-4 gap-4 px-6 py-4 text-left">
          <div className="font-medium text-gray-700 text-sm">Name</div>
          <div className="font-medium text-gray-700 text-sm">Email Address</div>
          <div className="font-medium text-gray-700 text-sm">Date Joined</div>
          <div className="font-medium text-gray-700 text-sm">Type</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {users.map((user, index) => (
          <div 
            key={user.email || index}
            className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Name Column with Avatar */}
            <div className="flex items-center gap-1.5">
              <img 
                src={user.imageUrl} 
                alt="user" 
                className="rounded-full size-8 aspect-square object-cover" 
                referrerPolicy="no-referrer"
              />
              <span className="text-sm text-gray-900 truncate">{user.name}</span>
            </div>

            {/* Email Column */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 truncate">{user.email}</span>
            </div>

            {/* Date Joined Column */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700">{user.joinedAt}</span>
            </div>

            {/* Status Column */}
            <div className="flex items-center">
              <div className={cn(
                'status-column inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
                user.status === 'user' 
                  ? 'bg-success-50 text-success-700' 
                  : 'bg-light-300 text-gray-500'
              )}>
                <div className={cn(
                  'size-1.5 rounded-full',
                  user.status === 'user' ? 'bg-success-500' : 'bg-gray-500'
                )} />
                <span className="font-inter">{user.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-500 text-sm">No users found</div>
        </div>
      )}
    </div>
  );
};

export default CustomUsersTable;