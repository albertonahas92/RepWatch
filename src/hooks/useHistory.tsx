import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebase from "../config";
import { userSelector } from "../store/userSlice";
import { Exercise, RoutineExercise } from "../types/exercise";
import { RoutineHistory } from "../types/routine";

export const useHistory = () => {
  const user = useSelector(userSelector);
  const [history, setHistory] = useState<RoutineHistory[]>();

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/history`)
      .orderBy("finishedAt", "desc")
      .onSnapshot((querySnapshot: any) => {
        let routinesArr: any[] = [];
        querySnapshot.forEach((doc: any) => {
          routinesArr.push({ id: doc.id, routine: doc.data() });
        });
        setHistory(routinesArr);
      });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { history };
};
