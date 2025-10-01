import { BounceLoader } from "react-spinners";

function Loading({ size }: { size?: number }) {
  return (
    <>
      <BounceLoader size={size} color="#2d99ff" />
    </>
  );
}

export default Loading;
