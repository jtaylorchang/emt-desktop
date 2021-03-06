import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Calendar, Event, momentLocalizer } from "react-big-calendar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReduxState } from "../redux";
import { isDayValid } from "../utils/datetime";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingBottom: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    calendarContainer: {},
    calendarDay: {
      "&:hover": {
        cursor: "pointer",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A0A0A0"
      }
    }
  })
);

const localizer = momentLocalizer(moment);

type CalendarEvent = Event & {
  user_id: string;
  chief: boolean;
  certified: boolean;
};

const PrintSchedulePage: React.FC<{ id: string }> = ({ id }) => {
  const classes = useStyles();

  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const schedules = useSelector((state: ReduxState) => state.schedules.schedules);

  const [visibleDate, setVisibleDate] = React.useState<Date>(new Date());

  const schedule = React.useMemo(() => schedules.find((schedule) => schedule._id === id), [id, schedules]);
  const scheduleStart = React.useMemo(() => moment(schedule?.startDate), [schedule?.startDate]);
  const scheduleEnd = React.useMemo(() => moment(schedule?.endDate), [schedule?.endDate]);
  const scheduleStartDate = React.useMemo(() => scheduleStart.toDate(), [scheduleStart]);

  const legendEvents = React.useMemo(() => {
    const dayBeforeStart = scheduleStart.subtract(scheduleStart.day(), "day").toDate();

    const events: CalendarEvent[] = [
      {
        title: "Chief",
        user_id: "",
        chief: true,
        certified: true,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      },
      {
        title: "Certified",
        user_id: "",
        chief: false,
        certified: true,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      },
      {
        title: "Regular",
        user_id: "",
        chief: false,
        certified: false,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      }
    ];

    return events;
  }, [scheduleStart]);

  const scheduleEvents = React.useMemo(() => {
    let events: (Event & {
      user_id: string;
      certified: boolean;
    })[] = [];

    for (const assignment of schedule?.assignments ?? []) {
      const date = moment(assignment.date).toDate();

      if (schedule && isDayValid(schedule, date)) {
        events = events.concat(
          assignment.cadet_ids.map((cadet_id) => {
            const cadet = cadets.find((cadet) => cadet._id === cadet_id);

            return {
              title: cadet?.name ?? "Unknown",
              user_id: cadet_id,
              chief: cadet?.chief ?? false,
              certified: cadet?.certified ?? false,
              start: date,
              end: date,
              allDay: true
            };
          })
        );
      }
    }

    return [...legendEvents, ...events];
  }, [cadets, legendEvents, schedule]);

  const dayPropGetter = React.useCallback(
    (date: Date) => {
      if (schedule && !isDayValid(schedule, date)) {
        return {
          style: {
            backgroundColor: "#ECECED"
          }
        };
      }

      return {};
    },
    [schedule]
  );

  const eventPropGetter = React.useCallback(
    (event) => ({
      style: event.chief
        ? {
            backgroundColor: "#F48FB1"
          }
        : event.certified
        ? {
            backgroundColor: "#90CAF9"
          }
        : undefined
    }),
    []
  );

  React.useEffect(() => {
    setVisibleDate(scheduleStartDate);
  }, [scheduleStartDate]);

  return (
    <div className={classes.root}>
      <Grid container direction="row" alignItems="center">
        <Typography variant="h6">Schedule for {schedule?.name}</Typography>
      </Grid>

      <Paper className={classes.paper}>
        <div className={classes.calendarContainer}>
          <Calendar
            localizer={localizer}
            defaultView="month"
            views={["month"]}
            showAllEvents
            date={visibleDate}
            onNavigate={(newDate) => setVisibleDate(newDate)}
            events={scheduleEvents}
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventPropGetter}
            style={{ width: "100%", height: 800 }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default PrintSchedulePage;
