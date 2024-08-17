import React from "react";

export default function page() {
  console.log(
    (function () {
      return typeof arguments;
    })()
  );
  return <div></div>;
}
