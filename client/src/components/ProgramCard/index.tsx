import { Program, useGetUsersQuery } from "@/state/api";
import React from "react";

type Props = {
  program: Program;
};

const ProgramCard = ({ program }: Props) => {
  const { data: users } = useGetUsersQuery();
  const programManager = users?.find((u) => u.userId === program.programManagerUserId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded border p-4 shadow">
      {/* Header Section */}
      <div className="mb-3">
        <h3 className="font-semibold text-lg">{program.name}</h3>
        <p className="mt-1 text-sm text-gray-600">ID: {program.id}</p>
      </div>

      {/* Description */}
      {program.description && (
        <div className="mb-3 rounded bg-gray-50 p-3">
          <p className="text-sm">{program.description}</p>
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Start Date:</span> {formatDate(program.startDate)}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {formatDate(program.endDate)}
          </div>
        </div>

        <div className="border-t pt-2">
          <span className="font-medium">Program Manager:</span> {programManager?.name || "N/A"}
        </div>

        {/* Related items */}
        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {program.partNumbers && program.partNumbers.length > 0 && (
              <div>
                <span className="font-medium">Part Numbers:</span> {program.partNumbers.length}
              </div>
            )}
            {program.disciplineTeams && program.disciplineTeams.length > 0 && (
              <div>
                <span className="font-medium">Discipline Teams:</span> {program.disciplineTeams.length}
              </div>
            )}
            {program.milestones && program.milestones.length > 0 && (
              <div>
                <span className="font-medium">Milestones:</span> {program.milestones.length}
              </div>
            )}
            {program.workItems && program.workItems.length > 0 && (
              <div>
                <span className="font-medium">Work Items:</span> {program.workItems.length}
              </div>
            )}
          </div>
        </div>

        {/* Discipline Teams List */}
        {program.disciplineTeams && program.disciplineTeams.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1 text-xs">Discipline Teams:</p>
            <div className="ml-3 space-y-1 text-xs">
              {program.disciplineTeams.map((teamLink) => (
                <div key={teamLink.id} className="text-gray-600">
                  • {teamLink.disciplineTeam.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones List */}
        {program.milestones && program.milestones.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1 text-xs">Milestones:</p>
            <div className="ml-3 space-y-1 text-xs">
              {program.milestones.map((milestone) => (
                <div key={milestone.id} className="text-gray-600">
                  • {milestone.name} - {formatDate(milestone.date)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;