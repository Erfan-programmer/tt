import React from "react";
import TournomentStepLevel from "./TournomentStepLevel";
import TimerTournoment from "./TimerTournoment";

export default function StartMapPage() {
     const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 10);
  return (
    <>
      <TimerTournoment countdownTimestampMs={targetDate.getTime()} />
      <TournomentStepLevel />
    </>
  );
}
