import React from "react";
import quote from "../../assets/hero-image-01.webp";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.mainText}>
        <h3>BillBuddy</h3>
        <h5>
          Effortless expense collaboration starts here, powered by your
          dependable BillBuddy.
        </h5>
        <p>
          BillBuddy redefines shared expense collaboration. Seamlessly powered
          by its dependable support, BillBuddy revolutionizes the way you manage
          costs together. No more complexities or confusion – just streamlined
          sharing and effortless tracking. With BillBuddy, simplify your
          financial teamwork and enjoy a smoother journey towards shared
          financial goals.
        </p>
      </div>
      <div>
        <img src={quote} className={styles.mainImg} />
      </div>
    </div>
  );
}

const MemoizedHome = React.memo(Home);
export default MemoizedHome;