import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Container, Fade, Stack } from "@mui/material";
import { MeasuresForm } from "../Partials/MeasuresForm";
import { BasicInfoForm } from "../Partials/BasicInfoForm";
import { ProfileFormHoc } from "../ProfileFormHoc";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/userSlice";
import { FormikProps } from "formik";
import { User } from "../../../types/user";
import { GoalsForm } from "../Partials/GoalsForm";
import { Done } from "../../../icons/done";
import anime from "animejs";
import { DoneOutline } from "../../../icons/DoneOutline";

const steps = [
  {
    label: "Basic details",
    content: BasicInfoForm,
  },
  {
    label: "Tell us your measurments",
    content: MeasuresForm,
  },
  {
    label: "Set your goals",
    content: GoalsForm,
  },
];

const Screening = (props: FormikProps<User>) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFinish = () => {
    props.handleSubmit();
  };

  const animation = () => {
    anime({
      targets: "[class*=doneOutline-]",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: function (el, i) {
        return i * 500;
      },
    });
  };
  React.useEffect(() => {
    if (activeStep === 3) {
      animation();
    }
    return () => {};
  }, [activeStep]);

  return (
    <Container sx={{ pt: 3, pb: 3 }} maxWidth="md">
      <Typography
        component="h4"
        variant="h4"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Tell us about you
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mx: 1 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Fade
                in={true}
                timeout={1000}
                style={{
                  transitionDelay: `100ms`,
                }}
                unmountOnExit
              >
                <Box>{step.content({ ...props })}</Box>
              </Fade>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Done" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
        <Step key={"done"}>
          <StepLabel>Done</StepLabel>
          <StepContent></StepContent>
        </Step>
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - let&apos;s get started!</Typography>
          <Stack
            sx={{
              alignItems: "cetner",
            }}
          >
            <Box sx={{ my: 2 }}>
              <DoneOutline style={{ fontSize: "4em" }} color="primary" />
            </Box>
            <Button
              variant="outlined"
              onClick={handleFinish}
              sx={{ mt: 1, mr: 1 }}
            >
              Finish
            </Button>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Stack>
        </Paper>
      )}
    </Container>
  );
};

export const ScreeningForm = () => {
  const user = useSelector(userSelector);
  const onSubmitSuccess = () => {};
  return ProfileFormHoc({ user, onSubmitSuccess })(Screening);
};
