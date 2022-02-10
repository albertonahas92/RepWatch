import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exercisesReducer from './exercisesSlice';
import routineReducer from './routineSlice';
import exerciseReducer from './exerciseSlice';
import alertReducer from './alertSlice';
import historyReducer from './historySlice';

export default configureStore({
    reducer: {
        user: userReducer,
        exercises: exercisesReducer,
        routine: routineReducer,
        exercise: exerciseReducer,
        alert: alertReducer,
        history: historyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
