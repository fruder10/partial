import { Program } from "@/state/api";
import React from "react";

type Props = {
  program: Program;
};

const ProgramCard = ({ program }: Props) => {
  return (
    <div className="rounded border p-4 shadow">
      <h3>{program.name}</h3>
      <p>{program.description}</p>
      <p>Start Date: {program.startDate}</p>
      <p>End Date: {program.endDate}</p>
    </div>
  );
};

export default ProgramCard;