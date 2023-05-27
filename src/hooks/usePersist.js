// This is quite similar to a useLocalStorage hook
// We'll use this like a useState hook, but specifically for the 'persist' state

import { useState, useEffect } from "react";

const usePersist = () => {
  // If 'persist' does not exist in our local storage, it will be 'false' initially
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // Side effect - when 'persist' changes, we'll set that value to the local storage
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;
