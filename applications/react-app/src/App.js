import SignedUrl from "./signedURL"
import "@cloudscape-design/global-styles/index.css"
import Header from "@cloudscape-design/components/header";

import {
    AppLayout,
    BreadcrumbGroup,
    ContentLayout,
    Flashbar,
    HelpPanel,
    Link,
    SideNavigation
} from "@cloudscape-design/components";
import React from "react";
import SpaceBetween from "@cloudscape-design/components/space-between";


function App() {
    return (
        <AppLayout
            breadcrumbs={
                <BreadcrumbGroup
                    items={[
                        {text: 'Home', href: '#'},
                        {text: 'Single Signed URL', href: '#'},
                    ]}
                />
            }
            navigationOpen={false}
            navigationHide={true}
            navigation={
                <SideNavigation
                    header={{
                        href: '#',
                        text: 'Service name',
                    }}
                    items={[{type: 'link', text: `Page #1`, href: `#`}]}
                />
            }
            notifications={<Flashbar items={[]}/>}
            toolsOpen={false}
            toolsHide={true}
            tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
            content={
                <ContentLayout
                    header={
                        <Header variant="h1" info={<Link variant="info">Info</Link>}>
                            Single Signed URL
                        </Header>
                    }
                >
                    <SpaceBetween size="s">
                        <SignedUrl />
                        
                    </SpaceBetween>
                </ContentLayout>
            }
        />

    );
}

export default App;
