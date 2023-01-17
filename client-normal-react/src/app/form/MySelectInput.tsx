import { FieldHelperProps, FieldInputProps } from 'formik';
import { Select } from 'semantic-ui-react';
import { FieldCommonLogic, CommonProps } from './FieldCommonLogic';

interface Props extends CommonProps {
  options: {
    text: string;
    value: string;
  }[];
}

export default function MySelectInput(props: Props) {
  const renderInputElement = (
    field: FieldInputProps<any>,
    helpers?: FieldHelperProps<any>
  ) => (
    <Select
      clearable
      options={props.options}
      value={field.value || null}
      onChange={(_e, data) => helpers?.setValue(data.value)}
      onBlur={() => helpers?.setTouched(true)}
      placeholder={props.placeholder}
      name={props.name}
      selectOnBlur={false}
    />
  );
  return FieldCommonLogic({
    placeholder: props.placeholder,
    name: props.name,
    label: props.label,
    renderInputElement,
  });
}
