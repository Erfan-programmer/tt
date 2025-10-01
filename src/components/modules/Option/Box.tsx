import React from "react";
import Style from "@/styles/Option.module.css";
import { serviceDataType } from "@/data/ServiceDatas";
import { useRouter } from "next/navigation";
type BoxPropsType = {
  data: serviceDataType;
};
export default function Box({ data }: BoxPropsType) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (data.id === 1) {
          console.log("data link");
          router.push(`/${data?.link}`);
        } else {
          router.push("");
        }
      }}
      className={`${Style.option_box} w-[15rem] rounded-3xl border-t-[.03rem] border-[#fff] h-[18rem]`}
    >
      <div className="option-box-title mb-10 m-3">
        <h2 className="font-semibold text-white">{data?.title}</h2>
      </div>

      <div className="option-box-desc w-[80%] mx-auto">
        <span className="text-[#888] text-sm">{data?.subTitle}</span>
      </div>
    </div>
  );
}
