"use client";

import Modal from '@/components/Modal';
import {
  Priority,
  Status,
  WorkItemType,
  DeliverableType,
  DeliverableTypeLabels,
  IssueType,
  IssueTypeLabels,
  useEditWorkItemMutation,
  useDeleteWorkItemMutation,
  WorkItem as WorkItemTypeModel
} from '@/state/api';
import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workItem: WorkItemTypeModel | null;
};

const ModalEditWorkItem = ({ isOpen, onClose, workItem }: Props) => {
  const [editWorkItem, { isLoading: isSaving }] = useEditWorkItemMutation();
  const [deleteWorkItem, { isLoading: isDeleting }] = useDeleteWorkItemMutation();

  // form state
  const [workItemType, setWorkItemType] = useState<WorkItemType | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [tags, setTags] = useState("");
  const [dateOpened, setDateOpened] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [actualCompletionDate, setActualCompletionDate] = useState("");
  const [percentComplete, setPercentComplete] = useState<number>(0);
  const [inputStatus, setInputStatus] = useState("");
  const [programId, setProgramId] = useState("");
  const [dueByMilestoneId, setDueByMilestoneId] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [deliverableType, setDeliverableType] = useState<DeliverableType | "">("");

  // Prefill all fields when modal opens
  useEffect(() => {
    if (workItem) {
      setWorkItemType(workItem.workItemType || "");
      setTitle(workItem.title || "");
      setDescription(workItem.description || "");
      setStatus(workItem.status || "");
      setPriority(workItem.priority || "");
      setTags(workItem.tags || "");
      setDateOpened(workItem.dateOpened ? workItem.dateOpened.split("T")[0] : "");
      setDueDate(workItem.dueDate ? workItem.dueDate.split("T")[0] : "");
      setEstimatedCompletionDate(
        workItem.estimatedCompletionDate ? workItem.estimatedCompletionDate.split("T")[0] : ""
      );
      setActualCompletionDate(
        workItem.actualCompletionDate ? workItem.actualCompletionDate.split("T")[0] : ""
      );
      setPercentComplete(workItem.percentComplete || 0);
      setInputStatus(workItem.inputStatus || "");
      setProgramId(workItem.programId?.toString() || "");
      setDueByMilestoneId(workItem.dueByMilestoneId?.toString() || "");
      setAuthorUserId(workItem.authorUserId?.toString() || "");
      setAssignedUserId(workItem.assignedUserId?.toString() || "");

      if (workItem.workItemType === WorkItemType.Issue && workItem.issueDetail) {
        setIssueType(workItem.issueDetail.issueType || "");
        setRootCause(workItem.issueDetail.rootCause || "");
        setCorrectiveAction(workItem.issueDetail.correctiveAction || "");
      } else if (workItem.workItemType === WorkItemType.Deliverable && workItem.deliverableDetail) {
        setDeliverableType(workItem.deliverableDetail.deliverableType || "");
      }
    }
  }, [workItem]);

  const isFormValid = (): boolean =>
    !!workItemType &&
    !!title &&
    !!description &&
    !!status &&
    !!priority &&
    !!dateOpened &&
    !!dueDate &&
    !!estimatedCompletionDate &&
    percentComplete >= 0 &&
    !!inputStatus &&
    !!programId &&
    !!dueByMilestoneId &&
    !!authorUserId &&
    !!assignedUserId;

  const handleSubmit = async () => {
    if (!workItem || !isFormValid()) return;

    const updatedWorkItem: WorkItemTypeModel = {
      ...workItem,
      workItemType: workItemType as WorkItemType,
      status: status as Status,
      priority: priority as Priority,
      title,
      description,
      tags,
      dateOpened: formatISO(new Date(dateOpened), { representation: 'complete' }),
      dueDate: formatISO(new Date(dueDate), { representation: 'complete' }),
      estimatedCompletionDate: formatISO(new Date(estimatedCompletionDate), { representation: 'complete' }),
      actualCompletionDate: actualCompletionDate
        ? formatISO(new Date(actualCompletionDate), { representation: 'complete' })
        : undefined,
      percentComplete,
      inputStatus,
      programId: parseInt(programId),
      dueByMilestoneId: parseInt(dueByMilestoneId),
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      issueDetail: workItemType === WorkItemType.Issue
        ? {
            id: workItem.issueDetail?.id ?? 0,
            issueType: issueType as IssueType,
            rootCause,
            correctiveAction,
          }
        : undefined,
      deliverableDetail: workItemType === WorkItemType.Deliverable
        ? {
            id: workItem.deliverableDetail?.id ?? 0,
            deliverableType: deliverableType as DeliverableType,
          }
        : undefined,
    };

    try {
        await editWorkItem({
            workItemId: workItem.id,
            updates: updatedWorkItem,
        }).unwrap();
        onClose(); // close modal on success
    } catch (err) {
        console.error("Failed to save work item:", err);
    }
  };

  const handleDelete = async () => {
    if (!workItem) return;

    const confirmed = window.confirm(
        `Are you sure you want to delete "${workItem.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
        await deleteWorkItem(workItem.id).unwrap();
        onClose(); // close modal on success
    } catch (err) {
        console.error("Failed to delete work item:", err);
    }
  };


  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${workItem?.workItemType ?? "Work Item"}`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Work Item Type */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Work Item Type:
            </label>
            <select
            className={selectStyles}
            value={workItemType}
            onChange={(e) =>
                setWorkItemType(
                e.target.value ? (WorkItemType[e.target.value as keyof typeof WorkItemType]) : ""
                )
            }
            >
            <option value="">Select Work Item Type</option>
            {Object.values(WorkItemType).map((type) => (
                <option key={type} value={type}>{type}</option>
            ))}
            </select>
        </div>

        {/* Conditional fields for Issue or Deliverable */}
        {workItemType === WorkItemType.Issue && (
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Issue Type:
            </label>
            <select
                className={selectStyles}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
            >
                <option value="">Select Issue Type</option>
                {Object.values(IssueType).map((key) => (
                <option key={key} value={key}>
                    {IssueTypeLabels[key]}
                </option>
                ))}
            </select>
          </div>
        )}

        {workItemType === WorkItemType.Deliverable && (
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Deliverable Type:
            </label>
            <select
                className={selectStyles}
                value={deliverableType}
                onChange={(e) => setDeliverableType(e.target.value as DeliverableType)}
            >
                <option value="">Select Deliverable Type</option>
                {Object.values(DeliverableType).map((key) => (
                <option key={key} value={key}>
                    {DeliverableTypeLabels[key]}
                </option>
                ))}
            </select>
          </div>
        )}

        {/* Common Fields */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Title:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

        {workItemType === WorkItemType.Issue && (
          <>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300">
                    Root Cause:
                </label>
                <textarea
                    className={inputStyles}
                    placeholder="Root Cause"
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300">
                    Corrective Action:
                </label>
                <textarea
                    className={inputStyles}
                    placeholder="Corrective Action"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                />
            </div>
          </>
        )}

        {/* Status & Priority */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Status:
            </label>
            <select
                className={selectStyles}
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
            >
                <option value="">Select Status</option>
                {Object.values(Status).map((s) => (
                <option key={s} value={s}>{s}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Priority:
            </label>
            <select
                className={selectStyles}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
            >
                <option value="">Select Priority</option>
                {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Tags:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Date Opened:
            </label>
            <input type="date" className={inputStyles} value={dateOpened} onChange={(e) => setDateOpened(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Due Date:
            </label>
            <input type="date" className={inputStyles} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Estimated Completion:
            </label>
            <input type="date" className={inputStyles} value={estimatedCompletionDate} onChange={(e) => setEstimatedCompletionDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Actual Completion:
            </label>
            <input type="date" className={inputStyles} value={actualCompletionDate} onChange={(e) => setActualCompletionDate(e.target.value)} />
          </div>
        </div>

        {/* Percent Complete */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Percent Complete:
            </label>
            <input
            type="number"
            className={inputStyles}
            placeholder="Percent Complete"
            value={percentComplete}
            onChange={(e) => setPercentComplete(Number(e.target.value))}
            min={0}
            max={100}
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Current Status:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Current Status"
            value={inputStatus}
            onChange={(e) => setInputStatus(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Program:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Program Id"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Milestone:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Due By Milestone Id"
            value={dueByMilestoneId}
            onChange={(e) => setDueByMilestoneId(e.target.value)}
            />
        </div>
        
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Author:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Author User ID"
            value={authorUserId}
            onChange={(e) => setAuthorUserId(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Assignee:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Assigned User ID"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? `Updating ${workItemType}...` : `Update ${workItemType}`}
        </button>
        <button
            type="button"
            onClick={handleDelete}
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isDeleting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isDeleting}
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditWorkItem;
