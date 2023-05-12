// Children Component
import styled from "styled-components";

export const TopBar = styled.div`
  width: 100%;
  height: 50px;
  background-color: #3e3e3e;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.15px;
  color: #FFFFFF;
`;

export const OutlinedButton = styled.button`
  border: 2px solid white;
  background-color: transparent;
  color: white;
  padding: .5rem;
  border-radius: .3rem;
  font-size: .7rem;
  cursor: pointer;
`;

export const OutlinedButtonLight = styled.button`
  border: 2px solid;
  background-color: #3e3e3e;
  color: white;
  padding: .5rem;
  border-radius: .3rem;
  font-weight: bold;
  font-size: .7rem;
  cursor: pointer;
`;

export const Section = styled.section`
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
`;

export const SectionContent = styled.div`
  margin: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
 /* display:table;*/
  width: 95%;
`;

export const Page = styled.div`
  background-color: #F5F4F0;
  width: 100%;
  height: 100%;
`

export const SnippetText = styled.div`
  font-weight: 400;
  font-size: 15px;
  margin-left: 420px;
  padding: 10px;
`
