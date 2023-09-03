import styles from "./AuthForm.module.css";
import PropTypes from "prop-types";
import { Bars } from "react-loader-spinner";

const AuthForm = ({
  title,
  onSubmit,
  children,
  buddy,
  dataHandler,
  loading,
}) => {
  return (
    <div className={styles.main}>
      <h1>Welcome. We exist to make expense easier.</h1>
      <h2>{title}</h2>
      <form onSubmit={onSubmit} className={styles.formStyle}>
        {title === "Create Account" && (
          <>
            <h4>Name*</h4>
            <input
              type="text"
              name="name"
              value={buddy.name}
              onChange={dataHandler}
              placeholder="Your Full Name"
              className={styles.nameInput}
            />
          </>
        )}
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
          placeholder="Password (At least 8 Characters)"
        />
        {loading ? (
          <Bars
            height={40}
            width={60}
            color="blue"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass="d-flex justify-content-center align-items-center"
            visible={true}
          />
        ) : (
          <input type="submit" value={title} className={styles.submitBtn} />
        )}
        <p>
          By Creating an Account You agree to be contacted by BillBuddy about
          this offer as per the BillBuddy Privacy Policy.
        </p>
      </form>
      {children}
    </div>
  );
};

export default AuthForm;

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
  buddy: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  dataHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
