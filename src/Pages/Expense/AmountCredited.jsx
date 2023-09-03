import styles from "./Expense.module.css";
import PropTypes from "prop-types";

const AmountsOwedToYou = ({ expenses, user }) => {
  return (
    <div className={styles.amountsOwedToYou}>
      <h2>Amount Owed to You</h2>
      {expenses.length === 0 ? (
        <p>No Amount Pending</p>
      ) : (
        <div className={styles.owedDetails}>
          {expenses.map((expense) => (
            <div key={expense.id}>
              {Object.keys(expense.owed).map((customId) => {
                const owedData = expense.owed[customId];
                const userIsCreditor = owedData.some(
                  (owe) => owe.creditor === user
                );
                if (userIsCreditor) {
                  return (
                    <div key={customId}>
                      {owedData.map((owe) => {
                        if (owe.creditor === user) {
                          return (
                            <div key={owe.id} className={styles.oweItem}>
                              {`${owe.debtor} owes ${
                                owe.creditor === user ? "You" : owe.creditor
                              } PKR${owe.amount}`}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmountsOwedToYou;

AmountsOwedToYou.propTypes = {
  expenses: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
};