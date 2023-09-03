import styles from "./Expense.module.css";
import PropTypes from "prop-types";

const AmountsYouOwe = ({ expenses, user, onDeleteOwedItem }) => {
  return (
    <div className={styles.amountsYouOwe}>
      <h2>Settle Your Amount</h2>
      {expenses.length === 0 ? (
        <p>You have nothing to settle.</p>
      ) : (
        <div className={styles.owedDetails}>
          {expenses.map((expense) => (
            <div key={expense.id}>
              {Object.keys(expense.owed).map((customId) => {
                const owedData = expense.owed[customId];
                const userIsDebtor = owedData.some(
                  (owe) => owe.debtor === user
                );

                if (userIsDebtor) {
                  return (
                    <div key={customId}>
                      {owedData.map((owe) => {
                        if (owe.debtor === user) {
                          return (
                            <div key={owe.id} className={styles.oweItem}>
                              {`${
                                owe.debtor === user ? "You" : owe.debtor
                              } owes ${owe.creditor} PKR${owe.amount}`}
                              <button
                                onClick={() =>
                                  onDeleteOwedItem(expense.id, customId, owe.id)
                                }
                                className={styles.settleButton}
                              >
                                Settle
                              </button>
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

export default AmountsYouOwe;

AmountsYouOwe.propTypes = {
  expenses: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
  onDeleteOwedItem: PropTypes.func.isRequired,
};