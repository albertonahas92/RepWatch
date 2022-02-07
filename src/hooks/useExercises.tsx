import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { exercisesSelector, setExercises } from "../store/exercisesSlice";
import * as data from "../exercises.json";
import firebase from "../config";
import { Exercise, RoutineExercise } from "../types/exercise";
import { setExercise, setExerciseModal } from "../store/exerciseSlice";

export const useExercises = () => {
  // const { data, error, isError, isLoading } = useQuery(
  //   "exercise",
  //   fetchExercises
  // );

  // async function fetchExercises() {
  //   const { data } = await axios.get(
  //     "https://wger.de/api/v2/exercise/?limit=419&offset=0"
  //   );
  //   const arrayUniqueByKey = [
  //     ...new Map(
  //       data.results.map((item: any) => [item["name"], item])
  //     ).values(),
  //   ];
  //   return arrayUniqueByKey;
  // }

  const completeExercises = useSelector(exercisesSelector);
  const [exercises, setExercisesList] = useState(completeExercises);
  const [equipments, setEquipments] = useState<string[]>();
  const [muscles, setMuscles] = useState<string[]>();

  const [term, setTerm] = useState("");
  const [equipmentsFilter, setEquipmentsFilter] = useState<string[]>();
  const [musclesFilter, setMusclesFilter] = useState<string[]>();

  const dispatch = useDispatch();

  useEffect(() => {
    // add all exercises from JSON
    firebase
      .firestore()
      .collection("exercises")
      .get()
      .then((sub) => {
        if (sub.docs.length === 0) {
          const db = firebase.firestore();
          const exercises1 = [...data.exercises];
          const exercises2 = exercises1.splice(499);

          const batch = db.batch();
          exercises1.forEach((ex: Exercise) => {
            const docRef = db.collection(`exercises`).doc();
            batch.set(docRef, ex);
          });
          batch.commit();

          const batch2 = db.batch();
          exercises2.forEach((ex: Exercise) => {
            const docRef = db.collection(`exercises`).doc();
            batch2.set(docRef, ex);
          });
          batch2.commit();
        }
      });
  }, []);

  useEffect(() => {
    setExercisesList(completeExercises);
    setEquipments(
      Array.from(new Set(completeExercises?.map((e) => e.equipment || "")))
    );
    setMuscles(
      Array.from(
        new Set(completeExercises?.flatMap((e) => e.primaryMuscles || ""))
      )
    );
  }, [completeExercises]);

  useEffect(() => {
    setExercisesList(
      completeExercises?.filter(
        (e) =>
          (!term || e.name.toLowerCase().match(term.toLowerCase())) &&
          (!musclesFilter ||
            !musclesFilter.length ||
            e.primaryMuscles?.some((m) => musclesFilter.includes(m))) &&
          (!equipmentsFilter ||
            !equipmentsFilter.length ||
            equipmentsFilter.includes(e.equipment || ""))
      )
    );
  }, [term, musclesFilter, equipmentsFilter]);

  useEffect(() => {
    dispatch(setExercises(data.exercises as any));
  }, [data]);

  return {
    exercises,
    term,
    setTerm,
    equipments,
    muscles,
    equipmentsFilter,
    setEquipmentsFilter,
    musclesFilter,
    setMusclesFilter,
  };
  // return { fetchExercises, data };
};
