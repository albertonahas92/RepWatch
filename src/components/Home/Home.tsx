import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../types/state";
import { RegisterStep2 } from "../Auth/Register/RegisterStep2";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { Landing } from "../Landing/Landing";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Routines } from "../Routines/Routines";
import { ScreeningForm } from "../Profile/Screening/Screening";

export const Home: FC<Props> = function () {
  const user = useSelector((state: State) => state.user.value);
  const navigate = useNavigate();

  return user !== null ? (
    user?.complete ? (
      <Routines />
    ) : (
      <ScreeningForm />
    )
  ) : (
    <Landing login={() => navigate("/login")} />
  );
};

interface Props {}
