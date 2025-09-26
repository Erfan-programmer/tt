import Box from "@/components/modules/Option/Box";
import { serviceDatas } from "@/data/ServiceDatas";
import React from "react";

export default function OptionBoxes() {
  return (
    <>
      {serviceDatas.map((data) => (
        <Box key={data.id} data={data} />
      ))}
    </>
  );
}
