"use client"

import { useState, useCallback, useRef } from "react"

interface AsyncOperationState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

export function useAsyncOperation<T>() {
    const [state, setState] = useState<AsyncOperationState<T>>({
        data: null,
        loading: false,
        error: null,
    })

    const abortControllerRef = useRef<AbortController | null>(null)

    const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
        // Cancel previous operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        setState((prev) => ({ ...prev, loading: true, error: null }))

        try {
            const result = await asyncFunction()

            // Check if operation was aborted
            if (abortControllerRef.current?.signal.aborted) {
                return
            }

            setState({
                data: result,
                loading: false,
                error: null,
            })

            return result
        } catch (error: any) {
            if (error.name === "AbortError") {
                return
            }

            setState((prev) => ({
                ...prev,
                loading: false,
                error: error.message || "An error occurred",
            }))

            throw error
        }
    }, [])

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setState({
            data: null,
            loading: false,
            error: null,
        })
    }, [])

    return {
        ...state,
        execute,
        reset,
    }
}
