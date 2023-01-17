import { FieldInputProps } from 'formik';
import { FieldCommonLogic, CommonProps } from './FieldCommonLogic';

interface Props extends CommonProps {
  type?: string;
}

export default function MyTextInput(props: Props) {
  const renderInputElement = (field: FieldInputProps<any>) => (
    <input {...field} {...props} />
  );
  return FieldCommonLogic({
    placeholder: props.placeholder,
    name: props.name,
    label: props.label,
    renderInputElement,
  });
}
