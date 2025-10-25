"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/state/api";
import { Priority, Status, WorkItem } from "@/state/api";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Status.Completed:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case Priority.High:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Priority.Low:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

const workItemColumns: GridColDef<WorkItem>[] = [
  {
    field: "workItemType",
    headerName: "Type",
    width: 120,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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
      const dateStr = params.value ? format(new Date(params.value), "MM/dd/yyyy") : "N/A";
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
    field: "program",
    headerName: "Program",
    width: 200,
    valueGetter: (value, row) => row.program?.name || "N/A",
  },
];

const UserDetailPage = ({ params }: Props) => {
  const { id } = React.use(params);
  const router = useRouter();
  const userId = Number(id);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");

  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div className="p-8">Loading user...</div>;
  if (isError || !user) return <div className="p-8">Error loading user or user not found</div>;

  // Get assigned work items
  const assignedWorkItems = user.assignedWorkItems || [];
  
  // Filter by priority
  const filteredWorkItems =
    selectedPriority === "all"
      ? assignedWorkItems
      : assignedWorkItems.filter((item) => item.priority === selectedPriority);

  // Sort by priority order (Urgent -> High -> Medium -> Low -> Backlog)
  const priorityOrder = {
    [Priority.Urgent]: 0,
    [Priority.High]: 1,
    [Priority.Medium]: 2,
    [Priority.Low]: 3,
    [Priority.Backlog]: 4,
  };

  const sortedWorkItems = [...filteredWorkItems].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Priority counts
  const priorityCounts = assignedWorkItems.reduce(
    (acc: Record<string, number>, item: WorkItem) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCount = assignedWorkItems.length;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name={user.name} />

      {/* User Information Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          {user.profilePictureUrl ? (
            <div className="h-24 w-24 flex-shrink-0">
              <Image
                src={`/${user.profilePictureUrl}`}
                alt={user.username}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-3xl font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {user.username?.substring(0, 2).toUpperCase() || "?"}
            </div>
          )}

          {/* User Details */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Username:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.username}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone Number:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatPhoneNumber(user.phoneNumber)}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Role:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.role}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Discipline Team:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {user.disciplineTeam?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Items Table */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">
            {selectedPriority === "all"
              ? "All Assigned Work Items"
              : `${selectedPriority} Priority Work Items`}
          </h3>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Priority | "all")}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-dark-tertiary dark:text-white"
          >
            <option value="all">All Priorities ({totalCount})</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority} ({priorityCounts[priority] ?? 0})
              </option>
            ))}
          </select>
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={sortedWorkItems}
            columns={workItemColumns}
            getRowId={(row) => row.id}
            pagination
            showToolbar
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            initialState={{
              sorting: {
                sortModel: [{ field: "priority", sort: "asc" }],
              },
            }}
            onRowClick={(params) => router.push(`/work-items/${params.row.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
