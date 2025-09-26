"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Box from "@mui/material/Box";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 55,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#1A68FF",
      height: ".5rem",
      border: "1px solid white",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#1A68FF",
      height: ".7rem",
      border: "1px solid white",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: ".7rem",
    border: "1px solid white",
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#090D23",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  border: "2px solid white",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: "#090D23",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: "#090D23",
      },
    },
  ],
}));

interface ColorlibStepIconProps extends StepIconProps {
  value?: string;
}

function ColorlibStepIcon(props: ColorlibStepIconProps) {
  const { active, completed, className, value, icon } = props;

  const valueColor = icon === 1 ? "white" : active ? "#65FFD9" : "#888";

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: (
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 19V1.90002C1 1.90002 1.875 1 4.5 1C7.125 1 8.875 2.8 11.5 2.8C14.125 2.8 15 1.9 15 1.9V12.7C15 12.7 14.125 13.6 11.5 13.6C8.875 13.6 7.125 11.8 4.5 11.8C1.875 11.8 1 12.7 1 12.7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    2: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5V18M10 5H6.46429C5.94332 5 5.4437 4.78929 5.07533 4.41421C4.70695 4.03914 4.5 3.53043 4.5 3C4.5 2.46957 4.70695 1.96086 5.07533 1.58579C5.4437 1.21071 5.94332 1 6.46429 1C9.21429 1 10 5 10 5ZM10 5H13.5357C14.0567 5 14.5563 4.78929 14.9247 4.41421C15.293 4.03914 15.5 3.53043 15.5 3C15.5 2.46957 15.293 1.96086 14.9247 1.58579C14.5563 1.21071 14.0567 1 13.5357 1C10.7857 1 10 5 10 5ZM3 10H17V15.8C17 16.9201 17 17.4802 16.782 17.908C16.5903 18.2843 16.2843 18.5903 15.908 18.782C15.4802 19 14.9201 19 13.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V10ZM2.6 10H17.4C17.9601 10 18.2401 10 18.454 9.89101C18.6422 9.79513 18.7951 9.64215 18.891 9.45399C19 9.24008 19 8.96005 19 8.4V6.6C19 6.03995 19 5.75992 18.891 5.54601C18.7951 5.35785 18.6422 5.20487 18.454 5.10899C18.2401 5 17.9601 5 17.4 5H2.6C2.03995 5 1.75992 5 1.54601 5.10899C1.35785 5.20487 1.20487 5.35785 1.10899 5.54601C1 5.75992 1 6.03995 1 6.6V8.4C1 8.96005 1 9.24008 1.10899 9.45399C1.20487 9.64215 1.35785 9.79513 1.54601 9.89101C1.75992 10 2.03995 10 2.6 10Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    3: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5V18M10 5H6.46429C5.94332 5 5.4437 4.78929 5.07533 4.41421C4.70695 4.03914 4.5 3.53043 4.5 3C4.5 2.46957 4.70695 1.96086 5.07533 1.58579C5.4437 1.21071 5.94332 1 6.46429 1C9.21429 1 10 5 10 5ZM10 5H13.5357C14.0567 5 14.5563 4.78929 14.9247 4.41421C15.293 4.03914 15.5 3.53043 15.5 3C15.5 2.46957 15.293 1.96086 14.9247 1.58579C14.5563 1.21071 14.0567 1 13.5357 1C10.7857 1 10 5 10 5ZM3 10H17V15.8C17 16.9201 17 17.4802 16.782 17.908C16.5903 18.2843 16.2843 18.5903 15.908 18.782C15.4802 19 14.9201 19 13.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V10ZM2.6 10H17.4C17.9601 10 18.2401 10 18.454 9.89101C18.6422 9.79513 18.7951 9.64215 18.891 9.45399C19 9.24008 19 8.96005 19 8.4V6.6C19 6.03995 19 5.75992 18.891 5.54601C18.7951 5.35785 18.6422 5.20487 18.454 5.10899C18.2401 5 17.9601 5 17.4 5H2.6C2.03995 5 1.75992 5 1.54601 5.10899C1.35785 5.20487 1.20487 5.35785 1.10899 5.54601C1 5.75992 1 6.03995 1 6.6V8.4C1 8.96005 1 9.24008 1.10899 9.45399C1.20487 9.64215 1.35785 9.79513 1.54601 9.89101C1.75992 10 2.03995 10 2.6 10Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    4: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12V15M10 12C7.58104 12 5.56329 10.2822 5.10002 8M10 12C12.419 12 14.4367 10.2822 14.9 8M15 3H17.75C17.9823 3 18.0985 3 18.1951 3.01921C18.5918 3.09812 18.9019 3.40822 18.9808 3.80491C19 3.90151 19 4.01767 19 4.25C19 4.94698 19 5.29547 18.9424 5.58527C18.7056 6.77534 17.7753 7.70564 16.5853 7.94236C16.2955 8 15.947 8 15.25 8H15H14.9M5 3H2.25C2.01767 3 1.90151 3 1.80491 3.01921C1.40822 3.09812 1.09812 3.40822 1.01921 3.80491C1 3.90151 1 4.01767 1 4.25C1 4.94698 1 5.29547 1.05764 5.58527C1.29436 6.77534 2.22466 7.70564 3.41473 7.94236C3.70453 8 4.05302 8 4.75 8H5H5.10002M10 15C10.93 15 11.395 15 11.7765 15.1022C12.8117 15.3796 13.6204 16.1883 13.8978 17.2235C14 17.605 14 18.07 14 19H6C6 18.07 6 17.605 6.10222 17.2235C6.37962 16.1883 7.18827 15.3796 8.22354 15.1022C8.60504 15 9.07003 15 10 15ZM5.10002 8C5.03443 7.67689 5 7.34247 5 7V2.57143C5 2.03831 5 1.77176 5.09903 1.56612C5.19732 1.36201 5.36201 1.19732 5.56612 1.09903C5.77176 1 6.03831 1 6.57143 1H13.4286C13.9617 1 14.2282 1 14.4339 1.09903C14.638 1.19732 14.8027 1.36201 14.901 1.56612C15 1.77176 15 2.03831 15 2.57143V7C15 7.34247 14.9656 7.67689 14.9 8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <Stack direction="column" alignItems="center" spacing={1}>
      <div
        style={{
          color: valueColor,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    </Stack>
  );
}

interface Milestone {
  name: string;
  icon_path: string;
  min_sales_volume: number;
  tournament_prize_amount: string;
}

interface TournomentStepLevelProps {
  milestones: Milestone[];
  currentSalesVolume: number; 
  startTime: Date;
}

export default function TournomentStepLevel({
  milestones,
  currentSalesVolume,
  startTime, 
}: TournomentStepLevelProps) {
  
  // Logic to calculate the active step based on current sales volume
  const calculateActiveStep = () => {
    let activeStep = 0; // Start at index 0 (the "Start" step)
    
    // Check if the current sales volume reaches any milestone
    // The index starts at 0, so we use (index + 1) for the stepper step number
    milestones.forEach((milestone, index) => {
      if (currentSalesVolume >= milestone.min_sales_volume) {
        activeStep = index + 1; 
      }
    });

    return activeStep;
  };

  const activeStep = calculateActiveStep(); // Use the calculated active step

  const formattedStartDate = startTime
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "."); 

  const steps = ["Start", ...milestones.map((m) => m.name)];
  const values = [
    formattedStartDate,
    // Safely format the prize amount, assuming tournament_prize_amount is a string representing a number
    ...milestones.map((m) => `$ ${parseFloat(m?.tournament_prize_amount).toLocaleString()}`),
  ];
  
  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Box sx={{ overflowX: "auto", width: "100%" }} className="sidebar-item">
        <Stepper
          alternativeLabel
          activeStep={activeStep} // 🔥 UPDATED: Use the calculated activeStep
          connector={<ColorlibConnector />}
          sx={{ minWidth: 600 }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <ColorlibStepIcon {...props} value={values[index]} />
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "white !important",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Stack>
  );
}