"use client";
import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    width: 150,
    renderCell: (params) => {
      const phone = params.value;
      if (!phone) return "N/A";
      // Format as (XXX) XXX-XXXX or 1 (XXX) XXX-XXXX
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
        return `1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      return phone;
    },
  },
  { field: "role", headerName: "Role", width: 150 },
  {
    field: "disciplineTeam",
    headerName: "Discipline Team",
    width: 200,
    valueGetter: (value, row) => row.disciplineTeam?.name || "N/A",
  },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        {params.value ? (
          <div className="h-9 w-9">
            <Image
              src={`/${params.value}`}
              alt={params.row.username}
              width={100}
              height={50}
              className="h-full rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
            {params.row.username?.substring(0, 2).toUpperCase() || "?"}
          </div>
        )}
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          showToolbar
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Users;