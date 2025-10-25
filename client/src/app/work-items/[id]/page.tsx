"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import Image from "next/image";
import { useGetWorkItemByIdQuery } from "@/state/api";
import { Status, Priority, DeliverableTypeLabels, IssueTypeLabels } from "@/state/api";
import { format } from "date-fns";
import ModalEditWorkItem from "@/components/ModalEditWorkItem";
import { SquarePen } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Status.Completed:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case Priority.High:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Priority.Low:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const WorkItemDetailPage = ({ params }: Props) => {
  const { id } = React.use(params);
  const workItemId = Number(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: workItem, isLoading, isError } = useGetWorkItemByIdQuery(workItemId);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div className="p-8">Loading work item...</div>;
  if (isError || !workItem) return <div className="p-8">Error loading work item or work item not found</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <ModalEditWorkItem
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        workItem={workItem}
      />

      {/* Header with Work Item Type and Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {workItem.workItemType}
            </span>
            <Header name={workItem.title} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {workItem.id}</p>
        </div>
        
        {/* Edit Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-dark-tertiary dark:text-white dark:hover:bg-gray-600"
        >
          <SquarePen className="mr-2 h-4 w-4" />
          Edit Work Item
        </button>
      </div>

      {/* Deliverable Details */}
      {workItem.deliverableDetail && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Deliverable Details</h3>
          
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Deliverable Type:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {DeliverableTypeLabels[workItem.deliverableDetail.deliverableType]}
            </p>
          </div>
        </div>
      )}

      {/* Issue Details */}
      {workItem.issueDetail && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Issue Details</h3>
          
          {/* Issue Type - only show if issue */}
          <div className="space-y-4">
          {workItem.issueDetail && (
                <div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Issue Type:</span>
                        <p className="text-gray-900 dark:text-gray-100 mt-1">
                            {IssueTypeLabels[workItem.issueDetail.issueType]}
                        </p>
                </div>
            )}

            {workItem.issueDetail.rootCause && (
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Root Cause:</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">
                  {workItem.issueDetail.rootCause}
                </p>
              </div>
            )}

            {workItem.issueDetail.correctiveAction && (
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Corrective Action:</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">
                  {workItem.issueDetail.correctiveAction}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {workItem.description && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
          <h3 className="mb-3 text-lg font-semibold dark:text-white">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{workItem.description}</p>
        </div>
      )}

      {/* Main Information */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">Work Item Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
            <div className="mt-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${getStatusColor(workItem.status)}`}>
                {workItem.status}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Priority:</span>
            <div className="mt-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${getPriorityColor(workItem.priority)}`}>
                {workItem.priority}
              </span>
            </div>
          </div>

          {/* Tags */}
          {workItem.tags && (
            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tags:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">{workItem.tags}</p>
            </div>
          )}

          {/* Date Opened */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Date Opened:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.dateOpened), "PPP")}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Due Date:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.dueDate), "PPP")}
            </p>
          </div>

          {/* Estimated Completion Date */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Estimated Completion Date:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.estimatedCompletionDate), "PPP")}
            </p>
          </div>

          {/* Actual Completion Date */}
          {workItem.actualCompletionDate && (
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Actual Completion Date:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                {format(new Date(workItem.actualCompletionDate), "PPP")}
              </p>
            </div>
          )}

          {/* Percent Complete */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Progress:</span>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${workItem.percentComplete}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{workItem.percentComplete}%</p>
            </div>
          </div>

          {/* Input Status */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Input Status:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">{workItem.inputStatus}</p>
          </div>
        </div>
      </div>

      {/* Program and Milestone */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">Program & Milestone</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Program:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {workItem.program?.name || "N/A"}
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Due By Milestone:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {workItem.dueByMilestone?.name || "N/A"}
            </p>
            {workItem.dueByMilestone && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(new Date(workItem.dueByMilestone.date), "PPP")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Author and Assignee */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">People</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Author:</span>
            <div className="flex items-center gap-3 mt-2">
              {workItem.authorUser?.profilePictureUrl ? (
                <Image
                  src={`/${workItem.authorUser.profilePictureUrl}`}
                  alt={workItem.authorUser.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                  {workItem.authorUser?.username?.substring(0, 2).toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="text-gray-900 dark:text-gray-100">
                  {workItem.authorUser?.name || workItem.authorUser?.username || "Unknown"}
                </p>
                {workItem.authorUser?.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{workItem.authorUser.email}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Assignee:</span>
            <div className="flex items-center gap-3 mt-2">
              {workItem.assigneeUser?.profilePictureUrl ? (
                <Image
                  src={`/${workItem.assigneeUser.profilePictureUrl}`}
                  alt={workItem.assigneeUser.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                  {workItem.assigneeUser?.username?.substring(0, 2).toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="text-gray-900 dark:text-gray-100">
                  {workItem.assigneeUser?.name || workItem.assigneeUser?.username || "Unassigned"}
                </p>
                {workItem.assigneeUser?.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{workItem.assigneeUser.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part Numbers */}
      {workItem.partNumbers && workItem.partNumbers.length > 0 && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Associated Part Numbers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workItem.partNumbers.map((link) => (
              <div key={link.id} className="rounded border p-4">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {link.partNumber?.partName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Part #{link.partNumber?.number} - Level {link.partNumber?.level}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkItemDetailPage;
