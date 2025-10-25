import type { TextEditorProps } from '@/types';

import TextEditor from '@/pages/TextEditor';

import './styles.css';

type Props = Pick<TextEditorProps,
  | 'errorClassName' |
  'inputClassName' |
  'labelClassName' |
  'rootClassName' |
  'tabClassName' |
  'tabsClassName' |
  'toolbarClassName' |
  'value' |
  'error'
>;

const CustomStyles = ({
  errorClassName,
  inputClassName,
  labelClassName,
  rootClassName,
  tabClassName,
  tabsClassName,
  toolbarClassName,
  value,
  error,
}: Props) => {
  return (
    <TextEditor
      error={error}
      errorClassName={errorClassName}
      id="custom-global-styles"
      inputClassName={inputClassName}
      label="Custom Styled Editor"
      labelClassName={labelClassName}
      placeholder="This editor uses custom global styles"
      rootClassName={rootClassName}
      tabClassName={tabClassName}
      tabsClassName={tabsClassName}
      toolbarClassName={toolbarClassName}
      value={value}
    />
  );
};

export default CustomStyles;
