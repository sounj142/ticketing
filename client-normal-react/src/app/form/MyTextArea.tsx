import { FieldInputProps } from 'formik';
import { FieldCommonLogic, CommonProps } from './FieldCommonLogic';

interface Props extends CommonProps {
  rows?: number;
  cols?: number;
}

export default function MyTextArea(props: Props) {
  const renderInputElement = (field: FieldInputProps<any>) => (
    <textarea {...field} {...props}></textarea>
  );
  return FieldCommonLogic({
    placeholder: props.placeholder,
    name: props.name,
    label: props.label,
    renderInputElement,
  });
}
