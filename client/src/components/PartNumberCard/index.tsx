import { PartNumber, PartStateLabels } from "@/state/api";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  partNumber: PartNumber;
};

const PartNumberCard = ({ partNumber }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/parts/${partNumber.id}`);
  };

  return (
    <div 
      className="rounded border p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{partNumber.partName}</h3>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
            Level {partNumber.level}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">Part Number: {partNumber.number}</p>
      </div>

      {/* Main Details */}
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">State:</span> {PartStateLabels[partNumber.state]}
          </div>
          <div>
            <span className="font-medium">Revision:</span> {partNumber.revisionLevel}
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Program:</span> {partNumber.program?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Assigned To:</span> {partNumber.assignedUser?.name || partNumber.assignedUser?.username || "Unassigned"}
            </div>
          </div>
        </div>

        {partNumber.parent && (
          <div className="border-t pt-2">
            <span className="font-medium">Parent Part:</span> {partNumber.parent.partName} (ID: {partNumber.parent.id})
          </div>
        )}

        {/* Related items */}
        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {partNumber.children && partNumber.children.length > 0 && (
              <div>
                <span className="font-medium">Child Parts:</span> {partNumber.children.length}
              </div>
            )}
            {partNumber.workItemLinks && partNumber.workItemLinks.length > 0 && (
              <div>
                <span className="font-medium">Work Items:</span> {partNumber.workItemLinks.length}
              </div>
            )}
          </div>
        </div>

        {/* Children List */}
        {partNumber.children && partNumber.children.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1 text-xs">Child Parts:</p>
            <div className="ml-3 space-y-1 text-xs">
              {partNumber.children.map((child) => (
                <div key={child.id} className="text-gray-600">
                  • {child.partName} (Level {child.level})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartNumberCard;

