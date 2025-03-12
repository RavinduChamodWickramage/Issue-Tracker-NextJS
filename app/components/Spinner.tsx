import React from "react";

const Spinner = () => {
  return (
    <div
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-gray-300 border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    ></div>
  );
};

export default Spinner;
