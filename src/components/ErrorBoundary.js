import React from "react";
import ErrorPage from "../pages/ErrorPage";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        window.ga('send', 'exception', {
            'exDescription': `${error.toString()}\n${errorInfo.componentStack}`,
            'exFatal': true
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage message='Sorry an unexpected error happened, We will look into it.'/>;
        }

        return this.props.children;
    }
}