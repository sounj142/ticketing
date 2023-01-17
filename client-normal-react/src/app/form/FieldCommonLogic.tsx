import { FieldHelperProps, FieldInputProps, useField } from 'formik';
import { FormField, Label } from 'semantic-ui-react';

export interface CommonProps {
  placeholder?: string;
  name: string;
  label?: string;
}

interface Props extends CommonProps {
  renderInputElement: (
    field: FieldInputProps<any>,
    helpers?: FieldHelperProps<any>
  ) => JSX.Element;
}

export function FieldCommonLogic(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  return (
    <FormField error={meta.touched && !!meta.error}>
      {props.label && <label>{props.label}</label>}
      {props.renderInputElement(field, helpers)}
      {meta.touched && meta.error && (
        <Label
          basic
          color='red'
          content={meta.error}
          className='validation-error'
        />
      )}
    </FormField>
  );
}
