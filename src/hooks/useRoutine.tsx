import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { routineSelector, setRoutine } from "../store/routineSlice";
import firebase from "../config";
import { Routine } from "../types/routine";
import { userSelector } from "../store/userSlice";
import _ from "lodash";
import { omitExerciseKeys, RoutineExercise } from "../types/exercise";

export const useRoutine = () => {
  const routine = useSelector(routineSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const saveRoutine = () => {
    if (!routine) return;
    const _routine = {
      ..._.omit(routine, ["exercises", "active"]),
      date: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const exercises = routine.exercises
      ?.map((e) => _.omit(e, omitExerciseKeys) as RoutineExercise)
      .map((e) => {
        return { ...e, date: firebase.firestore.FieldValue.serverTimestamp() };
      });

    return firebase
      .firestore()
      .collection(`users/${user?.uid}/history`)
      .add(_routine)
      .then((doc) => {
        const id = doc.id;
        saveRoutineExercises(id, exercises || []).then((res) => {});
      });
  };

  useEffect(() => {
    if (!routine || !routine.id || routine?.exercises) {
      return;
    }

    const unsubscribe = firebase
      .firestore()
      .collection(`users/${user?.uid}/routines/${routine.id}/exercises`)
      .orderBy("index", "asc")
      .onSnapshot((querySnapshot: any) => {
        let exercises: any[] = [];
        querySnapshot.forEach((doc: any) => {
          exercises.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (exercises.length > 0) {
          const completeRoutine: Routine = {
            ...routine,
            exercises,
          };
          dispatch(setRoutine(completeRoutine));
        }
      });
    return () => {
      unsubscribe();
    };
  }, [routine]);

  const saveRoutineExercises = (
    routineId: string,
    exercises: RoutineExercise[]
  ) => {
    var db = firebase.firestore();
    var batch = db.batch();
    exercises.forEach((exercise: RoutineExercise) => {
      var docRef = db
        .collection(`users/${user?.uid}/history/${routineId}/exercises`)
        .doc(); //automatically generate unique id
      batch.set(docRef, exercise);
    });
    return batch.commit();
  };

  return { saveRoutine };
};
