"use client";

import React, { useState } from "react";
import {
  Priority,
  Program,
  WorkItem,
  WorkItemType,
  useGetProgramsQuery,
  useGetWorkItemsQuery,
  useGetWorkItemsByProgramQuery,
  useGetTeamsQuery,
  useGetMilestonesQuery,
  useGetMilestonesByProgramQuery,
} from "@/state/api";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import BurndownChart from "@/components/BurndownChart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { format } from "date-fns";

const workItemColumns: GridColDef<WorkItem>[] = [
  { field: "workItemType", headerName: "Type", width: 100 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "priority", headerName: "Priority", width: 75 },
  { field: "dueDate", 
    headerName: "Due Date",
    width: 100,
    renderCell: (params) => {
      if (!params.value) return "";
      const date = new Date(params.value);
      const formatted = format(date, "MMM d, yyyy");
      const isOverdue = date < new Date();
      return (
        <span style={{ color: isOverdue ? "red" : "inherit" }}>
          {formatted}
        </span>
      );
    },
   },
  { field: "estimatedCompletionDate",
    headerName: "ECD",
    width: 100,
    renderCell: (params) => {
      if (!params.value) return "";
      const date = new Date(params.value);
      const formatted = format(date, "MMM d, yyyy");
      const isOverdue = date < new Date();
      return (
        <span style={{ color: isOverdue ? "red" : "inherit" }}>
          {formatted}
        </span>
      );
    },
  },
  { field: "percentComplete", headerName: "Percent Complete", width: 120 },
  { field: "inputStatus", headerName: "Current Status", width: 300 },
  { field: "assigneeUserName", headerName: "Assignee", width: 150 },
];

const COLORS = ["#6FA8DC", "#66CDAA", "#FF9500", "#FF8042", "#A28FD0", "#FF6384", "#36A2EB"];

