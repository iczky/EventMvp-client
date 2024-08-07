import { config } from "@/constants/url";
import { Event, ResponseGetEvent } from "@/types/events";
import { getData } from "@/utils/getData";

export async function getFilteredEvents(filters?: Record<string, any>) {
  let endpoints = config.endpoints.filteredEventByCategory;

  const filteredEvents = (await getData(
    endpoints,
    filters
  )) as unknown as ResponseGetEvent;
  return filteredEvents;
}
