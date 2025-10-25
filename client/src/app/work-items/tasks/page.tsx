"use client";

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import ModalNewWorkItem from '@/components/ModalNewWorkItem';
import BurndownChart from '@/components/BurndownChart';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { WorkItem, WorkItemType, Priority, Status, useGetWorkItemsByUserQuery, useGetTeamsQuery, useGetUsersQuery, useGetProgramsQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { PlusSquare } from 'lucide-react';

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800";
    case Status.Completed:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800";
    case Priority.High:
      return "bg-orange-100 text-orange-800";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800";
    case Priority.Low:
      return "bg-green-100 text-green-800";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const workItemColumns: GridColDef<WorkItem>[] = [
  { 
    field: "workItemType", 
    headerName: "Type", 
    width: 120,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
        {params.value}
      </span>
    ),
  },
  { 
    field: "title", 
    headerName: "Title", 
    minWidth: 200,
    flex: 1,
  },
  { 
    field: "status", 
    headerName: "Status", 
    width: 140,
    renderCell: (params) => (
      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(params.value)}`}>
        {params.value}
      </span>
    ),
  },
  { 
    field: "priority", 
    headerName: "Priority", 
    width: 110,
    renderCell: (params) => (
      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(params.value)}`}>
        {params.value}
      </span>
    ),
  },
  { 
    field: "dueDate", 
    headerName: "Due Date",
    width: 120,
    renderCell: (params) => {
      const dateStr = formatDate(params.value);
      const isPastDue = params.value && new Date(params.value) < new Date();
      const isNotCompleted = params.row.status !== Status.Completed;
      const shouldHighlight = isPastDue && isNotCompleted;
      
      return (
        <span className={shouldHighlight ? "text-red-600 font-semibold" : ""}>
          {dateStr}
        </span>
      );
    },
  },
  { 
    field: "estimatedCompletionDate",
    headerName: "ECD",
    width: 130,
    renderCell: (params) => {
      const dateStr = formatDate(params.value);
      const isPastDue = params.value && new Date(params.value) < new Date();
      const isNotCompleted = params.row.status !== Status.Completed;
      const shouldHighlight = isPastDue && isNotCompleted;
      
      return (
        <span className={shouldHighlight ? "text-red-600 font-semibold" : ""}>
          {dateStr}
        </span>
      );
    },
  },
  { 
    field: "percentComplete", 
    headerName: "% Complete", 
    width: 110,
    renderCell: (params) => (
      <span className="font-medium">{params.value ?? 0}%</span>
    ),
  },
  { 
    field: "inputStatus", 
    headerName: "Input Status", 
    width: 200,
    renderCell: (params) => params.value || "N/A",
  },
  { 
    field: "assigneeUserName", 
    headerName: "Assignee", 
    width: 150,
    renderCell: (params) => params.value || "Unassigned",
  },
];

