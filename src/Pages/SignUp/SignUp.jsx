import { useState } from "react";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../../Firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmail, isStrongPassword, isAlpha } from "validator";
import { Bars } from "react-loader-spinner";

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
    if (buddy.name || (buddy.email && buddy.password)) {
      const checkEmail = query(
        collection(database, "users"),
        where("name", "==", buddy.name)
      );
      const getFriendsdata = await getDocs(checkEmail);
      if (!getFriendsdata.empty) {
        toast.warning("Username already exist");
        isValid = false;
      }
      if (!isEmail(buddy.email)) {
        toast.warning("Please enter a valid email");
        isValid = false;
      }
      if (!isAlpha(buddy.name)) {
        // Use isAlpha to check if the name only contains letters
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
          const res = await createUserWithEmailAndPassword(
            auth,
            buddy.email,
            buddy.password
          );
          const user = res.user;
          const currentUserId = user.uid;
          try {
            const userDocRef = doc(database, "users", currentUserId);
            await setDoc(userDocRef, {
              id: currentUserId,
              name: buddy.name,
              email: buddy.email,
            });
          } catch (dbErr) {
            await user.delete();
            toast.error(
              "An error occurred while registering. Please try again later."
            );
            return;
          } finally {
            setLoading(false);
          }
          await updateProfile(user, { displayName: buddy.name });
          toast.success("Account Created Successfully!");
          setBuddy({
            name: "",
            email: "",
            password: "",
          });
          navigate("/dashboard");
        } catch (authError) {
          toast.error(authError.message);
          console.error("Authentication error:", authError);
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
      <div className={styles.main}>
        <h1>Welcome. We exist to make expense easier.</h1>
        <h2>Create an Account</h2>
        <form onSubmit={formHandler} className={styles.formStyle}>
          <h4>Name*</h4>
          <input
            type="text"
            name="name"
            value={buddy.name}
            onChange={dataHandler}
            placeholder="Your Full Name"
          />
          <h4>Email*</h4>
          <input
            type="email"
            name="email"
            value={buddy.email}
            onChange={dataHandler}
            placeholder="you@company.com"
          />
          <h4>Password*</h4>
          <input
            type="password"
            name="password"
            value={buddy.password}
            onChange={dataHandler}
            placeholder="Password (Atleast 8 Characters)"
          />
          <p>
            By Creating an Account You agree to be contacted by BillBuddy about
            this offer as per the BillBuddy Privacy Policy.
          </p>
          {loading ? (
            <>
              {" "}
              <Bars
                height="40"
                width="60"
                color="blue"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass="d-flex justify-content-center align-items-center"
                visible={true}
              />
            </>
          ) : (
            <>
              <input
                type="submit"
                value="Sign Up"
                className={styles.submitBtn}
              />
            </>
          )}
        </form>
        <p>
          Already using BillBuddy? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default SignUp;
