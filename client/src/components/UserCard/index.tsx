import { User } from "@/state/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${user.userId}`);
  };

  return (
    <div 
      className="rounded border p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 mb-3">
        {user.profilePictureUrl ? (
          <Image
            src={`/p1.jpeg`}
            alt="profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
            {user.username?.substring(0, 2).toUpperCase() || "?"}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.username}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        {user.phoneNumber && (
          <div>
            <span className="font-medium">Phone:</span> {user.phoneNumber}
          </div>
        )}
        <div>
          <span className="font-medium">Role:</span> {user.role}
        </div>
        {user.disciplineTeam && (
          <div>
            <span className="font-medium">Discipline Team:</span> {user.disciplineTeam.name}
          </div>
        )}
        {user.authoredWorkItems && user.authoredWorkItems.length > 0 && (
          <div>
            <span className="font-medium">Authored Work Items:</span> {user.authoredWorkItems.length}
          </div>
        )}
        {user.assignedWorkItems && user.assignedWorkItems.length > 0 && (
          <div>
            <span className="font-medium">Assigned Work Items:</span> {user.assignedWorkItems.length}
          </div>
        )}
        {user.partNumbers && user.partNumbers.length > 0 && (
          <div>
            <span className="font-medium">Part Numbers:</span> {user.partNumbers.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;