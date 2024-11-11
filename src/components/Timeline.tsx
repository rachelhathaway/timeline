import ReactCalendarTimeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import dayjs from "dayjs";

const groups = [
  { id: 1, title: "group 1" },
  { id: 2, title: "group 2" },
];

const getItems = (today: dayjs.Dayjs) => {
  return [
    {
      id: 1,
      group: 1,
      title: "item 1",
      start_time: today,
      end_time: today.add(1, "hour"),
    },
    {
      id: 2,
      group: 2,
      title: "item 2",
      start_time: today.subtract(0.5, "hour"),
      end_time: today.add(0.5, "hour"),
    },
    {
      id: 3,
      group: 1,
      title: "item 3",
      start_time: today.add(2, "hour"),
      end_time: today.add(3, "hour"),
    },
  ];
};

export const Timeline = () => {
  const today = dayjs();

  return (
    <ReactCalendarTimeline
      defaultTimeStart={today.subtract(6, "hour").toDate()}
      defaultTimeEnd={today.add(6, "hour").toDate()}
      groups={groups}
      items={getItems(today)}
    >
      <TimelineHeaders>
        <SidebarHeader>
          {({ getRootProps }) => {
            return <div {...getRootProps()}>Users</div>;
          }}
        </SidebarHeader>
        <DateHeader unit="primaryHeader" />
        <DateHeader />
      </TimelineHeaders>
    </ReactCalendarTimeline>
  );
};
