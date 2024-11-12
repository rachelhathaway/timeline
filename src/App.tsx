import { generateData } from "./data/composed";
import { DialogProvider } from "./components/dialog/Dialog.Provider";
import { EventsProvider } from "./components/events/Events.Provider";
import { Timeline } from "./components/timeline/Timeline";

const { events, groups, users } = generateData();

export const App = () => {
  return (
    <DialogProvider>
      <EventsProvider initialEvents={events}>
        <Timeline groups={groups} users={users} />
      </EventsProvider>
    </DialogProvider>
  );
};
