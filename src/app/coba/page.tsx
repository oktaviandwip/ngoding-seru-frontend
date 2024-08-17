import React from "react";

export default function page() {
  (function () {
    return typeof arguments;
  })();

  const arr = [1, 2, 3, 4];
  const result = arr.map((x) => x * 2);
  console.log(result);

  return <div>page</div>;
}
