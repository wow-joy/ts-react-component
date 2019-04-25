const initSetting = {
  defaultStyles: `display: flex;
  flex-direction: column;
  &>nav {
    align-self: baseline;
    display: inline-block;
    position: relative;
    background: #fff;
    border: 1px solid #E8E8E8;
    border-radius: 3px 0 0 3px;
    margin: 30px;
    &>span {
      display: inline-block;
      position: relative;
      padding: 10px 30px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      border-left: 1px solid #E8E8E8;
      color: #666;
      &:first-child {
        border-left: none
      }
      &:global(.active) {
        color: #333;
        background: #f7f7f7;
        transition: 0.5s;
      }
    }
  }`
};
export default initSetting;
