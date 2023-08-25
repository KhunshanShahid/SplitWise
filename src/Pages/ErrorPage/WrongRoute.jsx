import { Link } from "react-router-dom"
import styles from './ErrorPage.module.css'

const WrongRoute = () => {
  return (
   <>
    <div className={`d-flex flex-column justify-content-center align-items-center w-100 text-white ${styles.custom}`}>
      <h2>Wrong Page</h2>
      <h3>Its Not You Its Us</h3>
      <h3>The Page You are looking for could not be found</h3>
      <Link to="/">Back to the Homepage</Link>
    </div>
   </>
  )
}

export default WrongRoute
