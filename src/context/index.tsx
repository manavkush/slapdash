import { useContext } from "react";
import { GlobalContext } from "./globalContext";

export const useGlobalContext = () => useContext(GlobalContext)
// add more contexts to this file if needed