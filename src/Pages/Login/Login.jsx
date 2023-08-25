import { useState } from "react";
import styles from "../SignUp/SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Bars } from "react-loader-spinner";

const Login = () => {
  const navigate=useNavigate()
  const [buddy, setBuddy] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const formHandler = (e) => {
    e.preventDefault();
    if(buddy.email.length===0 && buddy.password.length===0){
      toast.warning("Please fill in all required fields",{theme:"dark"});
    }
    else{
      setLoading(true)
      signInWithEmailAndPassword(auth, buddy.email, buddy.password) 
      .then(()=>{
        toast.success("Login successful!",{theme:"dark"});
        navigate('/dashboard')
      })
      .catch(()=>{
        toast.error("Invalid Password or Email",{ backgroundColor: "crimson" });
      }).finally(()=>{
        setLoading(false)
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
    <>
      <div className={styles.main}>
        <h1>Welcome. We exist to make expense easier.</h1>
        <h2>Login</h2>
        <form onSubmit={formHandler} className={styles.formStyle}>       
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
          <p>By Creating an Account You agree to be contacted by BillBuddy about this offer as per the BillBuddy Privacy Policy.</p>
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
              <input type="submit" value="Login" className={styles.submitBtn}/>
            </>
          )}
        </form>
        <p>Not using BillBuddy? <Link to='/signUp'>Sign Up</Link></p>
      </div>
    </>
  );
};

export default Login;