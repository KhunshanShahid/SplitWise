import logo from "../../assets/logo.png";
import Modal from "react-modal";
import styles from "./Navbar.module.css";

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { auth } from "../../Firebase/firebase";
import { Bars } from "react-loader-spinner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [buddyName, setBuddyName] = useState("User");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setBuddyName(user);
        setIsLogged(true);
        setLoader(false);
      } else {
        auth.signOut();
        setIsLogged(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logOutHandle = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    auth.signOut();
    navigate("/");
    setIsLogged(false);
    setShowModal(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent static-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="..." height="52" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse fs-5"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto">
            {isLogged ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="bg-primary"
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="bg-primary"
                    to="/expense"
                  >
                    Expenses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="bg-primary"
                    to="/expenseDetails"
                  >
                    Expense Details
                  </NavLink>
                </li>
                <li className="nav-item dropdown m-auto d-flex align-items-center">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <p className="mb-0 m-auto">
                      {loader ? (
                        <>
                          <Bars
                            height="30"
                            width="30"
                            color="blue"
                            ariaLabel="bars-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                          />
                        </>
                      ) : (
                        <>
                          {buddyName.displayName}{" "}
                          <CgProfile size={28} color="white" />
                        </>
                      )}
                    </p>
                  </a>
                  <ul className="dropdown-menu bg-primary">
                    <li className="nav-link text-center" onClick={logOutHandle}>
                      Logout
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="bg-primary"
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item bg-primary">
                  <NavLink
                    className="nav-link"
                    activeClassName="bg-primary"
                    to="/signUp"
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Logout Confirmation"
        className={styles.customModal}
        overlayClassName={styles.customOverlay}
      >
        <h4>Are you sure you want to logout?</h4>
        <button onClick={confirmLogout} className={styles.customButton}>
          Logout
        </button>
        <button
          onClick={() => setShowModal(false)}
          className={styles.customButton}
        >
          Cancel
        </button>
      </Modal>
    </nav>
  );
};

export default Navbar;