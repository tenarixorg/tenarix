import styled from "styled-components";

export const Container = styled.div<{
  bg: string;
  scrollColor: string;
  padding?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: ${(p) => p.bg};
  overflow-y: scroll;
  height: 100vh;
  padding: ${(p) => p.padding || "0px"};
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 6px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollColor};
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollColor};
  }
`;

export const Txt = styled.p<{
  pointer?: boolean;
  fs: string;
  bold?: boolean;
  color: string;
  margin?: string;
  padding?: string;
}>`
  cursor: ${(p) => (p.pointer ? "pointer" : "default")};
  margin: ${(p) => p.margin || "0px"};
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "600" : "normal")};
  color: ${(p) => p.color};
  width: fit-content;
`;

export const Grid = styled.div<{ margin?: string; bg?: string }>`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  justify-items: center;
  background-color: ${(p) => p.bg || "transparent"};
  margin: ${(p) => p.margin || "0px"};
  z-index: 2;
  @media (max-width: 850px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Head = styled.div`
  padding: 0px 5%;
  width: 100%;
  margin: 6px 0px 0px 0px;
  border-bottom: 1px solid #b4b4b434;
  @media (max-width: 850px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Loading = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
`;

export const GenderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25%;
`;

export const Main = styled.div<{ width: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${(p) => p.width};
  align-items: center;
`;

export const ChaptersHeader = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 8px 10px;
  margin: 5px 0px 0px 0px;
  border-bottom: 1px solid #b4b4b434;
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  background-color: ${(p) => p.bg};
  width: 100%;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  padding: 0px 20px;
`;

export const ChaptersContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;
  padding: 10px 10px 20px 10px;
  background-color: ${(p) => p.bg};
`;

export const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
`;

export const Pagination = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

export const BtnAni = styled.button<{ right?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: transform 400ms ease-in-out;
  &:hover {
    transform: translateX(${(p) => (p.right ? "5px" : "-5px")});
  }
`;

export const ReadNav = styled.div`
  position: sticky;
  top: calc(50% - 22px);
  left: 0;
  width: 92%;
  height: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
`;

export const ReadImg = styled.img`
  width: 80%;
  margin-top: 10px;
`;
