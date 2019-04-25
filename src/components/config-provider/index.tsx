import React from 'react';
import createReactContext, { Context } from '../utils/create-react-context';
import defaultRenderEmpty, { RenderEmptyHandler } from './renderEmpty';

export interface CSPConfig {
  nonce?: string;
}

export interface ConfigConsumerProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  renderEmpty: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
}

export interface ConfigProviderProps {
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
}

export const ConfigContext: Context<ConfigConsumerProps | null> = createReactContext<ConfigConsumerProps | null>({
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if(customizePrefixCls) return customizePrefixCls;

    return `wjc-${suffixCls}`
  },
  renderEmpty: defaultRenderEmpty
})

export const ConfigConsumer = ConfigContext.Consumer;

class ConfigProvider extends React.Component<ConfigProviderProps> {

  constructor(props: ConfigProviderProps) {
    super(props)
  }

  getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    const { prefixCls = 'wjc' } = this.props;

    if(customizePrefixCls) return customizePrefixCls;

    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  };

  renderProvider = (context: ConfigConsumerProps) => {
    const { children, getPopupContainer, renderEmpty, csp, autoInsertSpaceInButton } = this.props;

    const config: ConfigConsumerProps = {
      ...context,
      getPrefixCls: this.getPrefixCls,
      csp,
      autoInsertSpaceInButton,
    }

    if(getPopupContainer) {
      config.getPopupContainer = getPopupContainer;
    }

    if(renderEmpty) {
      config.renderEmpty = renderEmpty;
    }

    return <ConfigContext.Provider value={config} >{children}</ConfigContext.Provider>
  }

  render() {
    return <ConfigConsumer>{this.renderProvider}</ConfigConsumer>
  }

}

// =========================== withConfigConsumer ===========================
// We need define many types here. So let's put in the block region
type IReactComponent<P = any> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;



interface BasicExportProps {
  prefixCls?: string;
}

interface ConsumerConfig {
  prefixCls: string;
}

interface ConstructorProps {
  displayName?: string;
}

export function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig) {
  return function<ComponentDef>(Component: IReactComponent): React.FunctionComponent<ExportProps> & ComponentDef {

    const SFC = ((props: ExportProps) => (
      <ConfigConsumer>
        {(configProps: ConfigConsumerProps) => {
          const { prefixCls: basicPrefixCls } = config;
          const { getPrefixCls } = configProps;
          const { prefixCls: customizePrefixCls } = props;
          const prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
          return <Component {...configProps} {...props} prefixCls={prefixCls}/>
        }}
      </ConfigConsumer>
    )) as React.FunctionComponent<ExportProps> & ComponentDef;

    const cons: ConstructorProps = Component.constructor as ConstructorProps;
    const name = (cons && cons.displayName) || Component.name || 'Component';

    SFC.displayName = `withConfigConsumer(${name})`;

    return SFC;

  }
}

export default ConfigProvider;

