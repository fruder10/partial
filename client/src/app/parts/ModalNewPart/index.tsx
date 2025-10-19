import Modal from '@/components/Modal';
import { useCreatePartMutation, useGetUsersQuery, useGetProgramsQuery, useGetPartsQuery, PartState, PartStateLabels } from '@/state/api';
import React, { useState } from 'react';
//import { formatISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const ModalNewPart = ({isOpen, onClose}: Props) => {
    const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
    const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
    const { data: parts = [], isLoading: partsLoading } = useGetPartsQuery();
    const [createPart, {isLoading}] = useCreatePartMutation();
    const [partNumber, setPartNumber] = useState("");
    const [partName, setPartName] = useState("");
    const [level, setLevel] = useState("");
    const [state, setState] = useState<PartState | "">("");
    const [revisionLevel, setRevisionLevel] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [programId, setProgramId] = useState("");
    const [parentId, setParentId] = useState("");
    //const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");

    const handleSubmit = async () => {
        if (!partNumber || !partName || !level || !state || !revisionLevel || !assignedUserId || !programId) return;

        //const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete'});
        //const formattedEndDate = formatISO(new Date(endDate), { representation: 'complete'});

        await createPart({
            number: Number(partNumber),
            partName,
            level: Number(level),
            state,
            revisionLevel,
            assignedUserId: Number(assignedUserId),
            programId: Number(programId),
            parentId: Number(parentId),
            //startDate: formattedStartDate,
            //endDate: formattedEndDate
        });
    };

    const isFormValid = () => {
        return partNumber && partName && level && state && revisionLevel && assignedUserId && programId;
    };

    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Part">
            <form 
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="number"
                    className={inputStyles}
                    placeholder="Part Number"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                />
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Part Name"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                />
                <input
                    type="number"
                    className={inputStyles}
                    placeholder="Level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                />
                <select
                    className={inputStyles}
                    value={state}
                    onChange={(e) => setState(e.target.value as PartState)}
                >
                    <option value="">Select State</option>
                    {Object.values(PartState).map((stateValue) => (
                        <option key={stateValue} value={stateValue}>
                            {PartStateLabels[stateValue]}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Revision Level"
                    value={revisionLevel}
                    onChange={(e) => setRevisionLevel(e.target.value)}
                />
                <select
                    className={inputStyles}
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    disabled={usersLoading}
                >
                    <option value="">Select Assigned User</option>
                    {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                        {user.name} ({user.username})
                        </option>
                    ))}
                </select>
                <select
                    className={inputStyles}
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
                <select
                    className={inputStyles}
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    disabled={partsLoading}
                >
                    <option value="">Select Parent Part</option>
                    {parts.map((part) => (
                        <option key={part.id} value={part.id}>
                        {part.number} - {part.partName}
                        </option>
                    ))}
                </select>
                {/* <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div> */}
                <button
                    type="submit"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Part"}
                </button>
            </form>
        </Modal>
    )
};

export default ModalNewPart;