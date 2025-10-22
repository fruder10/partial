import Modal from '@/components/Modal';
import {
  useCreateProgramMutation,
  useGetUsersQuery,
  Program
} from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProgram = ({
  isOpen,
  onClose,
}: Props) => {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [createProgram, { isLoading }] = useCreateProgramMutation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [programManagerUserId, setProgramManagerUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload: Partial<Program> = {
      name,
      description,
      programManagerUserId: parseInt(programManagerUserId),
      startDate: formatISO(new Date(startDate), { representation: 'complete' }),
      endDate: formatISO(new Date(endDate), { representation: 'complete' }),
    };

    try {
      await createProgram(payload).unwrap();
      onClose(); // close modal on success
    } catch (err) {
      console.error("Failed to create program:", err);
    }
  };

  const isFormValid = (): boolean => {
    return !!name && !!startDate && !!endDate;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={"Create New Program"}>
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
          placeholder="Program Name"
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
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating Program..." : "Create Program"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProgram;
