import Modal from '@/components/Modal';
import {
  useEditMilestoneMutation,
  useGetProgramsQuery,
  Milestone
} from '@/state/api';
import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
};

const ModalEditMilestone = ({ isOpen, onClose, milestone }: Props) => {
  const [editMilestone, { isLoading: isSaving }] = useEditMilestoneMutation();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [programId, setProgramId] = useState("");

  // Prefill all fields when modal opens
  useEffect(() => {
    if (milestone) {
      setName(milestone.name || "");
      setDescription(milestone.description || "");
      setDate(milestone.date ? milestone.date.split("T")[0] : "");
      setProgramId(milestone.programId?.toString() || "");
    }
  }, [milestone]);

  const isFormValid = (): boolean => {
    return !!name && !!description && !!date && !!programId;
  };

  const handleSubmit = async () => {
    if (!milestone || !isFormValid()) return;

    const updatedMilestone: Partial<Milestone> = {
      name,
      description,
      date: formatISO(new Date(date), { representation: 'complete' }),
      programId: parseInt(programId),
    };

    try {
      await editMilestone({
        milestoneId: milestone.id,
        updates: updatedMilestone,
      }).unwrap();
      onClose(); // close modal on success
    } catch (err: any) {
      console.error("Failed to save milestone:", err);
      alert(`Failed to save milestone: ${err?.data?.message || err?.message || 'Unknown error'}`);
    }
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Milestone`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Milestone Name:
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="Milestone Name"
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
            Program:
          </label>
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
        </div>

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
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? "Updating Milestone..." : "Update Milestone"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditMilestone;
