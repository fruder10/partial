import { useGetWorkItemsByPartNumberQuery, useUpdateWorkItemStatusMutation, useEditWorkItemMutation } from '@/state/api';
import ModalEditWorkItem from '@/components/ModalEditWorkItem';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WorkItem as WorkItemType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus, CircleUser } from 'lucide-react';
import { format } from "date-fns";
import Image from 'next/image';
import Link from 'next/link';

type BoardProps = {
    id: string;
    setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
};

const workItemStatus = ["ToDo", "WorkInProgress", "UnderReview", "Completed"];

const statusLabels: Record<string, string> = {
  ToDo: "To Do",
  WorkInProgress: "Work In Progress",
  UnderReview: "Under Review",
  Completed: "Completed"
};

const BoardView = ({ id, setIsModalNewWorkItemOpen }: BoardProps) => {
    const {
        data: workItems,
        isLoading,
        error
    } = useGetWorkItemsByPartNumberQuery({ partNumberId: Number(id)});
    const [updateWorkItemStatus] = useUpdateWorkItemStatusMutation();

    const moveWorkItem = (workItemId: number, toStatus: string) => {
        updateWorkItemStatus({ workItemId, status: toStatus })
    };

    const [editingWorkItem, setEditingWorkItem] = useState<WorkItemType | null>(null);

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An error occured while fetching work items</div>;

    return <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            {workItemStatus.map((status) => (
                <WorkItemColumn
                    key={status}
                    status={status}
                    workItems={workItems || []}
                    moveWorkItem={moveWorkItem}
                    setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen}
                    setEditingWorkItem={setEditingWorkItem}
                />
            ))}
        </div>
        {editingWorkItem && (
            <ModalEditWorkItem
                isOpen={!!editingWorkItem}
                onClose={() => setEditingWorkItem(null)}
                workItem={editingWorkItem}
            />
        )}
    </DndProvider>;
};

type WorkItemColumnProps = {
    status: string;
    workItems: WorkItemType[];
    moveWorkItem: (workItemId: number, toStatus: string) => void;
    setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
    setEditingWorkItem: (workItem: WorkItemType | null) => void;
};

const WorkItemColumn = ({
    status,
    workItems,
    moveWorkItem,
    setIsModalNewWorkItemOpen,
    setEditingWorkItem,
    }: WorkItemColumnProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "workItem",
        drop: (item: { id: number }) => moveWorkItem(item.id, status),
        collect: (monitor: any) => ({
        isOver: !!monitor.isOver(),
        }),
    }));

    const workItemCount = workItems.filter((workItem) => workItem.status === status).length;

    const statusColor: any = {
        "ToDo": "#2563EB",
        "WorkInProgress": "#059669",
        "UnderReview": "#D97706",
        "Completed": "#000000",
    }

    return (
        <div
            ref={(instance) => {
                drop(instance);
            }}
            className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
        >
            <div className="mb-3 flex w-full">
                <div 
                    className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor[status] }}
                />
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className="flex items-center text-lg font-semibold dark:text-white">
                        {statusLabels[status]}{" "}
                        <span
                            className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                            {workItemCount}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26} />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
                            onClick={() => setIsModalNewWorkItemOpen(true)}>
                                <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {workItems.filter((workItem) => workItem.status === status).map((workItem) => (
                <WorkItem
                    key={workItem.id}
                    workItem={workItem}
                    setEditingWorkItem={setEditingWorkItem}
                />
            ))}
        </div>
    )

};

type WorkItemProps = {
    workItem: WorkItemType;
    setEditingWorkItem: (workItem: WorkItemType | null) => void;
}

