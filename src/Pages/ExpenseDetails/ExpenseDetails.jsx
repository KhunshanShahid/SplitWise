import Modal from "react-modal";
import styles from "./ExpenseDetails.module.css";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase";
import { Bars } from "react-loader-spinner";
import { toast } from "react-toastify";
import { fetchUserExpenses } from "../../../util/FirebaseApi";

const ExpenseDetails = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [expenseDetail, setExpenseDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = auth.currentUser?.displayName;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userExpenseDetails = await fetchUserExpenses(user);
        setExpenseData(userExpenseDetails);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching expense details: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleExpenseData = (expense) => {
    setExpenseDetail(expense);
    setShowModal(true);
  };

  return (
    <>
      {loading ? (
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <Bars
            height={80}
            width={60}
            color="blue"
            ariaLabel="bars-loading"
            visible={true}
          />
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
            onRequestClose={() => setShowModal(false)}
            contentLabel="Expense Details"
            className={styles.customModal}
            overlayClassName={styles.customOverlay}
          >
            {expenseDetail && (
              <div>
                <h4>Expense Created by: {expenseDetail.creator}</h4>
                <div>
                  <h4>Description: {expenseDetail.description}</h4>
                  <h4>Total Bill: {expenseDetail.totalAmount}</h4>
                  <h4>
                    Date:
                    {expenseDetail.date ? expenseDetail.date : "23-08-2023"}
                  </h4>
                  {expenseDetail.participants ? (
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            {expenseDetail.participants[0]?.order !==
                              undefined && <th>Order</th>}
                            {expenseDetail.participants[0]?.paid !==
                              undefined && <th>Paid</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {expenseDetail.participants.map((user) => {
                            return (
                              <tr key={user.id} className="text-white">
                                <td>{user.label}</td>
                                {user.order !== undefined && (
                                  <td>{user.order}</td>
                                )}
                                {user.paid !== undefined && (
                                  <td>{user.paid}</td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      Split Equally ==&gt; Paid By:{" "}
                      <strong>
                        {expenseDetail.paidBy && expenseDetail.paidBy.label}
                      </strong>
                    </>
                  )}

                  <div>
                    <img
                      src={expenseDetail.image}
                      className="w-25 mt-3"
                      alt="...Expense"
                    />
                  </div>
                </div>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default ExpenseDetails;