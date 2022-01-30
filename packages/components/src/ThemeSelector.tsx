import React from "react";
import Select from "react-dropdown-select";
import styled from "styled-components";
import { SelectItem } from "types";
import { SearchBox } from "./SearchBox";
import { BaseTheme } from "types";

interface Props {
  values: SelectItem[];
  options: SelectItem[];
  colors: BaseTheme;
  onChange: (values: string[] | object) => void;
  placeholder: string;
  loading?: boolean;
}

const StyledSelect = styled(Select)<{ borderColor: string }>`
  .react-dropdown-select-dropdown {
    overflow: initial;
    width: 100%;
    border: none;
    outline: none;
  }

  .react-dropdown-select-dropdown-handle {
    svg {
      fill: ${(p) => p.borderColor};
    }
  }

  border: none !important;
  outline: none !important;
  box-shadow: none !important;

  &::before {
    position: absolute;
    content: "";
    bottom: 5%;
    width: 100%;
    height: 1px;
    background-color: ${(p) => p.borderColor};
    opacity: 1;
    transition: opacity 400ms ease-in-out;
  }

  &[aria-expanded="true"] {
    &::before {
      opacity: 1;
    }
  }
`;

export const ThemeSelector: React.FC<Props> = (props) => {
  return (
    <div style={{ margin: "0px 0px", width: "99%" }}>
      <StyledSelect
        borderColor={props.colors.primary}
        searchable
        values={props.values}
        options={props.options}
        loading={props.loading}
        onChange={(values) => {
          props.onChange(values);
        }}
        contentRenderer={() => (
          <div style={{ cursor: "pointer", color: props.colors.fontPrimary }}>
            {props.values[0]?.label || ""}
          </div>
        )}
        dropdownRenderer={({
          state: { search },
          methods: { setSearch, addItem },
        }) => {
          const regexp = new RegExp(search, "i");
          return (
            <Container
              borderColor={props.colors.navbar.background}
              scrollColor={props.colors.primary}
              bg={props.colors.background1}
            >
              <SearchAndToggle>
                <SearchBox
                  m="10px 0px 5px 0px"
                  colors={props.colors}
                  value={search}
                  onChange={setSearch}
                  placeholder={props.placeholder}
                />
              </SearchAndToggle>
              <Items>
                {props.options
                  .filter((item) => regexp.test(item.label))
                  .map((option) => (
                    <Item
                      key={option.value}
                      bg={props.colors.secondary + "70"}
                      selected={
                        !!props.values.find((u) => u.value === option.value)
                      }
                      onClick={() => addItem(option)}
                    >
                      <ItemLabel color={props.colors.fontPrimary}>
                        {option.label}
                      </ItemLabel>
                    </Item>
                  ))}
              </Items>
            </Container>
          );
        }}
      />
    </div>
  );
};

const Container = styled.div<{
  scrollColor: string;
  bg: string;
  borderColor: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${(p) => p.bg};
  align-items: flex-start;
  overflow-y: scroll;
  scroll-behavior: smooth;
  border: 1px solid ${(p) => p.borderColor};
  width: 100%;
  ::-webkit-scrollbar {
    width: 4px;
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

const SearchAndToggle = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Items = styled.div`
  min-height: 10px;
  max-height: 200px;
  width: 100%;
  margin: 5px 0px;
  padding: 0px 5px;
`;

const Item = styled.div<{ selected?: boolean; bg: string }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  background-color: ${(p) => (p.selected ? p.bg : "transparent")};
`;

const ItemLabel = styled.div<{ color: string }>`
  margin: 5px 10px;
  color: ${(p) => p.color};
`;
