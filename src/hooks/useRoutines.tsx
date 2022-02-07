import React from "react";
import { useSelector } from "react-redux";
import firebase from "../config";
import { userSelector } from "../store/userSlice";
import { Exercise, RoutineExercise } from "../types/exercise";
import { Routine } from "../types/routine";
import { useConfirm } from "material-ui-confirm";

export const useRoutines = () => {
  const user = useSelector(userSelector);
  const confirm = useConfirm();

  const addRoutine = (routine: Routine) => {
    if (routine.id) {
      return firebase
        .firestore()
        .collection(`users/${user?.uid}/routines`)
        .doc(routine.id)
        .update({
          ...routine,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } else {
      return firebase
        .firestore()
        .collection(`users/${user?.uid}/routines`)
        .add({
          ...routine,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }
  };

  const addRoutineExercise = (routineId: string, exercise: Exercise) => {
    return firebase
      .firestore()
      .collection(`users/${user?.uid}/routines/${routineId}/exercises`)
      .add({
        name: exercise.name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  const deleteRoutine = (id?: string) => {
    confirm({ description: "This action is permanent!" })
      .then(() => {
        firebase
          .firestore()
          .collection(`users/${user?.uid}/routines`)
          .doc(id)
          .delete();
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  return { addRoutine, addRoutineExercise, deleteRoutine };
};
