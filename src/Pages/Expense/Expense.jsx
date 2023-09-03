import styles from "./Expense.module.css";
import AmountsYouOwe from "./AmountOwed";
import AmountsOwedToYou from "./AmountCredited";
import { useEffect, useState } from "react";
import { auth} from "../../Firebase/firebase";
import { Bars } from "react-loader-spinner";
import { toast } from "react-toastify";
import { deleteExpenseItem, fetchUserExpenses } from "../../../util/FirebaseApi";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser?.displayName;

  const fetchData = async () => {
    try {
      setLoading(true);
      const userExpenses = await fetchUserExpenses(user);
      setExpenseData(userExpenses);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching expenses ");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const deleteOwedItem = async (expenseId, idToDelete) => {
    try {
      const updatedExpenseData = await deleteExpenseItem(expenseId, idToDelete);
      setExpenseData(updatedExpenseData);
      toast.success("Expense Settled");
    } catch (error) {
      toast.error("Error deleting owed item");
    }
  };

  return (
    <>
    {loading ? (
      <Bars
        height="80"
        width="60"
        color="blue"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass="vh-100 d-flex justify-content-center align-items-center"
        visible={true}
      />
    ) : (
      <div className={styles.flexContainer}>
        <AmountsYouOwe
          expenses={expenseData}
          user={user}
          onDeleteOwedItem={deleteOwedItem}
        />
        <AmountsOwedToYou expenses={expenseData} user={user} />
      </div>
    )}
  </>
  );
};

export default Expense;