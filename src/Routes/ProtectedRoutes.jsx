import { useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes(props) {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react/prop-types
  const { Comp } = props;
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUser(true);
      } else {
        auth.signOut();
        setIsUser(false);
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }
  return isUser ? <Navigate to="/dashboard" /> : <Comp />;
}
