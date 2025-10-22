import Modal from '@/components/Modal';
import {
  useEditProgramMutation,
  useGetUsersQuery,
  Program
} from '@/state/api';
import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
};

const ModalEditProgram = ({ isOpen, onClose, program }: Props) => {
  const [editProgram, { isLoading: isSaving }] = useEditProgramMutation();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [programManagerUserId, setProgramManagerUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Prefill all fields when modal opens
  useEffect(() => {
    if (program) {
      setName(program.name || "");
      setDescription(program.description || "");
      setProgramManagerUserId(program.programManagerUserId?.toString() || "");
      setStartDate(program.startDate ? program.startDate.split("T")[0] : "");
      setEndDate(program.endDate ? program.endDate.split("T")[0] : "");
    }
  }, [program]);

  const isFormValid = (): boolean => {
    return !!name && !!startDate && !!endDate;
  };

  const handleSubmit = async () => {
    if (!program || !isFormValid()) return;

    const updatedProgram: Partial<Program> = {
      name,
      description,
      programManagerUserId: programManagerUserId ? parseInt(programManagerUserId) : undefined,
      startDate: formatISO(new Date(startDate), { representation: 'complete' }),
      endDate: formatISO(new Date(endDate), { representation: 'complete' }),
    };

    try {
      await editProgram({
        programId: program.id,
        updates: updatedProgram,
      }).unwrap();
      onClose(); // close modal on success
    } catch (err: any) {
      console.error("Failed to save program:", err);
      alert(`Failed to save program: ${err?.data?.message || err?.message || 'Unknown error'}`);
    }
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Program`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Program Name:
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="Program Name"
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
            Program Manager:
          </label>
          <select
            className={selectStyles}
            value={programManagerUserId}
            onChange={(e) => setProgramManagerUserId(e.target.value)}
            disabled={usersLoading}
          >
            <option value="">Select Program Manager (Optional)</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Start Date:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              End Date:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? "Updating Program..." : "Update Program"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditProgram;
