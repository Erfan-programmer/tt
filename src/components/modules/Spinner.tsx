import { BallTriangle } from "react-loader-spinner";

export default function Spinner() {
  return (
    <BallTriangle
      height={100}
      width={100}
      radius={5}
      color="#0c286b"
      ariaLabel="ball-triangle-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
}
