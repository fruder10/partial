import { WorkItem, StatusLabels, DeliverableTypeLabels, IssueTypeLabels } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  workItem: WorkItem;
};

const WorkItemCard = ({ workItem }: Props) => {
  return (
    <div className="rounded border p-4 shadow">
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{workItem.title}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {workItem.workItemType}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">ID: {workItem.id}</p>
      </div>

      {/* Description */}
      {workItem.description && (
        <div className="mb-3 rounded bg-gray-50 p-3">
          <p className="text-sm">{workItem.description}</p>
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Status:</span> {StatusLabels[workItem.status]}
          </div>
          <div>
            <span className="font-medium">Priority:</span> {workItem.priority}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Date Opened:</span> {format(new Date(workItem.dateOpened), "P")}
          </div>
          <div>
            <span className="font-medium">Due Date:</span> {format(new Date(workItem.dueDate), "P")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Est. Completion:</span> {format(new Date(workItem.estimatedCompletionDate), "P")}
          </div>
          {workItem.actualCompletionDate && (
            <div>
              <span className="font-medium">Actual Completion:</span> {format(new Date(workItem.actualCompletionDate), "P")}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Progress:</span> {workItem.percentComplete}%
          </div>
          <div>
            <span className="font-medium">Input Status:</span> {workItem.inputStatus}
          </div>
        </div>

        {workItem.tags && (
          <div>
            <span className="font-medium">Tags:</span> {workItem.tags}
          </div>
        )}

        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Program:</span> {workItem.program?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Milestone:</span> {workItem.dueByMilestone?.name || "N/A"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Author:</span> {workItem.authorUser?.name || workItem.authorUser?.username || "Unknown"}
          </div>
          <div>
            <span className="font-medium">Assignee:</span> {workItem.assigneeUser?.name || workItem.assigneeUser?.username || "Unassigned"}
          </div>
        </div>

        {/* Type-specific details */}
        {workItem.issueDetail && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1">Issue Details:</p>
            <div className="ml-3 space-y-1 text-xs">
              <div>
                <span className="font-medium">Type:</span> {IssueTypeLabels[workItem.issueDetail.issueType]}
              </div>
              {workItem.issueDetail.rootCause && (
                <div>
                  <span className="font-medium">Root Cause:</span> {workItem.issueDetail.rootCause}
                </div>
              )}
              {workItem.issueDetail.correctiveAction && (
                <div>
                  <span className="font-medium">Corrective Action:</span> {workItem.issueDetail.correctiveAction}
                </div>
              )}
            </div>
          </div>
        )}

        {workItem.deliverableDetail && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1">Deliverable Details:</p>
            <div className="ml-3 text-xs">
              <span className="font-medium">Type:</span> {DeliverableTypeLabels[workItem.deliverableDetail.deliverableType]}
            </div>
          </div>
        )}

        {/* Related items */}
        <div className="border-t pt-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {workItem.partNumbers && workItem.partNumbers.length > 0 && (
              <div>
                <span className="font-medium">Part Numbers:</span> {workItem.partNumbers.length}
              </div>
            )}
            {workItem.attachments && workItem.attachments.length > 0 && (
              <div>
                <span className="font-medium">Attachments:</span> {workItem.attachments.length}
              </div>
            )}
            {workItem.comments && workItem.comments.length > 0 && (
              <div>
                <span className="font-medium">Comments:</span> {workItem.comments.length}
              </div>
            )}
          </div>
        </div>

        {/* Attachments preview */}
        {workItem.attachments && workItem.attachments.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-2 text-xs">Attachment Preview:</p>
            <div className="flex gap-2">
              {workItem.attachments.slice(0, 3).map((attachment) => (
                <div key={attachment.id} className="relative h-20 w-20 overflow-hidden rounded-md border">
                  <Image
                    src={`/${attachment.fileUrl}`}
                    alt={attachment.fileName}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkItemCard;