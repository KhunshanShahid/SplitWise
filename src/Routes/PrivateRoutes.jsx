import { useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import { Navigate } from "react-router-dom";

export default function PrivateRoutes(props) {
    const { Comp }=props
    const [isUser,setisUser]=useState(true)
    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
              setisUser(true);
          } else {
            auth.signOut();
            setisUser(false);
          }
        });
        return () => unsubscribe();
    },[])
    return isUser ? <Comp/> : <Navigate to="/login" />;
}
