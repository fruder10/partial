"use client";

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import {
    useGetProgramsQuery,
    useGetPartsByUserQuery
} from '@/state/api';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Bolt,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Home,
    Layers3,
    LockIcon,
    LucideIcon,
    Search,
    Settings,
    ShieldAlert,
    User,
    Users,
    X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

const Sidebar = () => {
    const [showPriority, setShowPriority] = useState(true);
    const [showPrograms, setShowPrograms] = useState(true);
    const [expandedPrograms, setExpandedPrograms] = useState<Record<number, boolean>>({});

    const { data: programs } = useGetProgramsQuery();

    const userId = 12; // TODO: replace with useAppSelector(state => state.global.userId)
    const { data: userParts } = useGetPartsByUserQuery(userId!, { skip: !userId });

    // ✅ Group parts by programId for easy display
    const partsByProgram = useMemo(() => {
        if (!userParts) return {};
        return userParts.reduce<Record<number, typeof userParts>>((acc, part) => {
            (acc[part.programId] ||= []).push(part);
            return acc;
        }, {});
    }, [userParts]);

    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );

    /* =========================
       ✅ Restore expanded programs from localStorage
    ========================== */
    useEffect(() => {
        const stored = localStorage.getItem("expandedPrograms");
        if (stored) {
            setExpandedPrograms(JSON.parse(stored));
        }
    }, []);

    /* =========================
       ✅ Auto-expand the program for the active part
    ========================== */
    useEffect(() => {
        if (userParts && pathname.startsWith("/parts/")) {
            const partId = Number(pathname.split("/parts/")[1]);
            const activePart = userParts.find((p) => p.id === partId);
            if (activePart) {
                setExpandedPrograms((prev) => {
                    const updated = { ...prev, [activePart.programId]: true };
                    localStorage.setItem("expandedPrograms", JSON.stringify(updated));
                    return updated;
                });
            }
        }
    }, [pathname, userParts]);

    const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
        transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
        ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
    `;

    return (
        <div className={sidebarClassNames}>
            <div className="flex h-[100%] w-full flex-col justify-start">
                {/* TOP LOGO */}
                <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
                    <div className="text-xl font-bolt text-gray-800 dark:text-white">
                        PARTIAL
                    </div>
                    {!isSidebarCollapsed && (
                        <button
                            className="py-3"
                            onClick={() =>
                                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
                            }
                        >
                            <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
                        </button>
                    )}
                </div>

                {/* TEAM HEADER */}
                <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
                    <Image src="/logo1.png" alt="Logo" width={40} height={40} />
                    <div>
                        <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
                            COMPANY NAME
                        </h3>
                        <div className="mt-1 flex items-start gap-2">
                            <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <p className="text-xs text-gray-500">Private</p>
                        </div>
                    </div>
                </div>

                {/* NAVBAR LINKS */}
                <nav className="z-10 w-full">
                    <SidebarLink icon={Home} label="Home" href="/" />
                    <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
                    <SidebarLink icon={Search} label="Search" href="/search" />
                    <SidebarLink icon={Settings} label="Settings" href="/settings" />
                    <SidebarLink icon={User} label="Users" href="/users" />
                    <SidebarLink icon={Users} label="Teams" href="/teams" />
                </nav>

                {/* ===== My Programs top-level toggle ===== */}
                <button
                    onClick={() => setShowPrograms((p) => !p)}
                    className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
                >
                    <span>My Parts</span>
                    {showPrograms ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>

                {/* ===== Collapsible list of programs ===== */}
                {showPrograms &&
                    programs?.map((program) => {
                        const isOpen = expandedPrograms[program.id] ?? false;
                        return (
                            <div key={program.id}>
                                {/* Program toggle */}
                                <button
                                    onClick={() => {
                                        setExpandedPrograms((prev) => {
                                            const newState = {
                                                ...prev,
                                                [program.id]: !isOpen,
                                            };
                                            localStorage.setItem(
                                                "expandedPrograms",
                                                JSON.stringify(newState)
                                            );
                                            return newState;
                                        });
                                    }}
                                    className="flex w-full items-center justify-between px-8 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <span className="flex items-center gap-3">
                                        <Briefcase className="h-5 w-5" />
                                        {program.name}
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </button>

                                {/* User’s part numbers for this program */}
                                {isOpen &&
                                    partsByProgram[program.id]?.map((part) => (
                                        <SidebarLink
                                            key={part.id}
                                            icon={Bolt}
                                            label={`${part.number} - ${part.partName}`}
                                            href={`/parts/${part.id}`}
                                        />
                                    ))}
                            </div>
                        );
                    })}

                {/* PRIORITIES LINKS */}
                <button
                    onClick={() => setShowPriority((prev) => !prev)}
                    className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
                >
                    <span>Priority</span>
                    {showPriority ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>
                {showPriority && (
                    <>
                        <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
                        <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
                        <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
                        <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
                        <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
                    </>
                )}
            </div>
        </div>
    );
};

interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive =
        pathname === href || (pathname === "/" && href === "/dashboard");

    return (
        <Link href={href} className="w-full">
            <div
                className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
                } justify-start px-8 py-3`}
            >
                {isActive && (
                    <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
                )}
                <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
                <span className={`font-medium text-gray-800 dark:text-gray-100`}>
                    {label}
                </span>
            </div>
        </Link>
    );
};

export default Sidebar;
