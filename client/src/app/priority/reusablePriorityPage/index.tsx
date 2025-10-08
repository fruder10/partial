"use client";

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import ModalNewWorkItem from '@/components/ModalNewWorkItem';
import WorkItemCard from '@/components/WorkItemCard';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { Priority, WorkItem, useGetWorkItemsByUserQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

type Props = {
    priority: Priority
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "dateOpened",
    headerName: "Date Opened",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "authorUser",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.authorUser || "Unknown",
  },
  {
    field: "assigneeUser",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.assigneeUser || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
    const [ view, setView ] = useState("list");
    const [ isModalNewWorkItemOpen, setIsModalNewWorkItemOpen ] = useState(false);
    
    const userId = 12; // HARDCODED BEFORE WE HAVE USER AUTHENTICATION COGNITO BUILT IN
    const { data: workItems, isLoading, isError: isTasksError } = useGetWorkItemsByUserQuery(userId || 0, {
        skip: userId === null
    });

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const filteredWorkItems = workItems?.filter((workItem: WorkItem) => workItem.priority === priority)

    if (isTasksError || !workItems) return <div>Error fetching work items.</div>

    return (
        <div className="m-5 p-4">
            <ModalNewWorkItem isOpen={isModalNewWorkItemOpen} onClose={() => setIsModalNewWorkItemOpen(false)} />
            <Header 
                name="Priority Page"
                buttonComponent={
                    <button
                        className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        onClick={() => setIsModalNewWorkItemOpen(true)}>
                            Add Work Item
                    </button>
                }
            />
            <div className="mb-4 flex justify-start">
                <button
                    className={`px-4 py-2 ${
                        view === "list" ? "bg-gray-300" : "bg-white"
                    } rounded-l`}
                    onClick={() => setView("list")}
                >
                        List
                </button>
                <button
                    className={`px-4 py-2 ${
                        view === "table" ? "bg-gray-300" : "bg-white"
                    } rounded-r`}
                    onClick={() => setView("table")}
                >
                        Table
                </button>
            </div>
            {isLoading ? (<div>Loading work items...</div>) : view === "list" ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredWorkItems?.map((workItem: WorkItem) => (
                        <WorkItemCard key={workItem.id} workItem={workItem} />
                    ))}
                </div>
            ) : (
                view === "table" && filteredWorkItems && (
                    <div className="w-full">
                        <DataGrid
                            rows={filteredWorkItems}
                            columns={columns}
                            checkboxSelection
                            getRowId={(row) => row.id}
                            className={dataGridClassNames}
                            sx={dataGridSxStyles(isDarkMode)}
                        />
                    </div>
                )
            )}
        </div>
    )
};

export default ReusablePriorityPage;