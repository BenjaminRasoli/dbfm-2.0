import { ClipLoader } from "react-spinners";

function Loading({ size }: { size?: number }) {
  return (
    <>
      <ClipLoader color="#2d99ff" size={size} />
    </>
  );
}

export default Loading;