const TasksPage = () => {
    const [ isModalNewWorkItemOpen, setIsModalNewWorkItemOpen ] = useState(false);
    const [ selectedPriority, setSelectedPriority ] = useState<Priority | "all">("all");
    const [ workItemFilter, setWorkItemFilter ] = useState<"all" | "open">("all");
    const [ selectedTeamId, setSelectedTeamId ] = useState<number | "all">("all");
    const [ selectedProgramId, setSelectedProgramId ] = useState<number | "all">("all");
    
    const userId = 12; // HARDCODED BEFORE WE HAVE USER AUTHENTICATION COGNITO BUILT IN
    const { data: workItems, isLoading, isError: isTasksError } = useGetWorkItemsByUserQuery(userId || 0, {
        skip: userId === null
    });
    const { data: teams } = useGetTeamsQuery();
    const { data: users } = useGetUsersQuery();
    const { data: programs } = useGetProgramsQuery();

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // First filter by work item type, then apply program filter, then team filter, then status filter
    const typeFilteredWorkItems = workItems?.filter((workItem: WorkItem) => workItem.workItemType === WorkItemType.Task);
    
    // Apply program filtering
    const programFilteredWorkItems = selectedProgramId === "all"
        ? typeFilteredWorkItems
        : typeFilteredWorkItems?.filter((item) => item.programId === selectedProgramId);
    
    // Apply team filtering
    const teamFilteredWorkItems = selectedTeamId === "all" 
        ? programFilteredWorkItems
        : programFilteredWorkItems?.filter((item) => {
            const assignee = users?.find((u) => u.userId === item.assignedUserId);
            return assignee?.disciplineTeamId === selectedTeamId;
        });
    
    const filteredWorkItems = workItemFilter === "open"
        ? teamFilteredWorkItems?.filter((item) => item.status !== Status.Completed)
        : teamFilteredWorkItems;

    if (isTasksError || !workItems) return <div>Error fetching work items.</div>

    // Priority filtering for the table
    const filteredWorkItemsByPriority =
        selectedPriority === "all"
          ? filteredWorkItems
          : filteredWorkItems?.filter((item) => item.priority === selectedPriority);
    
    const displayedWorkItems = [...(filteredWorkItemsByPriority || [])]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .map((item) => ({
            ...item,
            assigneeUserName: item.assigneeUser?.name || "Unassigned",
        }));

    // Priority counts for dropdown
    const priorityCounts = filteredWorkItems?.reduce(
        (acc: Record<string, number>, item: WorkItem) => {
            acc[item.priority] = (acc[item.priority] || 0) + 1;
            return acc;
        },
        {}
    ) || {};

    const totalCount = filteredWorkItems?.length || 0;

    return (
        <div className="m-5 p-4">
            <ModalNewWorkItem isOpen={isModalNewWorkItemOpen} onClose={() => setIsModalNewWorkItemOpen(false)} />
            <Header
                name="Tasks"
                buttonComponent={
                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors"
                            onClick={() => setIsModalNewWorkItemOpen(true)}>
                                <PlusSquare className="mr-2 h-5 w-5" />
                                Add Task
                        </button>
                        
                        {/* Work Item Status Toggle */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-dark-tertiary">
                                <button
                                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                                        workItemFilter === "all"
                                            ? "rounded-md bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                    onClick={() => setWorkItemFilter("all")}
                                >
                                    All Tasks
                                </button>
                                <button
                                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                                        workItemFilter === "open"
                                            ? "rounded-md bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                    onClick={() => setWorkItemFilter("open")}
                                >
                                    Open Tasks
                                </button>
                            </div>
                        </div>
                    </div>
                }
            />
            
            {/* Filter Dropdowns */}
            <div className="mb-6 flex items-center gap-4 flex-wrap">
                {/* Program Selector */}
                <select
                    id="program-select"
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white"
                    value={selectedProgramId}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProgramId(value === "all" ? "all" : parseInt(value));
                    }}
                >
                    <option value="all">All Programs</option>
                    {programs?.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
                
                {/* Team Selector */}
                <select
                    id="team-select"
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white"
                    value={selectedTeamId}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedTeamId(value === "all" ? "all" : parseInt(value));
                    }}
                >
                    <option value="all">All Teams</option>
                    {teams?.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Priority Work Items Table */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold dark:text-white">
                        {selectedPriority === "all"
                            ? "All Tasks"
                            : `${selectedPriority} Priority Tasks`}
                    </h3>
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value as Priority | "all")}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
                    >
                        <option value="all">All Priorities ({totalCount})</option>
                        {Object.values(Priority).map((priority) => (
                            <option key={priority} value={priority}>
                                {priority} ({priorityCounts[priority] ?? 0})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={displayedWorkItems}
                        columns={workItemColumns}
                        loading={isLoading}
                        getRowClassName={() => "data-grid-row"}
                        getCellClassName={() => "data-grid-cell"}
                        className={dataGridClassNames}
                        showToolbar
                        sx={dataGridSxStyles(isDarkMode)}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "dueDate", sort: "asc" }],
                            },
                        }}
                    />
                </div>
            </div>

            {/* Burndown Chart */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                <h3 className="mb-4 text-lg font-semibold dark:text-white">
                    Tasks Burndown Chart
                </h3>
                <BurndownChart workItems={programFilteredWorkItems || []} isDarkMode={isDarkMode} />
            </div>

        </div>
    )
};

export default TasksPage;
