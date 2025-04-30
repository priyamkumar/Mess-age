import { Skeleton } from "@mui/material";
import { cloneElement } from "react";

export default function ChatLoading() {
  function generate(element) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) =>
      cloneElement(element, {
        key: value,
      })
    );
  }

  return (
    <div className="p-3">
      {generate(
      <Skeleton width={210} height={80} />)}
    </div>
  );
}
