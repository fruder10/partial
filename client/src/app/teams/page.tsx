"use client";
import { useGetTeamsQuery, useGetUsersQuery, useGetWorkItemsQuery, WorkItemType, Priority, WorkItem, Status } from "@/state/api";
import React, { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import BurndownChart from "@/components/BurndownChart";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
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
import { format } from "date-fns";

const COLORS = ["#6FA8DC", "#66CDAA", "#FF9500", "#FF8042", "#A28FD0", "#FF6384", "#36A2EB"];

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

const Teams = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | "all">("all");
  const [chartMode, setChartMode] = useState<"type" | "priority">("type");
  const [selectedWorkItemType, setSelectedWorkItemType] = useState<WorkItemType | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">(Priority.Urgent);
  const [workItemFilter, setWorkItemFilter] = useState<"all" | "open">("all");
  
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  // Auto-select the first team when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && selectedTeamId === "all") {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);
  const { data: users } = useGetUsersQuery();
  const { data: workItems } = useGetWorkItemsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Filter users by selected team
  const teamMembers = useMemo(() => {
    if (!users || selectedTeamId === "all") return [];
    return users.filter((user) => user.disciplineTeamId === selectedTeamId);
  }, [users, selectedTeamId]);

  // Get work items for selected team
  const teamWorkItems = useMemo(() => {
    if (!workItems || selectedTeamId === "all") return [];
    return workItems.filter((item) => {
      const assignee = users?.find((u) => u.userId === item.assignedUserId);
      return assignee?.disciplineTeamId === selectedTeamId;
    });
  }, [workItems, users, selectedTeamId]);

  // Apply work item filter (all vs open)
  const filteredTeamWorkItems = useMemo(() => {
    if (workItemFilter === "open") {
      return teamWorkItems.filter((item) => item.status !== "Completed");
    }
    return teamWorkItems;
  }, [teamWorkItems, workItemFilter]);

  // Filter work items by type for burndown chart (uses all team work items, not filtered by status)
  const filteredTeamWorkItemsForBurndown = useMemo(() => {
    if (selectedWorkItemType === "all") return teamWorkItems;
    return teamWorkItems.filter((item) => item.workItemType === selectedWorkItemType);
  }, [teamWorkItems, selectedWorkItemType]);

  // Count work items per team member
  const memberWorkItemCounts = useMemo(() => {
    if (!teamMembers.length) return [];
    
    const counts = teamMembers.map((member) => {
      const count = filteredTeamWorkItems.filter((item) => item.assignedUserId === member.userId).length;
      return {
        name: member.name,
        count,
      };
    });

    return counts.sort((a, b) => b.count - a.count);
  }, [filteredTeamWorkItems, teamMembers]);

  // Pie chart data: Type vs Priority
  const priorityCount = useMemo(() => {
    const count: Record<string, number> = {};
    filteredTeamWorkItems.forEach((item) => {
      count[item.priority] = (count[item.priority] || 0) + 1;
    });
    return Object.entries(count).map(([name, count]) => ({ name, count }));
  }, [filteredTeamWorkItems]);

  const typeCount = useMemo(() => {
    const count: Record<string, number> = {};
    filteredTeamWorkItems.forEach((item) => {
      count[item.workItemType] = (count[item.workItemType] || 0) + 1;
    });
    return Object.entries(count).map(([name, count]) => ({ name, count }));
  }, [filteredTeamWorkItems]);

  const pieData = chartMode === "type" ? typeCount : priorityCount;

  // Priority counts for datagrid dropdown
  const priorityCounts = useMemo(() => {
    const count: Record<string, number> = {};
    filteredTeamWorkItems.forEach((item) => {
      count[item.priority] = (count[item.priority] || 0) + 1;
    });
    return count;
  }, [filteredTeamWorkItems]);

  const totalCount = filteredTeamWorkItems.length;

  // Priority Work Items for the DataGrid
  const filteredWorkItemsByPriority = useMemo(() => {
    if (selectedPriority === "all") return filteredTeamWorkItems;
    return filteredTeamWorkItems.filter((item) => item.priority === selectedPriority);
  }, [filteredTeamWorkItems, selectedPriority]);

  const displayedWorkItems = useMemo(() => {
    return [...filteredWorkItemsByPriority]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .map((item) => ({
        ...item,
        assigneeUserName: item.assigneeUser?.name || "Unassigned",
      }));
  }, [filteredWorkItemsByPriority]);

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

  const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "name", headerName: "Team Name", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 400,
    },
    { 
      field: "teamManagerName",
      headerName: "Team Manager",
      width: 200,
      renderCell: (params: any) => params.value || "—",
    },
    {
      field: "teamMembers",
      headerName: "Team Members",
      width: 400,
      renderCell: (params: any) => {
        const teamMembers = users?.filter((user) => user.disciplineTeamId === params.row.id);
        if (!teamMembers || teamMembers.length === 0) return "—";
        return teamMembers.map((member) => member.name).join(", ");
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />

      {/* Teams DataGrid */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">
          Discipline Teams
        </h3>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={teams || []}
            columns={columns}
            pagination
            showToolbar
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>

      {/* Team Selector and Work Item Filter */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <label htmlFor="team-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select a Team:
          </label>
          <select
            id="team-select"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white"
            value={selectedTeamId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedTeamId(value === "all" ? "all" : parseInt(value));
            }}
          >
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Item Status Toggle */}
        {selectedTeamId !== "all" && (
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
        )}
      </div>

      {/* Team Members Work Items Bar Chart and Pie Chart */}
      {selectedTeamId !== "all" && memberWorkItemCounts.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Bar Chart: Team Members Work Items */}
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Team Members Work Items
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberWorkItemCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
                <XAxis 
                  dataKey="name"
                  stroke={chartColors.text}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke={chartColors.text} />
                <Tooltip />
                <Bar dataKey="count" fill={chartColors.bar}>
                  {memberWorkItemCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Work Item Distribution (By Type / By Priority) */}
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">
                Work Item Distribution
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
      )}

      {/* Work Item Burndown Chart */}
      {selectedTeamId !== "all" && teamWorkItems.length > 0 && (
        <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">
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
          <BurndownChart workItems={filteredTeamWorkItemsForBurndown} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Priority Work Items DataGrid */}
      {selectedTeamId !== "all" && teamWorkItems.length > 0 && (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
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
      )}
    </div>
  );
};

export default Teams;