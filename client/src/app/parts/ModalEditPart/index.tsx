"use client";

import Modal from "@/components/Modal";
import {  useEditPartMutation,
          useDeletePartMutation,
          useGetUsersQuery,
          useGetProgramsQuery,
          useGetPartsQuery
} from "@/state/api";
import React, { useState, useEffect } from "react";
import { PartNumber } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  part?: {
    id: number;
    number?: number;
    partName?: string;
    level?: number;
    state?: string;
    revisionLevel?: string;
    assignedUserId?: number;
    programId?: number;
    parentId?: number | null;
    } | null;
};

const ModalEditPart = ({ isOpen, onClose, part }: Props) => {
  const [editPart, { isLoading }] = useEditPartMutation();
  const [deletePart, { isLoading: isDeleting }] = useDeletePartMutation();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const { data: parentParts = [], isLoading: partsLoading } = useGetPartsQuery();

  const [partNumber, setPartNumber] = useState("");
  const [partName, setPartName] = useState("");
  const [level, setLevel] = useState("");
  const [state, setState] = useState("");
  const [revisionLevel, setRevisionLevel] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [assignedUserName, setAssignedUserName] = useState("");
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentPartName, setParentPartName] = useState("");

  // ✅ Auto-fill fields when modal opens or part changes
  useEffect(() => {
    if (part) {
      setPartNumber(part?.number?.toString() || "");
      setPartName(part?.partName || "");
      setLevel(part?.level?.toString() || "");
      setState(part?.state || "");
      setRevisionLevel(part?.revisionLevel || "");
      
      setAssignedUserId(part?.assignedUserId?.toString() || "");
      // prefill assignedUserName if part.assignedUserId is known
      const assignedUser = users.find((u) => u.userId === part.assignedUserId);
      setAssignedUserName(assignedUser?.name || "");
      
      setProgramId(part?.programId?.toString() || "");
      // Prefill program name if known
      const program = programs.find((p) => p.id === part.programId);
      setProgramName(program?.name || "");

      setParentId(part?.parentId?.toString() || "");
      // prefill assignedUserName if part.assignedUserId is known
      const parentPart = parentParts.find((p) => p.id === part.parentId);
      setParentPartName(parentPart?.partName || "");
    }
  }, [part, users, programs, parentParts]);

  const handleSubmit = async () => {
    if (!part) return;

    await editPart({
      partNumberId: part.id,
      updates: {
        number: Number(partNumber),
        partName,
        level: Number(level),
        state,
        revisionLevel,
        assignedUserId: Number(assignedUserId),
        programId: Number(programId),
        parentId: parentId ? Number(parentId) : undefined,
      },
    });

    onClose(); // close modal on success
  };

  const isFormValid = () =>
    partNumber && partName && level && state && revisionLevel && assignedUserId && programId;

  const handleDelete = async () => {
    if (!part) return;

    const confirmed = window.confirm(
        `Are you sure you want to delete "${part.partName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
        await deletePart(part.id).unwrap();
        onClose(); // close modal on success
    } catch (err) {
        console.error("Failed to delete part:", err);
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Part">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Part Number:
            </label>
            <input
                type="number"
                className={inputStyles}
                placeholder="Part Number"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Part Name:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Part Name"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Level:
            </label>
            <input
                type="number"
                className={inputStyles}
                placeholder="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                State:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Revision Level:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Revision Level"
                value={revisionLevel}
                onChange={(e) => setRevisionLevel(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Assignee:
            </label>
            <select
              className={inputStyles}
              value={assignedUserId}
              onChange={(e) => {
                setAssignedUserId(e.target.value);
                const selected = users.find((u) => u.userId === Number(e.target.value));
                setAssignedUserName(selected?.name || "");
              }}
              disabled={usersLoading}
            >
              <option value="">Select Assigned User</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Program:
            </label>
            <select
              className={inputStyles}
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value);
                const selected = programs.find((p) => p.id === Number(e.target.value));
                setProgramName(selected?.name || "");
              }}
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
                Parent Part:
            </label>
            <select
              className={inputStyles}
              value={parentId}
              onChange={(e) => {
                setParentId(e.target.value);
                const selected = parentParts.find((p) => p.id === Number(e.target.value));
                setParentPartName(selected?.partName || "");
              }}
              disabled={partsLoading}
            >
              <option value="">Select Parent Part</option>
              {parentParts.map((parentPart) => (
                <option key={parentPart.id} value={parentPart.id}>
                  {parentPart.number} - {parentPart.partName}
                </option>
              ))}
            </select>
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Updating..." : "Update Part"}
        </button>
        <button
            type="button"
            onClick={handleDelete}
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isDeleting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isDeleting}
        >
            {isDeleting ? `Deleting Part` : `Delete Part`}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditPart;
