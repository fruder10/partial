import Modal from '@/components/Modal';
import {
  useEditTeamMutation,
  useGetUsersQuery,
  DisciplineTeam
} from '@/state/api';
import React, { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  team: DisciplineTeam | null;
};

const ModalEditDisciplineTeam = ({ isOpen, onClose, team }: Props) => {
  const [editTeam, { isLoading: isSaving }] = useEditTeamMutation();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamManagerUserId, setTeamManagerUserId] = useState("");

  // Prefill all fields when modal opens
  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setDescription(team.description || "");
      setTeamManagerUserId(team.teamManagerUserId?.toString() || "");
    }
  }, [team]);

  const isFormValid = (): boolean => {
    return !!name && !!description;
  };

  const handleSubmit = async () => {
    if (!team || !isFormValid()) return;

    const updatedTeam: Partial<DisciplineTeam> = {
      name,
      description,
      teamManagerUserId: teamManagerUserId ? parseInt(teamManagerUserId) : undefined,
    };

    try {
      await editTeam({
        teamId: team.id,
        updates: updatedTeam,
      }).unwrap();
      onClose(); // close modal on success
    } catch (err: any) {
      console.error("Failed to save team:", err);
      alert(`Failed to save team: ${err?.data?.message || err?.message || 'Unknown error'}`);
    }
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Discipline Team`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Team Name:
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Description:
          </label>
          <textarea
            className={inputStyles}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Team Manager:
          </label>
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
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? "Updating Team..." : "Update Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditDisciplineTeam;
