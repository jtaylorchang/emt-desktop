import React from "react";
import { Link, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import FolderIcon from "@material-ui/icons/Folder";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";

import { ReduxState } from "./redux";
import { _crews, _schedules, _users } from "./redux/actions";
import ProfilePage from "./pages/ProfilePage";
import CrewPage from "./pages/CrewPage";
import SchedulePage from "./pages/SchedulePage";
import AvailabilityPage from "./pages/AvailabilityPage";
import CadetPage from "./pages/CadetPage";
import PrintCrewPage from "./pages/PrintCrewPage";
import PrintSchedulePage from "./pages/PrintSchedulePage";
import { NewCadetDialog, NewCrewAssignmentDialog, NewScheduleDialog } from "./components";

const drawerWidth = 256;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    leftAppBar: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    title: {
      marginRight: theme.spacing(1)
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      overflow: "auto"
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    nestedWithRows: {
      paddingLeft: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    errorMessage: {
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    successMessage: {
      background: theme.palette.success.main,
      color: theme.palette.error.contrastText
    },
    printBox: {
      position: "fixed",
      width: "100%",
      height: "100%",
      zIndex: 10000,
      backgroundColor: "white"
    }
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const visibleCrewId = location.pathname.includes("/crew/") ? location.pathname.split("/crew/")[1] : undefined;
  const visibleScheduleId = location.pathname.includes("/schedule/")
    ? location.pathname.split("/schedule/")[1]
    : undefined;

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const crewAssignments = useSelector((state: ReduxState) => state.crews.crewAssignments);
  const schedules = useSelector((state: ReduxState) => state.schedules.schedules);

  const usersSuccessMessage = useSelector((state: ReduxState) => state.users.successMessage);
  const crewsSuccessMessage = useSelector((state: ReduxState) => state.crews.successMessage);
  const scheduleSuccessMessage = useSelector((state: ReduxState) => state.schedules.successMessage);

  const isGettingAllUsers = useSelector((state: ReduxState) => state.users.isGettingAllUsers);
  const getAllUsersErrorMessage = useSelector((state: ReduxState) => state.users.getAllUsersErrorMessage);
  const createUserErrorMessage = useSelector((state: ReduxState) => state.users.createUserErrorMessage);
  const updateUserErrorMessage = useSelector((state: ReduxState) => state.users.updateUserErrorMessage);
  const deleteUserErrorMessage = useSelector((state: ReduxState) => state.users.deleteUserErrorMessage);

  const isGettingAllCrews = useSelector((state: ReduxState) => state.crews.isGettingAllCrews);
  const getAllCrewsErrorMessage = useSelector((state: ReduxState) => state.crews.getAllCrewsErrorMessage);
  const createCrewErrorMessage = useSelector((state: ReduxState) => state.crews.createCrewErrorMessage);
  const updateCrewErrorMessage = useSelector((state: ReduxState) => state.crews.updateCrewErrorMessage);
  const deleteCrewErrorMessage = useSelector((state: ReduxState) => state.crews.deleteCrewErrorMessage);

  const isGettingAllSchedules = useSelector((state: ReduxState) => state.schedules.isGettingAllSchedules);
  const getAllSchedulesErrorMessage = useSelector((state: ReduxState) => state.schedules.getAllSchedulesErrorMessage);
  const createScheduleErrorMessage = useSelector((state: ReduxState) => state.schedules.createScheduleErrorMessage);
  const updateScheduleErrorMessage = useSelector((state: ReduxState) => state.schedules.updateScheduleErrorMessage);
  const deleteScheduleErrorMessage = useSelector((state: ReduxState) => state.schedules.deleteScheduleErrorMessage);
  const getAvailabilityErrorMessage = useSelector((state: ReduxState) => state.schedules.getAvailabilityErrorMessage);
  const createAvailabilityErrorMessage = useSelector(
    (state: ReduxState) => state.schedules.createAvailabilityErrorMessage
  );

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [crewsOpen, setCrewsOpen] = React.useState<boolean>(true);
  const [schedulesOpen, setSchedulesOpen] = React.useState<boolean>(true);
  const [cadetsOpen, setCadetsOpen] = React.useState<boolean>(true);
  const [showCreateNewCrew, setShowCreateNewCrew] = React.useState<boolean>(false);
  const [showCreateNewSchedule, setShowCreateNewSchedule] = React.useState<boolean>(false);
  const [showCreateNewUser, setShowCreateNewUser] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchLogout = React.useCallback(() => dispatch(_users.logout()), [dispatch]);
  const dispatchGetAllUsers = React.useCallback(() => dispatch(_users.getAllUsers(token)), [dispatch, token]);
  const dispatchGetAllCrews = React.useCallback(() => dispatch(_crews.getAllCrews(token)), [dispatch, token]);
  const dispatchGetAllSchedules = React.useCallback(() => dispatch(_schedules.getAllSchedules(token)), [
    dispatch,
    token
  ]);

  /**
   * Refresh critical data
   */
  React.useEffect(() => {
    if (token) {
      dispatchGetAllUsers();
    }
  }, [dispatchGetAllUsers, token]);

  React.useEffect(() => {
    if (token) {
      dispatchGetAllCrews();
    }
  }, [dispatchGetAllCrews, token]);

  React.useEffect(() => {
    if (token) {
      dispatchGetAllSchedules();
    }
  }, [dispatchGetAllSchedules, token]);

  /**
   * Display success message
   */
  React.useEffect(() => {
    if (usersSuccessMessage) setSuccessMessage(usersSuccessMessage);
  }, [usersSuccessMessage]);

  React.useEffect(() => {
    if (crewsSuccessMessage) setSuccessMessage(crewsSuccessMessage);
  }, [crewsSuccessMessage]);

  React.useEffect(() => {
    if (scheduleSuccessMessage) setSuccessMessage(scheduleSuccessMessage);
  }, [scheduleSuccessMessage]);

  /**
   * Display error message
   */
  React.useEffect(() => {
    if (getAllUsersErrorMessage) setErrorMessage(getAllUsersErrorMessage);
  }, [getAllUsersErrorMessage]);

  React.useEffect(() => {
    if (createUserErrorMessage) setErrorMessage(createUserErrorMessage);
  }, [createUserErrorMessage]);

  React.useEffect(() => {
    if (updateUserErrorMessage) setErrorMessage(updateUserErrorMessage);
  }, [updateUserErrorMessage]);

  React.useEffect(() => {
    if (deleteUserErrorMessage) setErrorMessage(deleteUserErrorMessage);
  }, [deleteUserErrorMessage]);

  React.useEffect(() => {
    if (getAllCrewsErrorMessage) setErrorMessage(getAllCrewsErrorMessage);
  }, [getAllCrewsErrorMessage]);

  React.useEffect(() => {
    if (createCrewErrorMessage) setErrorMessage(createCrewErrorMessage);
  }, [createCrewErrorMessage]);

  React.useEffect(() => {
    if (updateCrewErrorMessage) setErrorMessage(updateCrewErrorMessage);
  }, [updateCrewErrorMessage]);

  React.useEffect(() => {
    if (deleteCrewErrorMessage) setErrorMessage(deleteCrewErrorMessage);
  }, [deleteCrewErrorMessage]);

  React.useEffect(() => {
    if (getAllSchedulesErrorMessage) setErrorMessage(getAllSchedulesErrorMessage);
  }, [getAllSchedulesErrorMessage]);

  React.useEffect(() => {
    if (createScheduleErrorMessage) setErrorMessage(createScheduleErrorMessage);
  }, [createScheduleErrorMessage]);

  React.useEffect(() => {
    if (updateScheduleErrorMessage) setErrorMessage(updateScheduleErrorMessage);
  }, [updateScheduleErrorMessage]);

  React.useEffect(() => {
    if (deleteScheduleErrorMessage) setErrorMessage(deleteScheduleErrorMessage);
  }, [deleteScheduleErrorMessage]);

  React.useEffect(() => {
    if (getAvailabilityErrorMessage) setErrorMessage(getAvailabilityErrorMessage);
  }, [getAvailabilityErrorMessage]);

  React.useEffect(() => {
    if (createAvailabilityErrorMessage) setErrorMessage(createAvailabilityErrorMessage);
  }, [createAvailabilityErrorMessage]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <div className={classes.leftAppBar}>
            <Typography className={classes.title} variant="h6" noWrap>
              Nashoba EMS
            </Typography>
          </div>

          <Typography variant="body1" noWrap>
            {user?.name}
          </Typography>

          <IconButton onClick={dispatchLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar />

        <div className={classes.drawerContainer}>
          <ListItem button component={Link} to="/profile" selected={location.pathname === "/profile"}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
            {user?.admin && <Chip label="Admin" color="secondary" size="small" />}
          </ListItem>

          <Divider />

          <ListItem button onClick={() => setSchedulesOpen(!schedulesOpen)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Schedules" />
            {schedulesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={schedulesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {schedules
                .sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0))
                .map((schedule) => {
                  const path = `/schedule/${schedule._id}`;
                  const selected = location.pathname === path;

                  return (
                    <ListItem
                      key={schedule._id}
                      className={classes.nestedWithRows}
                      button
                      component={Link}
                      to={path}
                      selected={selected}
                    >
                      <ListItemText
                        primary={schedule.name}
                        secondary={`${schedule.startDate} to ${schedule.endDate}`}
                      />
                      {schedule.editable && (
                        <ListItemSecondaryAction>
                          <Tooltip title="Edit your availability">
                            <IconButton edge="end" onClick={() => history.push(`/availability/${schedule._id}`)}>
                              <EditIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  );
                })}

              {user?.admin && (
                <ListItem
                  className={classes.nested}
                  button
                  disabled={isGettingAllSchedules}
                  onClick={() => setShowCreateNewSchedule(true)}
                >
                  <ListItemIcon>
                    <AddCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="New Schedule" />
                </ListItem>
              )}
            </List>
          </Collapse>

          <Divider />

          <ListItem button onClick={() => setCrewsOpen(!crewsOpen)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Crew Assignments" />
            {crewsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={crewsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {crewAssignments
                .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                .map((crew) => {
                  const path = `/crew/${crew._id}`;
                  const selected = location.pathname === path;

                  return (
                    <ListItem
                      key={crew._id}
                      className={classes.nested}
                      button
                      component={Link}
                      to={path}
                      selected={selected}
                    >
                      <ListItemText primary={crew.name} />
                    </ListItem>
                  );
                })}

              {user?.admin && (
                <ListItem
                  className={classes.nested}
                  button
                  disabled={isGettingAllCrews}
                  onClick={() => setShowCreateNewCrew(true)}
                >
                  <ListItemIcon>
                    <AddCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="New Assignment" />
                </ListItem>
              )}
            </List>
          </Collapse>

          <Divider />

          <ListItem button onClick={() => setCadetsOpen(!cadetsOpen)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Cadets" />
            {cadetsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={cadetsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {cadets
                .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                .map((cadet) => {
                  const path = user?._id === cadet._id ? "/profile" : `/cadet/${cadet._id}`;
                  const selected = path !== "/profile" && location.pathname === path;

                  return (
                    <ListItem
                      key={cadet._id}
                      className={classes.nested}
                      button
                      component={Link}
                      to={path}
                      selected={selected}
                    >
                      <ListItemText primary={cadet.name} />
                      {cadet.admin && <Chip label="Admin" color="secondary" size="small" />}
                    </ListItem>
                  );
                })}

              {user?.admin && (
                <ListItem
                  className={classes.nested}
                  button
                  disabled={isGettingAllUsers}
                  onClick={() => setShowCreateNewUser(true)}
                >
                  <ListItemIcon>
                    <AddCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="New Cadet" />
                </ListItem>
              )}
            </List>
          </Collapse>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar />
        <Switch>
          <Redirect exact from="/" to="/profile" />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/crew/:id" component={CrewPage} />
          <Route path="/schedule/:schedule_id" component={SchedulePage} />
          <Route path="/availability/:schedule_id" component={AvailabilityPage} />
          <Route path="/cadet/:id" component={CadetPage} />
        </Switch>
      </main>

      {showCreateNewUser && <NewCadetDialog onClose={() => setShowCreateNewUser(false)} />}
      {showCreateNewCrew && <NewCrewAssignmentDialog onClose={() => setShowCreateNewCrew(false)} />}
      {showCreateNewSchedule && <NewScheduleDialog onClose={() => setShowCreateNewSchedule(false)} />}

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={errorMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
      >
        <SnackbarContent
          className={classes.errorMessage}
          message={errorMessage}
          action={
            <Button color="inherit" size="small" onClick={() => setErrorMessage("")}>
              Hide
            </Button>
          }
        />
      </Snackbar>

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={successMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <SnackbarContent
          className={classes.successMessage}
          message={successMessage}
          action={
            <Button color="inherit" size="small" onClick={() => setSuccessMessage("")}>
              Hide
            </Button>
          }
        />
      </Snackbar>

      {visibleCrewId !== undefined && (
        <Box className={classes.printBox} display="none" displayPrint="block">
          <PrintCrewPage id={visibleCrewId} />
        </Box>
      )}

      {visibleScheduleId !== undefined && (
        <Box className={classes.printBox} display="none" displayPrint="block">
          <PrintSchedulePage id={visibleScheduleId} />
        </Box>
      )}
    </div>
  );
};

export default App;
