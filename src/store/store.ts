import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import exercisesReducer from './exercisesSlice';
import routineReducer from './routineSlice';
import exerciseReducer from './exerciseSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        exercises: exercisesReducer,
        routine: routineReducer,
        exercise: exerciseReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
