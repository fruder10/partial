import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetWorkItemsByPartNumberQuery, WorkItemType, Status, Priority, IssueType, DeliverableType, WorkItem } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import ModalEditWorkItem from "@/components/ModalEditWorkItem";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
  searchQuery: string;
};

// Helper function to filter work items based on search query
const filterWorkItemsBySearch = (workItems: WorkItem[], searchQuery: string) => {
  if (!searchQuery.trim()) return workItems;
  
  const query = searchQuery.toLowerCase();
  return workItems.filter((item) => {
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags?.toLowerCase().includes(query) ||
      item.workItemType?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query) ||
      item.priority?.toLowerCase().includes(query)
    );
  });
};

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

const columns: GridColDef[] = [
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
    minWidth: 250,
    flex: 2,
  },
  {
    field: "description",
    headerName: "Description",
    minWidth: 300,
    flex: 2,
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
    field: "tags",
    headerName: "Tags",
    width: 150,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "dateOpened",
    headerName: "Date Opened",
    width: 120,
    renderCell: (params) => formatDate(params.value),
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
    field: "actualCompletionDate",
    headerName: "Actual Completion",
    width: 140,
    renderCell: (params) => formatDate(params.value),
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
    width: 130,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "program",
    headerName: "Program",
    width: 150,
    renderCell: (params) => params.value?.name || "N/A",
  },
  {
    field: "dueByMilestone",
    headerName: "Milestone",
    width: 150,
    renderCell: (params) => params.value?.name || "N/A",
  },
  {
    field: "authorUser",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.name || "Unknown",
  },
  {
    field: "assigneeUser",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.name || "Unassigned",
  },
  {
    field: "issueDetail",
    headerName: "Issue Type",
    width: 180,
    renderCell: (params) => {
      if (params.row.workItemType === WorkItemType.Issue && params.value) {
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
            {params.value.issueType}
          </span>
        );
      }
      return "N/A";
    },
  },
  {
    field: "rootCause",
    headerName: "Root Cause",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      if (params.row.workItemType === WorkItemType.Issue && params.row.issueDetail) {
        return (
          <span className="text-xs">
            {params.row.issueDetail.rootCause || "N/A"}
          </span>
        );
      }
      return "N/A";
    },
  },
  {
    field: "correctiveAction",
    headerName: "Corrective Action",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      if (params.row.workItemType === WorkItemType.Issue && params.row.issueDetail) {
        return (
          <span className="text-xs">
            {params.row.issueDetail.correctiveAction || "N/A"}
          </span>
        );
      }
      return "N/A";
    },
  },
  {
    field: "deliverableDetail",
    headerName: "Deliverable Type",
    width: 200,
    renderCell: (params) => {
      if (params.row.workItemType === WorkItemType.Deliverable && params.value) {
        return (
          <span className="text-xs">
            {params.value.deliverableType}
          </span>
        );
      }
      return "N/A";
    },
  },
];

const TableView = ({ id, setIsModalNewWorkItemOpen, searchQuery }: Props) => {
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [workItemFilter, setWorkItemFilter] = React.useState<"all" | "open">("all");
  const [editingWorkItem, setEditingWorkItem] = React.useState<WorkItem | null>(null);
  
  const {
    data: workItems,
    error,
    isLoading,
  } = useGetWorkItemsByPartNumberQuery({ partNumberId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error || !workItems) return <div>An error occurred while fetching work items</div>;

  // Filter work items based on the toggle and search query
  let filteredWorkItems = workItemFilter === "open"
    ? workItems.filter((item) => item.status !== Status.Completed)
    : workItems;
  
  // Apply search filter
  filteredWorkItems = filterWorkItemsBySearch(filteredWorkItems, searchQuery);

  return (
    <div className="h-[calc(100vh-250px)] w-full px-4 pb-8 xl:px-6">
      {editingWorkItem && (
        <ModalEditWorkItem
          isOpen={!!editingWorkItem}
          onClose={() => setEditingWorkItem(null)}
          workItem={editingWorkItem}
        />
      )}
      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          {/* Work Item Status Toggle */}
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
          
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewWorkItemOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" />New Work Item
          </button>
        </div>
      </div>
      <DataGrid
        rows={filteredWorkItems || []}
        columns={columns}
        className={dataGridClassNames}
        showToolbar
        sx={dataGridSxStyles(isDarkMode)}
        autoHeight={false}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'dueDate', sort: 'asc' }],
          },
        }}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        onRowClick={(params) => router.push(`/work-items/${params.row.id}`)}
      />
    </div>
  );
};

export default TableView;