"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { WorkItem } from "@/state/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { format, eachDayOfInterval, isAfter } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  workItems: WorkItem[];
  startDate?: string;
  endDate?: string;
  isDarkMode?: boolean;
};

const BurndownChart: React.FC<Props> = ({ workItems, startDate, endDate, isDarkMode = false }) => {
  const today = new Date();

  // Determine chart start/end date
  const minDate = useMemo(() => {
    const dates = workItems
      .map((w) => new Date(w.dueDate))
      .concat(workItems.map((w) => new Date(w.estimatedCompletionDate || w.dueDate)))
      .concat(workItems.map((w) => new Date(w.actualCompletionDate || w.dueDate)));
    return startDate ? new Date(startDate) : new Date(Math.min(...dates.map((d) => d.getTime())));
  }, [workItems, startDate]);

  const maxDate = useMemo(() => {
    const dates = workItems
      .map((w) => new Date(w.dueDate))
      .concat(workItems.map((w) => new Date(w.estimatedCompletionDate || w.dueDate)))
      .concat(workItems.map((w) => new Date(w.actualCompletionDate || w.dueDate)));
    const max = endDate ? new Date(endDate) : new Date(Math.max(...dates.map((d) => d.getTime())));
    return isAfter(max, today) ? max : today;
  }, [workItems, endDate, today]);

  const dates = eachDayOfInterval({ start: minDate, end: maxDate }).map((d) => format(d, "yyyy-MM-dd"));

  // Helper function to count remaining items for a given date and property
  const getRemaining = (
    dateStr: string,
    prop: "dueDate" | "estimatedCompletionDate" | "actualCompletionDate"
  ) => {
    const currentDate = new Date(dateStr);
    return workItems.filter((w) => {
      const targetValue = w[prop] || w.dueDate;
      const targetDate = new Date(targetValue);
      return isAfter(targetDate, currentDate);
    }).length;
  };

  // Lines
  const baselineLine = dates.map((d) => getRemaining(d, "dueDate"));
  const forecastLine = dates.map((d) => getRemaining(d, "estimatedCompletionDate"));
  const actualsLine = dates.map((d) =>
    isAfter(new Date(d), today) ? null : getRemaining(d, "actualCompletionDate")
  );

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Actuals (Completed)",
        data: actualsLine,
        borderColor: "#66CDAA",
        backgroundColor: "rgba(102,205,170,0.2)",
        fill: true,
        spanGaps: false, // prevents the line from connecting beyond nulls
      },
      {
        label: "Baseline (Due Date)",
        data: baselineLine,
        borderColor: "#FF9500",
        backgroundColor: "rgba(255,149,0,0.2)",
        fill: true,
      },
      {
        label: "Forecast (Estimated Completion)",
        data: forecastLine,
        borderColor: "#6FA8DC",
        backgroundColor: "rgba(111, 168, 220, 0.2)",
        fill: true,
      },
    ],
  };

    const textColor = isDarkMode ? "#FFFFFF" : "#000000";
    const gridColor = isDarkMode ? "#444" : "#CCC";

    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: { 
            position: "top",
            labels: {
                color: textColor, // legend text
                usePointStyle: true,
            },
            },
            title: { 
                display: false, 
                text: "Work Item Burndown Chart",
                color: textColor, // chart title
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: isDarkMode ? "#222" : "#fff",
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
                callbacks: {
                    label: function (tooltipItem) {
                        const datasetLabel = tooltipItem.dataset.label || "";
                        const value = tooltipItem.raw === null ? "—" : tooltipItem.raw;
                        return `${datasetLabel}: ${value}`;
                    },
                },
            },
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
        scales: {
            x: {
                title: { display: false, text: "Date", color: textColor },
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
            y: {
                beginAtZero: true,
                title: { display: false, text: "Remaining Work Items", color: textColor },
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
        },
    };


  return <Line data={data} options={options} />;
};

export default BurndownChart;
