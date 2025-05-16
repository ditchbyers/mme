import React from "react";

function Content({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <div>
            {children}
        </div>
    );
    }

export default Content;