const WorkItem = ({ workItem, setEditingWorkItem }: WorkItemProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "workItem",
        item: { id: workItem.id },
        collect: (monitor: any) => ({
        isDragging: !!monitor.isDragging(),
        }),
    }));

    const workItemTagsSplit = workItem.tags ? workItem.tags.split(",") : [];

    const formattedDateOpened = workItem.dateOpened
        ? format(new Date(workItem.dateOpened), "P")
        : "";
    const formattedDueDate = workItem.dueDate
        ? format(new Date(workItem.dueDate), "P")
        : "";
    const formattedEstimatedCompletionDate = workItem.estimatedCompletionDate
        ? format(new Date(workItem.estimatedCompletionDate), "P")
        : "";
    const formattedActualCompletionDate = workItem.actualCompletionDate
        ? format(new Date(workItem.actualCompletionDate), "P")
        : "";

    const numberOfComments = (workItem.comments && workItem.comments.length) || 0;

    const PriorityTag = ({ priority }: { priority: WorkItemType["priority"]}) => (
        <div
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                priority === "Urgent"
                ? "bg-red-200 text-red-700"
                : priority === "High"
                    ? "bg-yellow-200 text-yellow-700"
                    : priority === "Medium"
                    ? "bg-green-200 text-green-700"
                    : priority === "Low"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-200 text-gray-700"
            }`}
        >
            {priority}
        </div>
    );

    return (
        <div
            ref={(instance) => {
                drag(instance);
            }}
            className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
        >
            
            <div className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {workItem.priority && <PriorityTag priority={workItem.priority} />}
                        <div className="flex gap-2">
                            {workItemTagsSplit.map((tag) => (
                                <div
                                    key={tag}
                                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                                >
                                    {" "}
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button 
                        className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
                        onClick={() => setEditingWorkItem(workItem)}
                        >
                        <EllipsisVertical size={26} />
                    </button>
                </div>

                <div className="my-3 flex justify-between">
                    <h4 className="text-md font-bold dark:text-white">{workItem.workItemType}: {workItem.title}</h4>
                    {typeof workItem.percentComplete === "number" && (
                        <div className="whitespace-nowrap text-xs font-semibold dark:text-white">
                            {workItem.percentComplete}%
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-500 dark:text-neutral-500">
                    {formattedDateOpened && <span>{formattedDateOpened} (opened) - </span>}
                    {formattedDueDate && <span>{formattedDueDate} (due)</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-500">
                    Description: {workItem.description}
                </p>
                {workItem.workItemType === "Issue" && workItem.issueDetail && (
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                        {workItem.issueDetail.rootCause && (
                            <p>
                                <span>Root Cause:</span>{" "}
                                {workItem.issueDetail.rootCause}
                            </p>
                        )}
                        {workItem.issueDetail.correctiveAction && (
                            <p>
                                <span>Corrective Action:</span>{" "}
                                {workItem.issueDetail.correctiveAction}
                            </p>
                        )}
                    </div>
                )}
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                    {formattedEstimatedCompletionDate && <span>Estimated Completion Date: {formattedEstimatedCompletionDate}</span>}
                </div>
                {workItem.status === "Completed" && (
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                        <p>
                            <span>Actual Completion Date:</span>{" "}
                            {formattedActualCompletionDate}
                        </p>
                    </div>
                )}
                {workItem.status !== "Completed" && (
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Current Status: {workItem.inputStatus}
                    </p>
                )}
                {workItem.attachments && workItem.attachments.length > 0 && (
                // <Image
                //     src={`/${workItem.attachments[0].fileUrl}`}
                //     alt={workItem.attachments[0].fileName}
                //     width={400}
                //     height={200}
                //     className="h-auto w-full rounded-t-md"
                // />
                    <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-neutral-500">
                        <Link href={`/${workItem.attachments[0].fileUrl}`}>
                            {workItem.attachments[0].fileName}
                        </Link>
                    </div>
                )}
                <div className="mt-4 border-t border-gray-200 dark-border-stroke-dark" />

                {/* USERS */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-[6px] overflow-hidden">
                        {[workItem.assigneeUser, workItem.authorUser].map((user, index) => {
                            if (!user) return null;

                            const uniqueKey = `${user.userId}-${index}`;
                            const role = index === 0 ? "Assignee" : "Author"; // Determine role
                            const tooltip = `${role}: ${user.name}`;

                            return user.profilePictureUrl ? (
                                <Image
                                    key={uniqueKey}
                                    src={`/${user.profilePictureUrl}`}
                                    alt={user.username}
                                    title={tooltip}  // <-- tooltip on hover
                                    width={30}
                                    height={30}
                                    className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                />
                            ) : (
                                <div
                                    key={uniqueKey}
                                    title={tooltip}  // <-- tooltip on hover
                                    className="h-8 w-8 rounded-full border-2 border-white text-gray-400 dark:border-dark-secondary"
                                >
                                    <CircleUser size={24} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Comments */}
                    <div className="flex items-center text-gray-500 dark:text-neutral-500">
                        <MessageSquareMore size={20} />
                        <span className="ml-1 text-sm dark:text-neutral-400">
                            {numberOfComments}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default BoardView;