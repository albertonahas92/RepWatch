/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Exercise } from '../types/exercise'
import { State } from '../types/state'

const initialState = {}

export const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises: (state: any, action: PayloadAction<{ value: Exercise[] | undefined }>) => {
      state.value = action.payload
    },
  },
})

export const exercisesSelector = (state: State) => state.exercises.value

// Action creators are generated for each case reducer function
export const { setExercises } = exercisesSlice.actions

export default exercisesSlice.reducer