const HomePage = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<number | "all">("all");
  const [chartMode, setChartMode] = useState<"type" | "priority">("type");

  const { data: programs, isLoading: isProgramsLoading } = useGetProgramsQuery();
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();

  const [selectedWorkItemType, setSelectedWorkItemType] = useState<WorkItemType | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">(Priority.Urgent);
  const [workItemFilter, setWorkItemFilter] = useState<"all" | "open">("all");


  // Conditionally choose which work item query to use
  const {
    data: workItems,
    isLoading: isWorkItemsLoading,
    isError: workItemsError,
  } =
    selectedProgramId === "all"
      ? useGetWorkItemsQuery()
      : useGetWorkItemsByProgramQuery({ programId: selectedProgramId });
  
  const {
    data: milestones,
    isLoading: milestonesLoading,
    isError: milestonesError
  } = 
    selectedProgramId === "all"
      ? useGetMilestonesQuery()
      : useGetMilestonesByProgramQuery({ programId: selectedProgramId });

  const displayedMilestones =
  selectedProgramId === "all"
    ? milestones
    : milestones?.filter((m) => m.programId === selectedProgramId);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isWorkItemsLoading || isProgramsLoading || isTeamsLoading)
    return <div>Loading...</div>;
  if (workItemsError || !workItems || !programs || !teams)
    return <div>Error fetching data</div>;

  /* ---------- DATA TRANSFORMS ---------- */

  // First, apply the work item filter (all vs open) to all data
  const filteredWorkItems = workItemFilter === "open"
    ? workItems.filter((item) => item.status !== "Completed")
    : workItems;

  // 1️⃣ Work Items by Discipline Team
  const teamCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    const team = teams.find((t) => t.id === item.assigneeUser?.disciplineTeamId);
    const teamName = team?.name || "Unassigned";
    acc[teamName] = (acc[teamName] || 0) + 1;
    return acc;
  }, {});
  const teamDistribution = Object.entries(teamCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // 2️⃣ Pie chart data: Type vs Priority
  const priorityCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});
  const priorityDistribution = Object.entries(priorityCount).map(([name, count]) => ({ name, count }));

  const typeCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    acc[item.workItemType] = (acc[item.workItemType] || 0) + 1;
    return acc;
  }, {});
  const typeDistribution = Object.entries(typeCount).map(([name, count]) => ({ name, count }));

  const pieData = chartMode === "type" ? typeDistribution : priorityDistribution;

  // 3️⃣ Priority Work Items for the DataGrid (Urgent is default)
  const filteredWorkItemsByPriority =
    selectedPriority === "all"
      ? filteredWorkItems
      : filteredWorkItems.filter((item) => item.priority === selectedPriority);
  
  const displayedWorkItems = [...filteredWorkItemsByPriority]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((item) => ({
      ...item,
      assigneeUserName: item.assigneeUser?.name || "Unassigned",
    }));

  // Work Items filtered by Type (for Burndown Chart - uses all work items, not filtered by status):
  const filteredWorkItemsForChart = 
  selectedWorkItemType === "all"
    ? workItems
    : workItems.filter((item) => item.workItemType === selectedWorkItemType);

  const formattedTeamName = (name: string) => 
    name.length > 10 ? name.slice(0, 10) + "…" : name;

  // 📊 Priority counts for datagrid dropdown
  const priorityCounts = filteredWorkItems.reduce(
    (acc: Record<string, number>, item: WorkItem) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCount = filteredWorkItems.length;


  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Program Management Dashboard" />

      {/* ---- Program Selector and Work Item Filter ---- */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
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
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Item Status Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-dark-tertiary">
            <button
              onClick={() => setWorkItemFilter("all")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                workItemFilter === "all"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              All Work Items
            </button>
            <button
              onClick={() => setWorkItemFilter("open")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                workItemFilter === "open"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Open Work Items
            </button>
          </div>
        </div>
      </div>

      {/* ---- Charts and Table ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ---- Bar Chart and Pie Chart sit on first row ---- */}
        <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4">
          {/* ---- Bar Chart: Work Items by Discipline Team ---- */}
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Work Items by Discipline Team
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
                <XAxis 
                  dataKey="name"
                  tickFormatter={formattedTeamName}
                  stroke={chartColors.text}
                  interval={0}
                />
                <YAxis stroke={chartColors.text} />
                <Tooltip />
                <Bar dataKey="count" fill={chartColors.bar}>
                  {teamDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ---- Pie Chart: Type vs Priority ---- */}
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">
                Work Item Distribution (By Type / By Priority)
              </h3>
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value as "type" | "priority")}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
              >
                <option value="type">By Type</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="count" data={pieData} fill={chartColors.pieFill} label>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🧩 Milestones Section */}
        <div className="col-span-3 md:col-span-1 md:row-span-2">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:max-h-[940px] max-h-[50vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Program Milestones
            </h2>

            {milestonesLoading ? (
              <p className="text-gray-500 dark:text-gray-300">Loading milestones...</p>
            ) : milestonesError ? (
              <p className="text-red-500">Error loading milestones.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-white dark:bg-dark-secondary z-10">
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 dark:text-gray-300">Program</th>
                    <th className="text-left py-2 dark:text-gray-300">Milestone</th>
                    <th className="text-left py-2 dark:text-gray-300">Date</th>
                    <th className="text-left py-2 dark:text-gray-300"># of Work Items</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMilestones?.map((milestone) => {
                    const milestoneWorkItems = filteredWorkItems?.filter(
                      (wi) => wi.dueByMilestoneId === milestone.id
                    );
                    const programName =
                      programs.find((p) => p.id === milestone.programId)?.name || "—";

                    // Check if milestone date is in the past
                    const isPast = milestone.date ? new Date(milestone.date) < new Date() : false;
                    
                    return (
                      <tr
                        key={milestone.id}
                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-tertiary transition ${
                          isPast ? "bg-gray-100 dark:bg-gray-800" : ""
                        }`}
                      >
                        <td className={`py-2 ${isPast ? "text-gray-500 dark:text-gray-400" : "dark:text-white"}`}>
                          {programName}
                        </td>
                        <td className={`py-2 ${isPast ? "text-gray-500 dark:text-gray-400" : "dark:text-white"}`}>
                          {milestone.name}
                        </td>
                        <td className={`py-2 ${isPast ? "text-gray-500 dark:text-gray-400" : "dark:text-gray-300"}`}>
                          {milestone.date
                            ? new Date(milestone.date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className={`py-2 ${isPast ? "text-gray-500 dark:text-gray-400" : "dark:text-gray-300"}`}>
                          {milestoneWorkItems?.length ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ---- Burndown Chart: Work Items — spans 2 columns ---- */}
        <div className="col-span-3 md:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="mb-4 text-lg font-semibold dark:text-white">
                Work Item Burndown
              </h3>
              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
                value={selectedWorkItemType}
                onChange={(e) => {
                  const value = e.target.value as WorkItemType | "all";
                  setSelectedWorkItemType(value);
                }}
              >
                <option value="all">All Types</option>
                {Object.values(WorkItemType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <BurndownChart workItems={filteredWorkItemsForChart} isDarkMode={isDarkMode} />
          </div>
        </div>
        
        {/* ---- Urgent Work Items DataGrid ---- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">
              {selectedPriority === "all"
                ? "All Work Items"
                : `${selectedPriority} Priority Work Items`}
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
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={displayedWorkItems}
              columns={workItemColumns}
              checkboxSelection
              loading={isWorkItemsLoading}
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
      </div>
    </div>
  );
};

export default HomePage;
