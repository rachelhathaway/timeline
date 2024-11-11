import { EventsProvider } from "./components/events/Events.Provider";
import { generateData } from "./data/composed";
import { Timeline } from "./components/timeline/Timeline";

const { events: initialEvents, groups } = generateData();

export const App = () => {
  return (
    <EventsProvider initialEvents={initialEvents}>
      <Timeline groups={groups} />
    </EventsProvider>
  );
};
