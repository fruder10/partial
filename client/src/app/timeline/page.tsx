"use client"

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetProgramsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import React, { useMemo, useState } from 'react';

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: programs, isLoading, isError } = useGetProgramsQuery();

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US"
    });

    const ganttTasks = useMemo(() => {
        return (
            programs?.map((program) => ({
                start: new Date(program.startDate as string),
                end: new Date(program.endDate as string),
                name: program.name,
                id: `Program-${program.id}`,
                type: "program" as TaskTypeItems,
                progress: 50,
                isDisabled: false
            })) || []
        )
    }, [programs]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    if (isLoading) return <div>Loading...</div>
    if (isError || !programs) return <div>An error occured while fetching programs</div>;

    return (
        <div className="max-w-full p-8">
            <header className="mb-4 flex items-center justify-between">
                <Header name="Programs Timeline" />
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
            </header>

            <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
                <div className="timeline">
                    <Gantt
                        tasks={ganttTasks}
                        {...displayOptions}
                        columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                        listCellWidth="200px"
                        projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                        projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                        projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                    />
                </div>
            </div>
        </div>
    )
};

export default Timeline;