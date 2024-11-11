import dayjs from "dayjs";

import { Timeline } from "./components/Timeline";
import { generateData } from "./data/composed";

const App = () => {
  const today = dayjs();
  const { events, groups } = generateData();

  return <Timeline groups={groups} items={events} today={today} />;
};

export default App;
