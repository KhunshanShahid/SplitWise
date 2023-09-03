import AuthForm from "../../Components/AuthForm/AuthForm";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithFirebaseEmailAndPassword } from "../../../util/FirebaseApi";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buddy, setBuddy] = useState({
    email: "",
    password: "",
  });

  const formHandler = async (e) => {
    e.preventDefault();
    if (buddy.email.length === 0 && buddy.password.length === 0) {
      toast.warning("Please fill in all required fields", { theme: "dark" });
    } else {
      setLoading(true);
      await signInWithFirebaseEmailAndPassword(buddy.email, buddy.password);
          toast.success("Login successful!", { theme: "dark" });
          navigate('/dashboard')
        .catch(() => {
          toast.error("Invalid Password or Email", { backgroundColor: "crimson" });
        })
        .finally(() => {
          setLoading(false);
        });
      setBuddy({
        email: "",
        password: "",
      });
    }
  };

  const dataHandler = (e) => {
    setBuddy((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthForm
      title="Login"
      onSubmit={formHandler}
      buddy={buddy}
      dataHandler={dataHandler}
      loading={loading}
    >
      <p>Not using BillBuddy? <Link to='/signUp'>Sign Up</Link></p>
    </AuthForm>
  );
};

export default Login;