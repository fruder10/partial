import Modal from '@/components/Modal';
import {
  useCreateTeamMutation,
  useGetUsersQuery,
  DisciplineTeam
} from '@/state/api';
import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewDisciplineTeam = ({
  isOpen,
  onClose,
}: Props) => {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamManagerUserId, setTeamManagerUserId] = useState("");

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload: Partial<DisciplineTeam> = {
      name,
      description,
      teamManagerUserId: teamManagerUserId ? parseInt(teamManagerUserId) : undefined,
    };

    try {
      await createTeam(payload).unwrap();
      onClose(); // close modal on success
    } catch (err) {
      console.error("Failed to create team:", err);
    }
  };

  const isFormValid = (): boolean => {
    return !!name && !!description;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={"Create New Discipline Team"}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className={selectStyles}
          value={teamManagerUserId}
          onChange={(e) => setTeamManagerUserId(e.target.value)}
          disabled={usersLoading}
        >
          <option value="">Select Team Manager (Optional)</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name} ({user.username})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewDisciplineTeam;
