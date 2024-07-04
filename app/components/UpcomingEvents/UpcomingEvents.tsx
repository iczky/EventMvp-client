"use client";
import useEvent from "@/hooks/useEvents";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import EventList from "../EventList/EventList";

const UpcomingEvents = () => {
  const [filters, setFilters] = useState({
    categoryId: null,
    date: null,
    isFree: null,
    page: 0,
    size: 5,
  });

  const { events, categories, isLoading, error } = useEvent(filters);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex-col gap-2 py-4 text-black">
        <div className="flex gap-2 justify-evenly">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn-md items-center p-4 flex rounded-lg gap-2 bg-grey-opacity">
              Category
              <ChevronDown width={24} height={24} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-28">
              {categories?.map((category) => (
                <li
                  key={category.id}
                  className="text-base pb-4 last:pb-2"
                  onClick={() =>
                    handleFilterChange({ categoryId: category.id })
                  }>
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn-md items-center p-4 flex rounded-lg gap-2 bg-grey-opacity">
              Price
              <ChevronDown width={24} height={24} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-28">
              <li
                className="text-base pb-4"
                onClick={() => handleFilterChange({ isFree: false })}>
                Paid
              </li>
              <li
                className="text-base"
                onClick={() => handleFilterChange({ isFree: true })}>
                Free
              </li>
            </ul>
          </div>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn-md items-center p-4 flex rounded-lg gap-2 bg-grey-opacity">
              Date
              <ChevronDown width={24} height={24} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-28">
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </div>
        <div className="px-4 pt-4 md:px-12 md:pt-8 flex items-center justify-between">
          <h1 className="text-2xl ">Upcoming Events</h1>
          <p className="pr-4 pt-2">See all</p>
        </div>
      </div>
      <EventList filters={filters} />
    </>
  );
};

export default UpcomingEvents;
