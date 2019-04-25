import React from "react";
import styled from "styled-components";
const defaultStyles = `
    &>div:first-child{
      color: #fff;
    }
  `;
const Header = styled.div`
  background: #06aea6;
  color: #fff;
  width: 100%;
  height: 38px;
  line-height: 38px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
`;
const initSetting = {
  defaultStyles: defaultStyles,
  header: Header
};
export default initSetting;
