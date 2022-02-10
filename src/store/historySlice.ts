/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoutineExercise, Set } from '../types/exercise'
import { Routine, RoutineHistory, Workout } from '../types/routine'
import { HistoryState, RoutineState, State } from '../types/state'

const initialState = { value: undefined, open: false }

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state: HistoryState, action: PayloadAction<RoutineHistory[] | undefined>) => {
      state.value = action.payload
    },
  },
})

export const historySelector = (state: State) => state.history.value
export const routineModalSelector = (state: State) => state.routine.open

// Action creators are generated for each case reducer function
export const { setHistory } = historySlice.actions

export default historySlice.reducer
