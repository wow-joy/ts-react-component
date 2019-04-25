import React, { Component } from "react";
import ReactDOM from "react-dom";
// import style from "./pop.css";
import pubSub from "../pubSub";
import styled from "styled-components";
import { render } from "react-dom";
/**
 *  抛出组件到指定dom
 *  @param component 指定组件
 *
 *  二级参数
 *  @param {className} 组件包裹的样式
 *  @param {container} 指定输出容器， 默认为body
 *  @param {layer} 有无蒙层
 *  @param {autoClose} 自动关闭的等候时间
 *  @param {onClose} 关闭事件句柄，`return false` 可以阻止关闭事件
 *
 *  @returns {  show, hide, destroy }
 */

const Wrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;
const Layer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 1000;
  ${props =>
    props.layer
      ? `background: rgba(0, 0, 0, 0.6);pointer-event:all`
      : `background: rgba(0, 0, 0, 0);pointer-event:none`};
`;
class PopWrap extends Component {
  render() {
    const { className, layer = true, closeHandle, children } = this.props;
    const Main = <Wrap>{children}</Wrap>;

    return layer ? (
      <Layer layer={layer} className={className} onClick={closeHandle}>
        {Main}
      </Layer>
    ) : (
      Main
    );
  }
}

const pop = Component =>
  function({
    className,
    container = document.body,
    layer,
    autoClose,
    onClose
  }) {
    const popDisplayDom = document.createElement("div");
    popDisplayDom.style.transition = "0.3s";
    container.appendChild(popDisplayDom);
    const transitionendCallbacks = new pubSub(); // 动画回调 @returns {add, remove, clear, publish}
    popDisplayDom.addEventListener(
      "transitionend",
      transitionendCallbacks.publish
    );

    const eventHandle = {
      show() {
        popDisplayDom.style.display = "block";
        transitionendCallbacks.clear();
        setTimeout(() => (popDisplayDom.style.opacity = 1));
      },
      hide() {
        if (onClose && onClose() === false) {
          return false;
        }
        transitionendCallbacks.add(
          () => (popDisplayDom.style.display = "none")
        );
        popDisplayDom.style.opacity = 0;
      },
      destroy() {
        if (this.hide() === false) {
          return false;
        }
        const destroy = () => {
          ReactDOM.unmountComponentAtNode(popDisplayDom);
          popDisplayDom.parentNode.removeChild(popDisplayDom);
        };
        transitionendCallbacks.add(destroy);
        eventHandle.hide();
      }
    };

    render(
      <PopWrap
        {...{
          container,
          className,
          layer
        }}
        closeHandle={eventHandle.hide}
      >
        {Component}
      </PopWrap>,
      popDisplayDom
    );
    if (autoClose) {
      setTimeout(eventHandle.hide, autoClose);
    }
    return {
      ...eventHandle
    };
  };

export default pop;
