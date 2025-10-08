import Header from '@/components/Header';
import WorkItemCard from "@/components/WorkItemCard";
import { WorkItem, useGetWorkItemsByPartNumberQuery } from '@/state/api';
import React from 'react';

type Props = {
    id: string;
    setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewWorkItemOpen }: Props) => {
    const { data: workItems, error, isLoading } = useGetWorkItemsByPartNumberQuery({ partNumberId: Number(id) });

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An error occured while fetching work items</div>;

    return (
        <div className="px-4 pb-8 lx:px-6">
            <div className="pt-5">
                <Header name="List"
                    buttonComponent={
                        <button
                            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                            onClick={() => setIsModalNewWorkItemOpen(true)}
                        >
                            Add Work Item
                        </button>
                    }
                    isSmallText
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {workItems?.map((workItem: WorkItem) => (
                    <WorkItemCard key={workItem.id} workItem={workItem} />))}
            </div>
        </div>
    )
};

export default ListView;