import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import type { Dayjs } from "dayjs";

type Item = TimelineItemBase<number> & {
  itemProps: React.HTMLAttributes<HTMLDivElement> & { "data-tip": string };
};

type TimelineProps = {
  groups: ReactCalendarTimelineProps["groups"];
  items: Item[];
  today: Dayjs;
};

export const Timeline = ({ groups, items, today }: TimelineProps) => (
  <ReactCalendarTimeline<Item>
    defaultTimeStart={today.subtract(6, "hour").toDate()}
    defaultTimeEnd={today.add(6, "hour").toDate()}
    groups={groups}
    items={items}
  />
);
