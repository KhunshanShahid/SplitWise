import Home from "../Pages/Home/Home";
import SignUp from "../Pages/SignUp/SignUp";
import Login from "../Pages/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Expense from "../Pages/Expense/Expense";
import ExpenseDetails from "../Pages/ExpenseDetails/ExpenseDetails";
import PrivateRoutes from "../Routes/PrivateRoutes";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import WrongRoute from "../Pages/ErrorPage/WrongRoute";
import ProtectedRoutes from "./ProtectedRoutes";
import { Route, Routes } from "react-router-dom";

const Routing = () => {
  return (
    <>
      <Routes onError={<ErrorPage />}>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<ProtectedRoutes Comp={SignUp} />} />
        <Route path="/login" element={<ProtectedRoutes Comp={Login} />} />
        <Route
          path="/dashboard"
          catchError={<ErrorPage />}
          element={<PrivateRoutes Comp={Dashboard} />}
        />
        <Route path="/expense" element={<PrivateRoutes Comp={Expense} />} />
        <Route
          path="/expenseDetails"
          element={<PrivateRoutes Comp={ExpenseDetails} />}
        />
        <Route path="*" element={<WrongRoute />} />
      </Routes>
    </>
  );
};

export default Routing;
