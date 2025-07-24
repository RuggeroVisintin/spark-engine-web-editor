import React from "react"
import { ReactNode } from "react"

export const withStrictMode = (component: ReactNode) => {
    return <React.StrictMode>
        {component}
    </React.StrictMode>
}