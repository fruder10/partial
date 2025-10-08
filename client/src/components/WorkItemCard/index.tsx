import { WorkItem } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  workItem: WorkItem;
};

const WorkItemCard = ({ workItem }: Props) => {
  return (
    <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      {workItem.attachments && workItem.attachments.length > 0 && (
        <div>
          <strong>Attachments:</strong>
          <div className="flex flex-wrap">
            {workItem.attachments && workItem.attachments.length > 0 && (
              <Image
                src={`/${workItem.attachments[0].fileUrl}`}
                alt={workItem.attachments[0].fileName}
                width={400}
                height={200}
                className="rounded-md"
              />
            )}
          </div>
        </div>
      )}
      <p>
        <strong>ID:</strong> {workItem.id}
      </p>
      <p>
        <strong>Title:</strong> {workItem.title}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {workItem.description || "No description provided"}
      </p>
      <p>
        <strong>Status:</strong> {workItem.status}
      </p>
      <p>
        <strong>Priority:</strong> {workItem.priority}
      </p>
      <p>
        <strong>Tags:</strong> {workItem.tags || "No tags"}
      </p>
      <p>
        <strong>Start Date:</strong>{" "}
        {workItem.dateOpened ? format(new Date(workItem.dateOpened), "P") : "Not set"}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {workItem.dueDate ? format(new Date(workItem.dueDate), "P") : "Not set"}
      </p>
      <p>
        <strong>Author:</strong>{" "}
        {workItem.authorUser ? workItem.authorUser.username : "Unknown"}
      </p>
      <p>
        <strong>Assignee:</strong>{" "}
        {workItem.assigneeUser ? workItem.assigneeUser.username : "Unassigned"}
      </p>
    </div>
  );
};

export default WorkItemCard;