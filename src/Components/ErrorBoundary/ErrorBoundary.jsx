import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    render() {
      if (this.state.hasError) {
        return <ErrorPage />;
      } 
      // eslint-disable-next-line react/prop-types
      return this.props.children;
    }
  }
  export default ErrorBoundary