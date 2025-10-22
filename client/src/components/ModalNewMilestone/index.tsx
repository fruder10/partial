import Modal from '@/components/Modal';
import {
  useCreateMilestoneMutation,
  useGetProgramsQuery,
  Milestone
} from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewMilestone = ({
  isOpen,
  onClose,
}: Props) => {
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const [createMilestone, { isLoading }] = useCreateMilestoneMutation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [programId, setProgramId] = useState("");

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload: Partial<Milestone> = {
      name,
      description,
      date: formatISO(new Date(date), { representation: 'complete' }),
      programId: parseInt(programId),
    };

    try {
      await createMilestone(payload).unwrap();
      onClose(); // close modal on success
    } catch (err) {
      console.error("Failed to create milestone:", err);
    }
  };

  const isFormValid = (): boolean => {
    return !!name && !!description && !!date && !!programId;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={"Create New Milestone"}>
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
          placeholder="Milestone Name"
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
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          disabled={programsLoading}
        >
          <option value="">Select Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Milestone Date:
          </label>
          <input
            type="date"
            className={inputStyles}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating Milestone..." : "Create Milestone"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewMilestone;
