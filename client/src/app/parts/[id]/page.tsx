"use client";

import { useGetPartsByUserQuery } from "@/state/api";
import React, { useState } from 'react';
import PartHeader from "@/app/parts/PartHeader";
import Board from '../BoardView';
import Burndown from '../BurndownView';
import Timeline from '../TimelineView';
import Table from '../TableView';
import ModalNewWorkItem from '@/components/ModalNewWorkItem';

type Props = {
    params: Promise<{id: string}>;
};

const Part = ({ params }: Props) => {
    const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewWorkItemOpen, setIsModalNewWorkItemOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all parts assigned to the current user
    const userId = 12; // TODO: replace with useAppSelector(state => state.global.userId)
    const { data: userParts = [], isLoading } = useGetPartsByUserQuery(userId!, { skip: !userId });
    const activePart = userParts.find((p) => p.id === Number(id));

    // Optional: handle loading / not found cases
    if (isLoading) return <div className="p-4 text-gray-500">Loading parts...</div>;
    if (!activePart) return <div className="p-4 text-red-500">Part not found.</div>;

    return (
        <div>
            <ModalNewWorkItem
                isOpen={isModalNewWorkItemOpen}
                onClose={() => setIsModalNewWorkItemOpen(false)}
                id={id}
            />
            <PartHeader 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                activePart={activePart}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            { activeTab === "Board" && (
                <Board id={id} setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen} searchQuery={searchQuery} />
            )}
            { activeTab === "Burndown" && (
                <Burndown id={id} setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen} searchQuery={searchQuery} />
            )}
            { activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen} searchQuery={searchQuery} />
            )}
            { activeTab === "Table" && (
                <Table id={id} setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen} searchQuery={searchQuery} />
            )}
        </div>
    )
};

export default Part;