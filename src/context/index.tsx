import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export const useGlobalContext = () => useContext(GlobalContext)
// add more contexts to this file if needed