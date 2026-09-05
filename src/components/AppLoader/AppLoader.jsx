import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

export default function AppLoader() {
  const isLoadingSiteSettings = useSelector((state) => state.site.isLoadingSiteSettings);

  if (!isLoadingSiteSettings) return null;

  return <Spinner text="Initialisation de l'application..." fullscreen />;
}
