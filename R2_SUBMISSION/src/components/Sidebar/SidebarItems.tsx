import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ItemsList,
    ItemContainer,
    ItemWrapper,
    ItemName, SideBarProps,
} from "./SidebarStyles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ConstructionIcon from '@mui/icons-material/Construction';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

export const SIDEBAR_DATA = [
    {
        id: 0,
        name: "homepage",
        path: "homepage",
        icon: <HomeOutlinedIcon />,
    },
    {
        id: 1,
        name: "Templates",
        path: "templates",
        icon: <ConstructionIcon />,
    },
    {
        id: 2,
        name: "Meditations",
        path: "meditations",
        icon: <SelfImprovementIcon />,
    },
];

export const SidebarItems = ({ displaySidebar }: SideBarProps) => {
    let active = 0;
    SIDEBAR_DATA.forEach((itemData) => {
        if (window.location.pathname.startsWith('/' + itemData.path)) { active = itemData.id; }
    });
    const [activeItem, setActiveItem] = useState(active);
    // console.log(window.location.pathname)
    return (
        <ItemsList>{
            SIDEBAR_DATA.map((itemData, index) => {
                return (
                    <ItemContainer
                        key={index}
                        onClick={() => setActiveItem(itemData.id)}
                        // Adding active class when the user clicks
                        className={itemData.id === activeItem ? "active" : ""}
                    >
                        <Link to={itemData.path}>
                            <ItemWrapper>
                                {itemData.icon}
                                <ItemName displaySidebar={displaySidebar}>
                                    {itemData.name}
                                </ItemName>
                            </ItemWrapper>
                        </Link>
                    </ItemContainer>
                )
            })
        }
        </ItemsList>
    );
};