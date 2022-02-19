/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoutineExercise, ESet } from '../types/exercise'
import { ExerciseState, State } from '../types/state'

const initialState = { value: undefined, open: false }

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    setExercise: (state: ExerciseState, action: PayloadAction<RoutineExercise | undefined>) => {
      state.value = action.payload
    },
    setExerciseModal: (state: ExerciseState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

export const exerciseSelector = (state: State) => state.exercise.value
export const exerciseModalSelector = (state: State) => state.exercise.open

// Action creators are generated for each case reducer function
export const { setExercise, setExerciseModal } = exerciseSlice.actions

export default exerciseSlice.reducer
