import { useContext } from "react"
import SettingsContext from "../context/SettingsProvider"

const useSettingsTitle = () => {
    return useContext(SettingsContext);
}

export default useSettingsTitle;