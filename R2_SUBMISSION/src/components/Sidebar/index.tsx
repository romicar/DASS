import React, { useState } from "react";

import {
    Children,
    SidebarContainer,
    SidebarWrapper,
    SidebarLogoWrapper,
    SidebarLogo,
    SidebarBrand,
} from "./SidebarStyles";
import BrandLogo from "./logo.png";
import { SidebarItems } from "./SidebarItems";
import { useParams } from "react-router-dom";

const MOBILE_VIEW = window.innerWidth < 468;

export interface SidebarProps {
    children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps): JSX.Element {
    const [displaySidebar, setDisplaySidebar] = useState(!MOBILE_VIEW);

    /*const handleSidebarDisplay = (e) => {
        e.preventDefault();
        if (window.innerWidth > 468) {
            setDisplaySidebar(!displaySidebar);
        } else {
            setDisplaySidebar(false);
        }
    };*/
    return (
        <React.Fragment>
            <div></div>
            <SidebarContainer displaySidebar={displaySidebar}>
                <SidebarWrapper>
                    <SidebarLogoWrapper displaySidebar={displaySidebar}>
                        {/* Logo wrapper starts */}
                        <SidebarLogo href="#">
                            <span className="app-brand-logo demo">
                                <img src={BrandLogo} alt="Brand logo" width={"50px"} />
                            </span>
                            <SidebarBrand
                                displaySidebar={displaySidebar}
                                className="app__brand__text"
                            >
                                Atom EI
                            </SidebarBrand>
                        </SidebarLogo>
                        {/* Logo wrapper ends */}
                        {/* Toggle button */}
                        {/*<SidebarToggler
                            displaySidebar={displaySidebar}
                            onClick={handleSidebarDisplay}
                        >
                            <div className="outer__circle">
                                <div className="inner__circle" />
                            </div>
                        </SidebarToggler>*/}
                    </SidebarLogoWrapper>
                    {/* Render the SidebarItems component */}
                    <SidebarItems displaySidebar={displaySidebar} />
                </SidebarWrapper>
            </SidebarContainer>
            {/* Render the children */}
            <Children displaySidebar={displaySidebar}>{children}</Children>
        </React.Fragment>
    );
}