import styled from "styled-components";

export type SideBarProps = {
    displaySidebar: boolean;
}

// Children Component
export const Children = styled.div.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  width: 100%;
  height: 100%;
  margin-left: ${({displaySidebar}) => (displaySidebar ? "12rem" : "5rem")};
  @media (max-width: 468px) {
    margin-left: 5rem;
  }
`;

export const SidebarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
`;

export const SidebarLogoWrapper = styled.div.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: ${({displaySidebar}) =>
          displaySidebar ? "space-between" : "center"};
  align-items: center;
  @media (max-width: 468px) {
    justify-content: center;
  }
`;

export const SidebarLogo = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 468px) {
    display: none;
  }
`;

export const SidebarBrand = styled.span.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  display: ${({displaySidebar}) => (displaySidebar ? "block" : "none")};
  font-size: 1.2rem;
`;

export const SidebarToggler = styled.button.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  cursor: pointer;
  display: ${({displaySidebar}) => (displaySidebar ? "block" : "none")};
  @media (max-width: 468px) {
    display: block;
  }
`;

// SidebarItem styles
export const ItemsList = styled.ul`
  list-style: none;
`;

export const ItemContainer = styled.li`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.25rem;
  border-radius: 0.2rem;
  cursor: pointer;

  &:hover {
    background: #eaeced;
  }

  &.active {
    background-color: #dbe4f3;
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #7c7788;
`;

const Container = styled.div.attrs<{ size: number }, // What is consumed by .attrs()
    { width: number, height: number } // What comes out of .attrs()
    >((props) => {
    return {width: props.size, height: props.size,}
})<{ size: number }> // The outer type
    `
      width: ${props => props.width}px;
      height: ${props => props.width}px;
    `

export const ItemName = styled.span.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  margin-left: ${({displaySidebar}) => (displaySidebar ? "0.5rem" : "0")};
  display: ${({displaySidebar}) => (displaySidebar ? "block" : "none")};
  text-transform: capitalize;
`;

// Sidebar Container
export const SidebarContainer = styled.div.attrs<SideBarProps>(props => {
    return {displaySidebar: props.displaySidebar}
})<SideBarProps>`
  position: fixed;
  left: 0;
  width: ${({displaySidebar}) => (displaySidebar ? "12rem" : "5rem")};
  height: 100%;
  padding: 0.75rem;
  background: #f3f4f4;
  transition: width 350ms ease;
  border-right: 1px solid #d4d8dd;
  overflow-x: hidden;
  ${({displaySidebar}) =>
          displaySidebar && "box-shadow: 8px 0px 12px 0px rgba(0,0,0,0.1)"};

  ${ItemWrapper} {
    justify-content: ${({displaySidebar}) => !displaySidebar && "center"};
  }

  &:hover {
    ${({displaySidebar}) =>
            !displaySidebar && "box-shadow: 8px 0px 12px 0px rgba(0,0,0,0.1)"};
    @media (min-width: 468px) {
      width: ${({displaySidebar}) => !displaySidebar && "12rem"};
      ${SidebarLogoWrapper} {
        justify-content: ${({displaySidebar}) =>
                !displaySidebar && "space-between"};
      }

      ${SidebarBrand} {
        display: ${({displaySidebar}) => !displaySidebar && "block"};
      }

      ${SidebarToggler} {
        display: ${({displaySidebar}) => !displaySidebar && "block"};
      }

      ${ItemWrapper} {
        justify-content: ${({displaySidebar}) =>
                !displaySidebar && "flex-start"};
      }

      ${ItemName} {
        display: ${({displaySidebar}) => !displaySidebar && "block"};
        margin-left: ${({displaySidebar}) => !displaySidebar && "0.5rem"};
      }
    }
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #eaeced;

    &:hover {
      background: #d5e0f3;
    }
  }

  @media (max-width: 468px) {
    width: 5rem;
  }
`;