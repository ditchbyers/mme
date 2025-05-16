'use client'
import React from "react"

function ThemeProvider(
    {
        children
    }: {
        children: React.ReactNode
    }
) {

    return (
        <div> {children}</div>
    )
}

export default ThemeProvider