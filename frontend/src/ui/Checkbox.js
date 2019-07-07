import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';

export default function Checkbox({ name, value, label, ...rest }) {
  return (
    <Field name={name}>
      {({ field, form }) => (
        <StyledCheckbox>
          {label}
          <input
            type="checkbox"
            {...rest}
            checked={field.value ? field.value.includes(value) : false}
            onChange={() => {
              if (field.value && field.value.includes(value)) {
                const nextValue = field.value.filter(
                  oldValue => oldValue !== value
                );
                form.setFieldValue(name, nextValue);
              } else {
                const nextValue = field.value.concat(value);
                form.setFieldValue(name, nextValue);
              }
            }}
          />
        </StyledCheckbox>
      )}
    </Field>
  );
}

const StyledCheckbox = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
