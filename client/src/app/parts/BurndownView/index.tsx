"use client";

import Header from "@/components/Header";
import WorkItemCard from "@/components/WorkItemCard";
import BurndownChart from "@/components/BurndownChart";
import { WorkItem, WorkItemType, useGetWorkItemsByPartNumberQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import React, { useMemo, useState } from "react";
import { PlusSquare } from "lucide-react";

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

const BurndownView = ({ id, setIsModalNewWorkItemOpen, searchQuery }: Props) => {
  const { data: workItems, error, isLoading } = useGetWorkItemsByPartNumberQuery({
    partNumberId: Number(id),
  });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [selectedWorkItemType, setSelectedWorkItemType] = useState<WorkItemType | "all">("all");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching work items</div>;

  // Filter work items based on search query
  const searchFilteredWorkItems = useMemo(() => {
    return filterWorkItemsBySearch(workItems || [], searchQuery);
  }, [workItems, searchQuery]);

  // ✅ Filter valid work items with a due date for the chart
  const validWorkItems = useMemo(
    () => (searchFilteredWorkItems ?? []).filter((w) => w.dueDate),
    [searchFilteredWorkItems]
  );

  // Work Items filtered by Type:
  const filteredWorkItemsForChart = 
  selectedWorkItemType === "all"
    ? validWorkItems
    : validWorkItems.filter((item) => item.workItemType === selectedWorkItemType);

  return (
    <div className="px-4 pb-8 lg:px-6">
      {/* ---- Header ---- */}
      <div className="pt-5">
        <Header
          name="Work Item Burndown"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewWorkItemOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" />New Work Item
            </button>
          }
          isSmallText
        />
      </div>

      {/* ---- Burndown Chart ---- */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
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
        {filteredWorkItemsForChart.length > 0 ? (
          <BurndownChart workItems={filteredWorkItemsForChart} isDarkMode={isDarkMode} />
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            No work items with valid due dates to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default BurndownView;
