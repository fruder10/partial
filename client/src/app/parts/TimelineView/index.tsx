import { useAppSelector } from '@/app/redux';
import { useGetWorkItemsByPartNumberQuery } from '@/state/api';
import {
  DisplayOption,
  Gantt,
  Task,
  ViewMode
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react';

type Props = {
  id: string;
  setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
};

const Timeline = ({ id, setIsModalNewWorkItemOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: workItems, error, isLoading } =
    useGetWorkItemsByPartNumberQuery({ partNumberId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  });

  // ✅ Ensure ganttTasks matches the Task[] interface from gantt-task-react
  const ganttTasks: Task[] = useMemo(() => {
    return (
      workItems?.map((workItem) => ({
        start: new Date(workItem.dateOpened as string),
        end: new Date(workItem.dueDate as string),
        name: workItem.title,
        id: `${workItem.workItemType}-${workItem.id}`,
        type: "task", // must be "task" | "milestone" | "project"
        progress: workItem.percentComplete ?? 0,
        isDisabled: false
      })) || []
    );
  }, [workItems]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !workItems) return <div>An error occurred while fetching work items</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Work Item Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline clock w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks} // ✅ correct prop name
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="200px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewWorkItemOpen(true)}
          >
            Add New Work Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
