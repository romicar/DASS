import styled from "styled-components";

export const TemplateInfoForm = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
  font-family: "Sen";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;

  overflow: hidden;
`;

export const RowTR = styled.tr`
  width: 100%;
`;

export const ColTDLabel = styled.td`
  padding: 10px;
  padding-right: 30px;
  margin: 10px;
  min-width: 200px;
`;

export const ColTD = styled.td`
  padding: 20px;
`;

export const TemplateNameInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #c6c6c6;
  font-size: 15px;
  width: 100%;
  &:focus {
    background: #eaeced;
    border: 2px solid black;
  }
`;

export const TechniqueBox = styled.span`
  background-color: #e8e8e4;
  border: 2px solid: #e8e8e4;
  padding: 10px;
  margin-right: 10px;
  border-radius: 10px;
  cursor: default;
  padding-left: 20px;
  padding-right: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  &.activeTechnique {
    border: 2px solid black;
    font-weight: 600;
  }
`;

export const DSBox = styled.span`
  background-color: white;
  border: 2px solid white;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 10px;
  border-radius: 10px;
  cursor: default;
  font-weight: 400;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  &.activeDSbox {
    border: 2px solid black;
    font-weight: 600;
  }
  &.notexistDSbox {
    border: 2px solid white;
    font-weight: 400;
    opacity: 0.5;
  }
  &.active_notexistDSbox {
    border: 2px solid black;
    font-weight: 400;
    opacity: 0.5;
  }
`;

export const DSInfoBox = styled.div`
  margin: 30px;
  margin-top: 0px;
  margin-left: 5%;
`;

export const Line = styled.div`
  width: 95%;
  height: 2px;
  background-color: rgba(153, 153, 153, 0.25);
  border-radius: 1px;
  margin-top: 0;
`;

export const MidLabel = styled.label`
  font-weight: 600;
`;

export const AddButton = styled.button`
  font-weight: 500;
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
  padding: 5px;
  padding-right: 30px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  flex: row;
  margin: 0;
  justify-content: center;

  &:hover {
    background-color: #e3e3e3;
  }

  &:active {
    background-color: #d4d4d4;
  }
`;

export const BlackButton = styled.button`
  font-weight: 500;
  background-color: Black;
  color: white;
  border-radius: 5px;
  padding: 10px;
  border: 2px solid black;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: 15px;
  &:hover {
    background-color: white;
    color: black;
    border: 2px solid black;
  }

  &:active {
    background-color: #d4d4d4;
  }
`;

export const BlackButton2 = styled.button`
  font-weight: 500;
  background-color: Black;
  color: white;
  border-radius: 5px;
  padding: 5px;
  border: 2px solid black;
  padding-left: 40px;
  padding-right: 40px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  &:hover {
    background-color: white;
    color: black;
    border: 2px solid black;
  }

  &:active {
    background-color: #d4d4d4;
  }
`;

export const TransButton = styled.button`
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0);
  color: black;
  border-radius: 5px;
  padding: 10px;
  border: 2px solid black;
  padding-left: 40px;
  padding-right: 40px;
  margin: 5px;
  &:hover {
    background-color: black;
    color: white;
  }

  &:active {
    background-color: #3d3d3d;
    border: 2px solid #3d3d3d;
  }
`;

export const InputBox = styled.input`
  min-width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 0.3rem;
  padding: 6px;
  border: 1px solid #3e3e3e;
  font-size: 1rem;
  color: #3e3e3e;
`;

export const IconDelete = styled.span`
  cursor: default;
  &:hover {
    color: red;
  }
`;

export const CopyButton = styled.button`
  font-weight: 500;
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  align-items: center;
  margin-left: 15px;
  font-size: 17px;
  &:hover {
    background-color: #e3e3e3;
  }

  &:active {
    background-color: #d4d4d4;
  }

  &.active_notexistCopy {
    border: 2px solid black;
    font-weight: 400;
    opacity: 0.5;
  }
`;

export const CopyLabel = styled.button`
  font-weight: 500;
  background-color: white;
  // border: 2px solid black;
  border-radius: 5px;
  padding: 10px;
  align-items: center;
  margin-left: 15px;
`;
