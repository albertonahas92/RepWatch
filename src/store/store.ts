import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exercisesReducer from './exercisesSlice';
import routineReducer from './routineSlice';
import exerciseReducer from './exerciseSlice';
import alertReducer from './alertSlice';
import historyReducer from './historySlice';
import drawerReducer from './drawerSlice';
import snackbarReducer from './snackbarSlice';
import feedbackReducer from './feedbackSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        exercises: exercisesReducer,
        routine: routineReducer,
        exercise: exerciseReducer,
        alert: alertReducer,
        history: historyReducer,
        drawer: drawerReducer,
        snackbar: snackbarReducer,
        feedback: feedbackReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
