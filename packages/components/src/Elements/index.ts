import styled from "styled-components";

export const Container = styled.div<{
  bg: string;
  scrollColor: string;
  padding?: string;
  noScroll?: boolean;
  dragger?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: ${(p) => p.bg};
  height: calc(100vh - 44px);
  padding: ${(p) => p.padding || "0px"};
  ${(p) =>
    !p.noScroll
      ? `overflow-y: scroll;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;

  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${p.scrollColor};
    border-radius: 30px;
    height: 50px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${p.scrollColor};
  }
  `
      : ""};

  ${(p) => (p.dragger ? "-webkit-app-region: drag;" : "")};
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

export const Description = styled.p<{
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
  overflow: hidden;
  width: 100%;
  max-height: 200px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
`;

export const Grid = styled.div<{ margin?: string; bg?: string }>`
  display: grid;
  grid-gap: 10px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto;
  justify-items: center;
  background-color: ${(p) => p.bg || "transparent"};
  margin: ${(p) => p.margin || "0px"};
  z-index: 2;
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
  max-height: 450px;
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
  width: 300px;
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
  z-index: 10;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 300px);
  padding: 0px 20px;
`;

export const ChaptersContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;
  padding: 0px 0px 0px 10px;
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
  -webkit-app-region: no-drag;
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

export const ReadImg = styled.img<{ width: string }>`
  width: ${(p) => p.width};
  transition: width 400ms ease-in-out;
`;

export const Opts = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 20px 0px 10px 0px;
`;

export const Check = styled.input<{
  bg: string;
  activeColor: string;
  inactiveColor: string;
}>`
  position: relative;
  margin: 0px 5px;
  appearance: none;
  border: none;
  outline: none;
  border: 1px solid black;

  width: 32px;
  height: 16px;
  background-color: ${(p) => p.bg};
  border-radius: 10px;
  &:checked {
    &::after {
      transform: translateX(calc(200% - 6px));
      background-color: ${(p) => p.activeColor};
    }
  }
  &::after {
    position: absolute;
    content: "";
    top: 2px;
    left: 3px;
    width: 10px;
    height: 10px;
    background-color: ${(p) => p.inactiveColor};
    border-radius: 50%;
    transition: transform 400ms ease-in-out, background-color 400ms ease-in-out;
  }
`;

export const Header2 = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 0px 0px 10px;
  font-weight: 600;
`;

export const SSection = styled.div`
  display: grid;
  grid-template-columns: 220px calc(100% - 220px);
  grid-template-rows: auto;
  width: 100%;
  background-color: red;
  height: 100vh;
`;

export const SSourceContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background-color: ${(p) => p.bg};
`;

export const SBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 2%;
  right: 2%;
`;

export const SBtn = styled.button<{
  margin: string;
  bg: string;
  hc: string;
  borderColor: string;
}>`
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 50%;
  z-index: 100;
  width: 36px;
  height: 36px;
  margin: ${(p) => p.margin};
  background-color: transparent;
  border: 2px solid ${(p) => p.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(p) => p.hc};
  }
`;

export const SPanel = styled.div<{ bg: string; scrollBg: string }>`
  background-color: ${(p) => p.bg};
  height: 100vh;
  width: 100%;
  padding: 10px 10px 40px 10px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 2px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollBg};
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollBg};
  }
`;

export const Setting = styled.div<{ noBorder?: boolean }>`
  border-top: ${(p) => (p.noBorder ? "0" : "1")}px solid #333333b9;
  width: 100%;
  margin: 10px 0px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-top: ${(p) => (p.noBorder ? "0px" : "10px")};
`;

export const SettingOpt = styled.button<{ hc: string; selected?: boolean }>`
  border: none;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: 30px;
  margin-top: 10px;
  padding: 0px 10px;
  border-radius: 5px;
  background-color: ${(p) => (p.selected ? p.hc : "transparent")};
  &:hover {
    background-color: ${(p) => p.hc};
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 15px;
  font-weight: 500;
`;

export const CP = styled.div<{ rot?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  transition: transform 400ms ease-in-out;

  transform: rotate(${(p) => (p.rot ? "0" : "90")}deg);
`;

export const CustomScroll = styled.div<{ scrollColor: string }>`
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollColor};
    border-radius: 30px;
    height: 40px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollColor};
  }
`;

export const Fav = styled.button`
  position: absolute;
  top: 22px;
  left: calc(100% - 50px);
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  z-index: 12;
  cursor: pointer;
  transition: transform 300ms ease-in-out;
  &:hover {
    transform: translateY(-2px);
  }
`;

export const Div = styled.div<{
  direction?: "row" | "column";
  bg?: string;
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
  align?: "center" | "flex-start" | "flex-end";
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  zIndex?: number;
  borderRadius?: string;
}>`
  display: flex;
  flex-direction: ${(p) => p?.direction || "row"};
  justify-content: ${(p) => p?.justify || "flex-start"};
  align-items: ${(p) => p?.align || "flex-start"};
  background-color: ${(p) => p?.bg || "transparent"};
  width: ${(p) => p?.width || "fit-content"};
  height: ${(p) => p?.height || "auto"};
  padding: ${(p) => p?.padding || "0px"};
  margin: ${(p) => p?.margin || "0px"};
  z-index: ${(p) => p?.zIndex || "0"};
  border-radius: ${(p) => p?.borderRadius || "0px"};
`;

export const Progress = styled.progress<{
  width?: string;
  height?: string;
  bg?: string;
  progressColor?: string;
  borderRadis?: string;
  value: string;
  color?: string;
  fs?: string;
}>`
  width: ${(p) => p?.width || "100%"};
  height: ${(p) => p?.height || "20px"};
  outline: none;
  border: none;
  appearance: none;
  -webkit-appearance: none;
  border-radius: ${(p) => p?.borderRadis || "10px"};
  &::-webkit-progress-bar {
    background-color: ${(p) => p?.bg || "transparent"};
    border-radius: ${(p) => p?.borderRadis || "10px"};
  }
  &::-webkit-progress-value {
    background-color: ${(p) => p?.progressColor || "transparent"};
    border-radius: ${(p) => p?.borderRadis || "10px"};
  }

  &::after {
    font-size: ${(p) => p?.fs || "10px"};
    color: ${(p) => p?.color || "transparent"};
    content: "${(p) => p?.value || "0"}%";
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-${(p) => p?.height || "20px"});
  }
`;
