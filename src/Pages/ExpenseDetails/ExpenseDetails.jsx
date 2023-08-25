import Modal from "react-modal";
import styles from "./ExpenseDetails.module.css";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, database } from "../../Firebase/firebase";
import { Bars } from "react-loader-spinner";

const ExpenseDetails = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [expenseDetail, setExpenseDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const user = auth.currentUser?.displayName;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const q = collection(database, "expense");
      const ref = await getDocs(q);
      const allExpenses = ref.docs.map((doc) => doc.data());
      // const filteredExpense = allExpenses.filter((expense) => {
      //   return (
      //     expense.owed &&
      //     expense.owed[expense.id] &&
      //     expense.owed[expense.id].some(
      //       (participant) =>
      //         participant.debtor === user || participant.creditor === user
      //     )
      //   );
      // });

    const filteredExpense = allExpenses.filter((expense) => {
      const hasOwedData = expense.owed?.[expense.id]?.some(
        (participant) => participant.debtor === user
      );

      const hasParticipantsData = expense.participants?.some(
        (participant) => participant.label === user
      );

      return hasOwedData || hasParticipantsData;
    });

      setExpenseData(filteredExpense);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleExpenseData = (expense) => {
    setExpenseDetail(expense);
    setshowModal(true);
  };

  return (
    <>
      {loading ? (
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <Bars height={80} width={60} color="blue" ariaLabel="bars-loading" visible={true} />
        </div>
      ) : (
        <>
          {expenseData.length > 0 ? (
            expenseData.map((expense) => {
              const isUserOwe = expense.owed[expense.id].some(
                (owe) => owe.debtor === user
              );
              return (
                <div
                  onClick={() => {
                    handleExpenseData(expense);
                  }}
                  key={expense.id}
                  className={`${styles.expenseItem} ${
                    isUserOwe ? "" : styles.noOweBackground
                  }`}
                >
                  <div className={styles.expenseDescription}>
                    {expense.description}
                  </div>
                  <div className={styles.expenseAmount}>
                    {expense.TotalAmount}
                  </div>
                  <div className={styles.owedDetails}>
                    {isUserOwe ? (
                      expense.owed[expense.id].map((owe) => (
                        <div key={owe.oweID} className={styles.oweItem}>
                          {owe.debtor === user &&
                            `You owe ${owe.creditor} PKR ${owe.amount}`}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noOweMessage}>
                        You don&#39;t owe anything in this expense
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="text-white h-100">No Expense To Show</h3>
          )}

          <Modal
            isOpen={showModal}
            onRequestClose={() => setshowModal(false)}
            contentLabel="Logout Confirmation"
            className={styles.customModal}
            overlayClassName={styles.customOverlay}
          >
            <div>Expense Created by: {expenseDetail.creator}</div>
            <div>
              <h4>Description: {expenseDetail.description}</h4>
              <h4>Date:{expenseDetail.date ? expenseDetail.date : "23-08-2023"}</h4>
              {expenseDetail.participants ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Order</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseDetail.participants.map((user) => {
                        return (
                          <tr key={user.id} className="text-white">
                            <td>{user.label}</td>
                            <td>{user.order}</td>
                            <td>{user.paid}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  Split Equally ==&gt; Paid By:{" "}
                  <strong>{expenseDetail.paidBy && expenseDetail.paidBy.label}</strong>
                </>
              )}
              <div>
                <img src={expenseDetail.image} className="w-25 mt-3" alt="...Expense" />
              </div>
            </div>
            <button
              onClick={() => {
                setshowModal(false);
              }}
            >
              Close
            </button>
          </Modal>
        </>
      )}
    </>
  );
};

export default ExpenseDetails;