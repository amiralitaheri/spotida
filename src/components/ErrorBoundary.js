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
        try {
            window.gtag('event', 'exception', {
                'description': `${error.toString()}\n${errorInfo.componentStack}`,
                'fatal': true
            });
        } catch (e) {
            console.log('Failed to send event to google analytics');
        }
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage message='Sorry an unexpected error happened, We will look into it.'/>;
        }

        return this.props.children;
    }
}