import { useRouter } from "next/router";
import { getStorage } from "./storage";

const PrivateRoutes = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const accessToken = getStorage("access_token");

      if (!accessToken) {
        Router.replace("/login");
        return null;
      }
      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default PrivateRoutes;
