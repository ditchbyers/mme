import React from "react";
import Header from "./layout-components/header";
import Content from "./layout-components/content";

function LayoutProvider({ children }: { children: React.ReactNode }) {
    return <div>
        <div>
           <Header />
           <Content> {children} </Content>
        </div>
        {children}
    </div>;
}

export default LayoutProvider;