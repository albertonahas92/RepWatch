/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoutineExercise, Set } from '../types/exercise'
import { Routine } from '../types/routine'
import { RoutineState, State } from '../types/state'

const initialState = { value: undefined, open: false }

export const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    setRoutine: (state: RoutineState, action: PayloadAction<Routine | undefined>) => {
      state.value = action.payload
    },
    updateExercises: (state: RoutineState, action: PayloadAction<RoutineExercise>) => {
      if (state.value) {
        state.value.exercises = state.value.exercises?.map((e) =>
          e.name === action.payload.name ? { ...e, ...action.payload } : e
        )
      }
    },
    updateSet: (state: RoutineState, action: PayloadAction<{ index: number, set: Set, name: string }>) => {
      // if (state.value && state.value.exercises) {
      //   const exercise = state.value.exercises.find(e => e.name === action.payload.name)
      //   if (exercise) {
      //     if (exercise.sets && exercise.sets[action.payload.index]) {
      //       exercise.sets[action.payload.index] = action.payload.set
      //     }
      //   }
      // }

      if (state.value) {
        state.value.exercises = state.value.exercises?.map((e) =>
          e.name === action.payload.name ?
            { ...e, sets: e.sets?.map((s, i) => i === action.payload.index ? action.payload.set : s) } : e
        )
      }
    },
    setRoutineModal: (state: RoutineState, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

export const routineSelector = (state: State) => state.routine.value
export const routineModalSelector = (state: State) => state.routine.open

// Action creators are generated for each case reducer function
export const { setRoutine, updateExercises, updateSet, setRoutineModal } = routineSlice.actions

export default routineSlice.reducer
