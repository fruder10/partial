"use client";

import Header from "@/components/Header";
import MilestoneCard from "@/components/MilestoneCard";
import PartNumberCard from "@/components/PartNumberCard";
import ProgramCard from "@/components/ProgramCard";
import UserCard from "@/components/UserCard";
import WorkItemCard from "@/components/WorkItemCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  const hasResults = searchResults && (
    (searchResults.workItems && searchResults.workItems.length > 0) ||
    (searchResults.programs && searchResults.programs.length > 0) ||
    (searchResults.users && searchResults.users.length > 0) ||
    (searchResults.milestones && searchResults.milestones.length > 0) ||
    (searchResults.partNumbers && searchResults.partNumbers.length > 0)
  );

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchTerm.length < 3 && (
          <p className="text-gray-500">Enter at least 3 characters to search</p>
        )}
        {!isLoading && !isError && searchTerm.length >= 3 && !hasResults && (
          <p className="text-gray-500">No results found</p>
        )}
        {!isLoading && !isError && hasResults && (
          <div className="space-y-8">
            {/* Work Items */}
            {searchResults.workItems && searchResults.workItems.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-semibold">Work Items ({searchResults.workItems.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.workItems.map((workItem) => (
                    <WorkItemCard key={workItem.id} workItem={workItem} />
                  ))}
                </div>
              </div>
            )}

            {/* Programs */}
            {searchResults.programs && searchResults.programs.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-semibold">Programs ({searchResults.programs.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {searchResults.users && searchResults.users.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-semibold">Users ({searchResults.users.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {searchResults.milestones && searchResults.milestones.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-semibold">Milestones ({searchResults.milestones.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.milestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            )}

            {/* Part Numbers */}
            {searchResults.partNumbers && searchResults.partNumbers.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-semibold">Part Numbers ({searchResults.partNumbers.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.partNumbers.map((partNumber) => (
                    <PartNumberCard key={partNumber.id} partNumber={partNumber} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;