/* eslint-disable no-debugger */
import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import "./App.css";
import withFirebaseAuth from "react-with-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import firebase, { getToken, onMessageListener } from "./config";
import { TopBar } from "./components/TopBar/TopBar";
import { User } from "./types/user";
import { State } from "./types/state";
import { SplashScreen } from "./molecules/SplashScreen/SplashScreen";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { setServerUser } from "./store/userSlice";
import Nav from "./components/Nav/Nav";
import { useAnalytics } from "./hooks/useAnalytics";
import { AppTabs } from "./components/AppTabs/AppTabs";
import ModalDialog from "./molecules/ModalDialog/ModalDialog";
import { Workout } from "./components/Workout/Workout";
import { usePwa } from "./hooks/usePwa";
import { useAuthRedirect } from "./hooks/useAuthRedirect";
import {
  setRoutineModal,
  routineModalSelector,
  routineSelector,
  setRoutine,
} from "./store/routineSlice";
import { Alert, Box, Fab, Snackbar, Zoom } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRoutine } from "./hooks/useRoutine";
import {
  exerciseModalSelector,
  exerciseSelector,
  setExerciseModal,
} from "./store/exerciseSlice";
import { ExerciseDetails } from "./components/ExerciseDetails/ExerciseDetails";
import { ColorModeContext } from "./components/Providers/Providers";
import { alertSelector, setAlertOpen } from "./store/alertSlice";
import { AlertDialog } from "./molecules/AlertDialog/AlertDialog";
import moment from "moment";
import { useHistory } from "./hooks/useHistory";
import { useLocation } from "react-router";
import { SideDrawer } from "./components/SideDrawer/SideDrawer";
import { FeedbackForm } from "./components/FeedbackForm/FeedbackForm";
import { feedbackSelector, setFeedback } from "./store/feedbackSlice";
import { setSnackbar, snackbarSelector } from "./store/snackbarSlice";

const firebaseAppAuth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/user.birthday.read");

const facebookProvider = new firebase.auth.FacebookAuthProvider();

const providers = {
  googleProvider,
  facebookProvider,
};

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
});

const App = function ({
  /** These props are provided by withFirebaseAuth HOC */
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // signInWithGithub,
  // signInWithTwitter,
  // signInAnonymously,
  signOut,
  // setError,
  user,
  error,
  loading,
}: Props) {
  const currentUser = useSelector((state: State) => state.user.value);
  const routine = useSelector(routineSelector);
  const exercise = useSelector(exerciseSelector);
  const snackbar = useSelector(snackbarSelector);

  const { signOutUser } = useCurrentUser();
  const { handleInstallClick, deferredPrompt } = usePwa();
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const { authError } = useAuthRedirect();
  const { saveRoutine } = useRoutine();
  const history = useHistory();
  const location = useLocation();

  const [notification, setNotification] = useState({ title: "", body: "" });
  const openWorkoutModal = useSelector(routineModalSelector);
  const openExerciseModal = useSelector(exerciseModalSelector);
  const openFeedbackModal = useSelector(feedbackSelector);
  const alertWidget = useSelector(alertSelector);

  const signInWithGoogle = () => {
    analytics.submitRecord("login with google attempt");
    firebase.auth().signInWithRedirect(googleProvider);
  };

  const signInWithFacebook = () => {
    analytics.submitRecord("login with facebook attempt");
    firebase.auth().signInWithRedirect(facebookProvider);
  };

  const initNotificationListener = () => {
    onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
      })
      .catch((err) => console.log("failed: ", err));
  };

  useEffect(() => {
    async function initUser() {
      try {
        if (user && user.uid) {
          const messagingToken = await getToken();
          if (messagingToken) {
            user.messagingToken = messagingToken;
          }
          dispatch(setServerUser(user));
          initNotificationListener();
        } else if (user === null) {
          signOutUser();
        }
      } catch (error) {
        alert(error);
      }
    }
    initUser();
  }, [user]);

  const signOutFromApp = () => {
    signOut?.();
    signOutUser();
  };

  useEffect(() => {
    if (routine && routine.active && !openWorkoutModal) {
      dispatch(setRoutineModal(true));
    } else if (!routine && openWorkoutModal) {
      dispatch(setRoutineModal(false));
    }
    try {
      if (routine) {
        localStorage.setItem("routine", JSON.stringify(routine));
      } else {
        localStorage.removeItem("routine");
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }, [routine]);

  const onFinishWorkout = () => {
    saveRoutine()?.then((doc) => {
      const id = doc?.id;
      dispatch(setRoutine({ ...routine, done: true, id }));
    });
  };

  const handleSnackbarClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar({ open: false, message: "" }));
  };

  // const Nav: any = lazy(() => import('./components/Nav/Nav'));

  return currentUser === undefined ? (
    <SplashScreen />
  ) : (
    <Box sx={{ bgcolor: "background.paper" }}>
      <TopBar
        handleInstallClick={handleInstallClick}
        signOut={signOutFromApp}
        deferredPrompt={deferredPrompt}
        notification={notification}
        setNotification={setNotification}
      />
      <Nav
        createUserWithEmailAndPassword={createUserWithEmailAndPassword}
        error={error}
        loading={loading}
        signInWithEmailAndPassword={signInWithEmailAndPassword}
        signInWithGoogle={signInWithGoogle}
        signInWithFacebook={signInWithFacebook}
        signOut={signOutFromApp}
      />
      {/* <Footer /> */}
      <AppTabs />
      <SideDrawer signOut={signOutFromApp} />
      <ModalDialog
        closeButton={true}
        open={openWorkoutModal || false}
        setOpen={(open) => {
          dispatch(setRoutineModal(open));
        }}
        title={
          routine?.name ||
          `${moment(routine?.startedAt).format("ddd Do")} Workout`
        }
      >
        <Workout onFinish={onFinishWorkout} />
      </ModalDialog>
      <ModalDialog
        closeButton={true}
        open={openExerciseModal || false}
        setOpen={(open) => {
          dispatch(setExerciseModal(open));
        }}
        title={exercise?.name}
      >
        <ExerciseDetails exercise={exercise} />
      </ModalDialog>
      <ModalDialog
        closeButton={true}
        open={openFeedbackModal || false}
        setOpen={(open) => {
          dispatch(setFeedback(open));
        }}
        title={"Feedback"}
      >
        <FeedbackForm />
      </ModalDialog>
      <AlertDialog
        title={alertWidget.title}
        message={alertWidget.message}
        open={alertWidget.open || false}
        setOpen={(open: boolean) => dispatch(setAlertOpen(open))}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.type} sx={{ bottom: "72px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {routine && routine.active && (
        <Zoom
          in={true}
          timeout={200}
          style={{
            transitionDelay: `100ms`,
          }}
          unmountOnExit
        >
          <Fab
            sx={{
              position: "absolute",
              bottom: 110,
              left: 0,
              right: 0,
              mx: "auto",
            }}
            color="primary"
            onClick={() => {
              dispatch(setRoutineModal(true));
            }}
          >
            <PlayArrowIcon />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

interface Props {
  signInWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithGoogle?: () => Promise<any>;
  signInWithFacebook?: () => Promise<any>;
  // signInWithGithub: PropTypes.object,
  // signInWithTwitter: PropTypes.object,
  // signInAnonymously: PropTypes.object,
  signOut?: () => Promise<any>;
  // setError: PropTypes.object,
  user?: User;
  error?: string;
  loading?: boolean;
}

export default createComponentWithAuth(App);
