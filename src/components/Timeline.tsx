import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

type Item = TimelineItemBase<number> & {
  itemProps: React.HTMLAttributes<HTMLDivElement> & { "data-tip": string };
};

type TimelineProps = Pick<
  ReactCalendarTimelineProps,
  "groups" | "onItemMove" | "onItemResize"
> & {
  defaultTimeEnd: Date;
  defaultTimeStart: Date;
  items: Item[];
};

export const Timeline = (props: TimelineProps) => (
  <ReactCalendarTimeline<Item> canResize="both" {...props} />
);
