import "react-toastify/dist/ReactToastify.css";
import { database } from "../../Firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AuthForm from "../../Components/AuthForm/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmail, isStrongPassword, isAlpha } from "validator";
import {
  createFirebaseUser,
  setFirebaseUserData,
  updateFirebaseUserProfile,
} from "../../../util/FirebaseApi";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const formHandler = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (buddy.name && buddy.email && buddy.password) {
      const checkEmail = query(
        collection(database, "users"),
        where("name", "==", buddy.name)
      );
      const getFriendsdata = await getDocs(checkEmail);
      if (!getFriendsdata.empty) {
        toast.warning("Username already exists");
        isValid = false;
      }
      if (!isEmail(buddy.email)) {
        toast.warning("Please enter a valid email");
        isValid = false;
      }
      if (!isAlpha(buddy.name)) {
        toast.warning("Name should only contain letters");
        isValid = false;
      }
      if (!isStrongPassword(buddy.password)) {
        toast.warning(
          "Password should be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols"
        );
        isValid = false;
      }
      if (isValid) {
        try {
          setLoading(true);
          const user = await createFirebaseUser(buddy.email, buddy.password);
          const currentUserId = user.uid;
          await setFirebaseUserData(currentUserId, buddy.name, buddy.email);
          await updateFirebaseUserProfile(user, buddy.name);
          toast.success("Account Created Successfully!");
          setBuddy({
            name: "",
            email: "",
            password: "",
          });
          navigate("/dashboard");
        } catch (error) {
          toast.error(error.message);
          console.error("Authentication error:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (buddy.name.length <= 4) {
        toast.warning("Name should have more than 4 characters");
      } else {
        toast.warning("Please fill in all required fields");
      }
    }
  };

  const dataHandler = (e) => {
    setBuddy((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <AuthForm
        title="Create Account"
        onSubmit={formHandler}
        buddy={buddy}
        dataHandler={dataHandler}
        loading={loading}
      >
        <p>
          Already using BillBuddy? <Link to="/login">Login</Link>
        </p>
      </AuthForm>
    </>
  );
};

export default SignUp;