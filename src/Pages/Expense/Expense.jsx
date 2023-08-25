import styles from "./Expense.module.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, database } from "../../Firebase/firebase";
import { Bars } from "react-loader-spinner";
import { toast } from "react-toastify";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser?.displayName;

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const q = collection(database, "expense");
    const ref = await getDocs(q);
    const allExpenses = ref.docs.map((doc) => doc.data());
    const OweExpense = allExpenses.filter((expense) => {
      return (
        expense.owed &&
        expense.owed[expense.id] &&
        expense.owed[expense.id].some(
          (participant) =>
            participant.debtor === user || participant.creditor === user
        )
      );
    });
    setExpenseData(OweExpense);
    console.log("OweExpense",OweExpense)
    setLoading(false);
  };

  const deleteOwedItem = async (expenseId, id, idToDelete,index) => {
    console.log(index)
    try {
      const expenseRef = doc(database, "expense", id);
      const expenseSnapshot = await getDoc(expenseRef); 
      if (expenseSnapshot.exists()) {
        const expenseData = expenseSnapshot.data();
        console.log(expenseSnapshot)
        const paidAmountCopy = { ...expenseData.owed };
        console.log(paidAmountCopy[expenseId])
        const subExpenseIndex = paidAmountCopy[expenseId].findIndex(
          (item) => item.id === idToDelete
        );
        console.log(subExpenseIndex)
        if (subExpenseIndex !== -1) {
          paidAmountCopy[expenseId].splice(subExpenseIndex, 1);
          console.log(paidAmountCopy,2)
          await updateDoc(expenseRef, {
            owed: paidAmountCopy,
          });
          console.log(321,expenseData)
          setExpenseData((prevSelectedExpense) => {
            const updatedSelectedExpense = [...prevSelectedExpense];
            updatedSelectedExpense[index].owed[expenseId] =
              paidAmountCopy[expenseId];
            return updatedSelectedExpense;
          });
          toast.success("Expense Settled")
          fetchData();
        }
      }
    } catch (error) {
      toast.error("Error deleting owed item:");
      console.log(error)
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Bars
            height="80"
            width="60"
            color="blue"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass="vh-100 d-flex justify-content-center align-items-center"
            visible={true}
          />
        </>
      ) : (
        <>
          <div className={styles.flexContainer}>
            <div className={styles.amountsYouOwe}>
              <h2>Settle Your Amount</h2>
              {expenseData.length === 0 ? (
                <p>You have nothing to settle.</p>
              ) : ( 
                <>
                 {expenseData && expenseData.map((expense,index) => {
                const userIsDebtor = Object.keys(expense.owed).some(
                  (customId) => {
                    const owedData = expense.owed[customId];
                    return owedData.some((owe) => owe.debtor === user);
                  }
                );

                if (userIsDebtor) {
                  return (
                    <div key={expense.id} className={styles.owedDetails}>
                      {Object.keys(expense.owed).map((customId) => {
                        const owedData = expense.owed[customId];
                        return (
                          <div key={customId}>
                            {owedData.map((owe, oweIndex) => {
                              if (owe.debtor === user) {
                                return (
                                  <div
                                    key={oweIndex}
                                    className={styles.oweItem}
                                  >
                                    {`${
                                      owe.debtor === user ? "You" : owe.debtor
                                    } owes ${owe.creditor} PKR${owe.amount}`}
                                    <button
                                      onClick={() =>
                                        deleteOwedItem(
                                          expense.id,
                                          customId,
                                          owe.id,index
                                        )
                                      }
                                      className={styles.settleButton}
                                    >
                                      Settle
                                    </button>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })}
                </>
             )}
            </div>
            <div className={styles.amountsOwedToYou}>
              <h2>Amount Owed to You</h2>
              {expenseData.length === 0 ? (
                <p>No Amount Pending</p>
              ) : ( 
                <>
                    {expenseData && expenseData.map((expense) => {
                const userIsDebtor = Object.keys(expense.owed).some(
                  (customId) => {
                    const owedData = expense.owed[customId];
                    return owedData.some((owe) => owe.creditor === user);
                  }
                );

                if (userIsDebtor) {
                  return (
                    <div key={expense.id} className={styles.owedDetails}>
                      {Object.keys(expense.owed).map((customId) => {
                        const owedData = expense.owed[customId];
                        return (
                          <div key={customId}>
                            {owedData.map((owe, oweIndex) => {
                              if (owe.creditor === user) {
                                return (
                                  <div
                                    key={oweIndex}
                                    className={styles.oweItem}
                                  >
                                    {`${owe.debtor} owes ${
                                      owe.creditor === user
                                        ? "You"
                                        : owe.creditor
                                    } PKR${owe.amount}`}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                }else{
                  return(
                    <><p>No Amount Pending</p></>      
                  )
                }
              })}
                </>)}          
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Expense;
