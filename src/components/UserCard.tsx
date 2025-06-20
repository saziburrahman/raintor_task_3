import { Briefcase, GraduationCap } from "lucide-react";
import React from "react";

interface UserCardProps {
  user: UserData;
  index: number;
}
const UserCard: React.FC<UserCardProps> = React.memo(({ user }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`user-${user.id}-name`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover bg-gray-100"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3
            id={`user-${user.id}-name`}
            className="text-lg font-semibold text-gray-900 truncate"
          >
            {user.firstName} {user.lastName}
          </h3>

          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600 truncate" title={user.email}>
              📧 {user.email}
            </p>

            <p className="text-sm text-gray-600 truncate" title={user.phone}>
              📱 {user.phone}
            </p>

            {user.company?.title && (
              <p
                className="text-sm text-blue-600 font-medium truncate"
                title={user.company.title}
              >
                <Briefcase /> {user.company.title}
              </p>
            )}

            {user.university && (
              <p
                className="text-sm text-gray-500 truncate"
                title={user.university}
              >
                <GraduationCap /> {user.university}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default UserCard;
