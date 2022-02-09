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
import { Box, Fab, Zoom } from "@mui/material";
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

  const { signOutUser } = useCurrentUser();
  const { handleInstallClick, deferredPrompt } = usePwa();
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const { authError } = useAuthRedirect();
  const { saveRoutine } = useRoutine();

  const [notification, setNotification] = useState({ title: "", body: "" });
  const openWorkoutModal = useSelector(routineModalSelector);
  const openExerciseModal = useSelector(exerciseModalSelector);
  const alert = useSelector(alertSelector);

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
  }, [routine]);

  const onFinishWorkout = () => {
    saveRoutine();
    dispatch(setRoutine({ ...routine, done: true }));
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
      <AlertDialog
        title={alert.title}
        message={alert.message}
        open={alert.open || false}
        setOpen={(open: boolean) => dispatch(setAlertOpen(open))}
      />
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
