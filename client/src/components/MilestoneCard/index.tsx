import { Milestone, StatusLabels } from "@/state/api";
import React from "react";

type Props = {
  milestone: Milestone;
};

const MilestoneCard = ({ milestone }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateBadgeColor = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return "bg-red-100 text-red-800";
    } else if (daysDiff <= 7) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="rounded border p-4 shadow">
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{milestone.name}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getDateBadgeColor(milestone.date)}`}>
            {formatDate(milestone.date)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">ID: {milestone.id}</p>
      </div>

      {/* Description */}
      {milestone.description && (
        <div className="mb-3 rounded bg-gray-50 p-3">
          <p className="text-sm">{milestone.description}</p>
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-2 text-sm">
        <div className="border-t pt-2">
          <span className="font-medium">Program:</span> {milestone.program?.name || "N/A"}
        </div>

        {/* Work Items */}
        {milestone.workItems && milestone.workItems.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-2">Work Items ({milestone.workItems.length}):</p>
            <div className="space-y-2">
              {milestone.workItems.map((workItem) => (
                <div key={workItem.id} className="rounded bg-gray-50 p-2 text-xs">
                  <div className="font-medium">{workItem.title}</div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-gray-600">
                    <span>Status: {StatusLabels[workItem.status]}</span>
                    <span>Priority: {workItem.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!milestone.workItems || milestone.workItems.length === 0) && (
          <div className="border-t pt-2 text-xs text-gray-500">
            No work items assigned to this milestone
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;

