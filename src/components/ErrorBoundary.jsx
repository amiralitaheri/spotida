import React from "react";
import {captureException} from "@sentry/react";
import ErrorPage from "../pages/ErrorPage";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        captureException(error);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage message='Sorry an unexpected error happened, We will look into it.'/>;
        }

        return this.props.children;
    }
}