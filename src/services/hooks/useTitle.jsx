import { useContext } from "react";
import TitleContext from "../context/TitleProvider";

const useTitle = () => {
    return useContext(TitleContext);
}

export default useTitle;