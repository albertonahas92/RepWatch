import React, { FC, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { About } from "../ControlPages/About/About";
import { Terms } from "../ControlPages/Terms/Terms";
import { ControlPage } from "../ControlPages/ControlPage";
import { Privacy } from "../ControlPages/Privacy/Privacy";
import { Contact } from "../ControlPages/Contact/Contact";
import { styled } from "@mui/system";
import { Home } from "../Home/Home";
import { Login } from "../Auth/Login/Login";
import { Register } from "../Auth/Register/Register";
import { useNavigate } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { ExercisesList } from "../ExercisesList/ExercisesList";
import { AddRoutine } from "../AddRoutine/AddRoutine";
import { Box } from "@mui/material";
import { History } from "../History/History";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";

const Wrapper = styled(Box)`
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  margin-bottom: 60px;
`;

const Nav: FC<Props> = function ({
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  loading,
  error,
}) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              signInWithGoogle={signInWithGoogle}
              signInWithFacebook={signInWithFacebook}
              signUp={() => navigate("/register")}
              error={error}
              onSubmit={signInWithEmailAndPassword}
              loading={loading}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onSubmit={createUserWithEmailAndPassword}
              login={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/about"
          element={
            <ControlPage>
              <About />
            </ControlPage>
          }
        />
        <Route
          path="/terms"
          element={
            <ControlPage>
              <Terms />
            </ControlPage>
          }
        />
        <Route
          path="/privacy"
          element={
            <ControlPage>
              <Privacy />
            </ControlPage>
          }
        />
        <Route
          path="/contact"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<ExercisesList />} />
          <Route path="/routine" element={<AddRoutine />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Wrapper>
  );
};

export default Nav;

interface Props {
  signInWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithGoogle?: () => void;
  signInWithFacebook?: () => void;
  signOut?: () => void;
  error?: string;
  loading?: boolean;
}

function RequireAuth() {
  const user = useSelector(userSelector);

  let location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}
