import styles from './ErrorPage.module.css'

const ErrorPage = () => {
  return (
   <>
    <div className={`d-flex flex-column justify-content-center align-items-center w-100 text-white ${styles.custom}`}>
      <h2>Error 404</h2>
      <h3>Its Not You Its Us</h3>
      <h3>We Will be Back Soon, Try Later</h3>
    </div>
   </>
  )
}

export default ErrorPage
