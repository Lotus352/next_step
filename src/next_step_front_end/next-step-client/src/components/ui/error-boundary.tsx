"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    resetError = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
            }

            return (
                <Card className="max-w-md mx-auto mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Something went wrong
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={this.resetError} variant="outline" size="sm" className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button onClick={() => window.location.reload()} size="sm">
                                Refresh Page
                            </Button>
                        </div>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-4">
                                <summary className="text-xs text-muted-foreground cursor-pointer">Error Details</summary>
                                <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">{this.state.error.stack}</pre>
                            </details>
                        )}
                    </CardContent>
                </Card>
            )
        }

        return this.props.children
    }
}
