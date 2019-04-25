import React from 'react';
import { findDOMNode } from 'react-dom';
import raf from 'raf';
import { CSPConfig, ConfigConsumer, ConfigConsumerProps  } from "../config-provider";
import TransitionEvents from 'css-animation/lib/Event';

let styleForPesudo: HTMLStyleElement | null;

function isHidden(node: HTMLElement): boolean {
  if(process.env.NODE_ENV === 'test') {
    return false;
  }

  return !node || node.offsetParent === null;
}

export default class Wave extends React.Component<{ insertExtraNode?: boolean}> {
  private instance?: {
    cancel: () => void
  }

  private extraNode: HTMLDivElement;
  private clickWaveTimeoutId: number;
  private animationStartId: number;
  private animationStart: boolean = false;
  private destory: boolean = false;
  private csp?: CSPConfig;

  isNotGrey(color: string): boolean {
    const match: string[] | null = (color || "").match(/rgba?\((\d)*, (\d)*, (\d)* (, (\d))?\)/)
    if(match && match[1] && match[2] && match[3]) {
      return !(match[1] === match[2] && match[2] === match[3]);
    }

    return true;
  }

  removeExtraStyleNode() {
    if(styleForPesudo) {
      styleForPesudo.innerHTML = "";
    }
  }

  getAttributeName(): string {
    const { insertExtraNode } = this.props;
    return insertExtraNode ? 'ant-click-animating' : 'ant-click-animating-without-extra-node';
  }

  onTransitionEnd(e: AnimationEvent): void {
    if(!e || e.animationName !== 'fadeEffect') {
      return;
    }

    this.resetEffect(e.target as HTMLElement);
  }

  onTransitionStart(e: AnimationEvent): void {
    if(this.destory) return;

    const node = findDOMNode(node) as HTMLElement;
    if(!e || e.target !== node) {
      return;
    }

    this.resetEffect(node);
  }

  /**
   * @member { function } resetEffect - 设置组件的动画feature为false，清空伪元素内容，移除额外的元素， 清空transitionStartEvent
   * */
  resetEffect(node: HTMLElement): void {
    if(!node || node === this.extraNode || !(node instanceof Element)) {
      return;
    }

    const { insertExtraNode } = this.props;
    const attributeName = this.getAttributeName();
    node.setAttribute(attributeName, 'false');
    this.removeExtraStyleNode();
    if(insertExtraNode && this.extraNode && node.contains(this.extraNode)) {
      node.removeChild(node);
    }

    TransitionEvents.removeStartEventListener(node, this.onTransitionStart);
    TransitionEvents.removeEndEventListener(node, this.onTransitionEnd)
  }

  onClick = (node: HTMLElement, waveColor: string) => {
    if (!node || isHidden(node) || node.className.indexOf('-leave') >= 0) {
      return;
    }
    const { insertExtraNode } = this.props;
    this.extraNode = document.createElement('div');
    const extraNode = this.extraNode;
    extraNode.className = 'ant-click-animating-node';
    const attributeName = this.getAttributeName();
    node.setAttribute(attributeName, 'true');
    // Not white or transparnt or grey
    styleForPesudo = styleForPesudo || document.createElement('style');
    if (
      waveColor &&
      waveColor !== '#ffffff' &&
      waveColor !== 'rgb(255, 255, 255)' &&
      this.isNotGrey(waveColor) &&
      !/rgba\(\d*, \d*, \d*, 0\)/.test(waveColor) && // any transparent rgba color
      waveColor !== 'transparent'
    ) {
      // Add nonce if CSP exist
      if (this.csp && this.csp.nonce) {
        styleForPesudo.nonce = this.csp.nonce;
      }

      extraNode.style.borderColor = waveColor;
      styleForPesudo.innerHTML = `[ant-click-animating-without-extra-node="true"]:after { border-color: ${waveColor}; }`;
      if (!document.body.contains(styleForPesudo)) {
        document.body.appendChild(styleForPesudo);
      }
    }
    if (insertExtraNode) {
      node.appendChild(extraNode);
    }
    TransitionEvents.addStartEventListener(node, this.onTransitionStart);
    TransitionEvents.addEndEventListener(node, this.onTransitionEnd);
  };

  bindAnimationEvent(node: HTMLElement) {
    if (
      !node ||
      !node.getAttribute ||
      node.getAttribute("disabled") ||
      node.className.indexOf("disabled") > 0
    ) {
      return;
    }

    const onClick: EventListenerOrEventListenerObject = (e: MouseEvent) => {
      if((e.target as HTMLElement).tagName === 'INPUT' || isHidden(e.target as HTMLElement)) {
        return;
      }

      this.resetEffect(node);
      const waveColor = getComputedStyle(node).getPropertyValue("border-top-color") ||
        getComputedStyle(node).getPropertyValue("border-color") ||
        getComputedStyle(node).getPropertyValue("background-color");
      this.clickWaveTimeoutId = window.setTimeout(() => { this.onClick(node, waveColor) }, 0);

      raf.cancel(this.clickWaveTimeoutId);
      this.animationStart = true;

      this.animationStartId = raf(() => {
        this.animationStart = false;
      }, 10);
    }

    node.addEventListener('click', onClick, true);

    return {
      cancel: () => {
        node.removeEventListener('click', onClick, true);
      }
    }
  }


  componentDidMount() {
    const node: HTMLElement = findDOMNode(this) as HTMLElement;

    if(node.nodeType !== 1) {
      return;
    }

    this.instance = this.bindAnimationEvent(node) as any;
  }

  componentWillUnmount() {
    if(this.instance) {
      this.instance.cancel();
    }

    if(this.clickWaveTimeoutId) {
      clearTimeout(this.clickWaveTimeoutId);
    }

    this.destory = true;
  }

  renderWave = ({ csp }: ConfigConsumerProps ): React.ReactNode => {
    const { children } = this.props;
    this.csp = csp;

    return children;
  }

  render() {
    return (
      <ConfigConsumer>{ this.renderWave }</ConfigConsumer>
    )
  }
}

