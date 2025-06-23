import React from "react";
import { DotLoader, ScaleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-99999 flex w-full items-center justify-center bg-black/50">
      <DotLoader size={50} color="#36d7b7" loading={true} speedMultiplier={1} />
    </div>
  );
}
