import React from "react";
import { Form } from "react-bootstrap";

const FormInput = (props) => {
  return (
    <>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        {...props.inputProps}
      />
      <Form.Text {...props.errorText}>
        {props.error}
      </Form.Text>
    </>
  );
};

export default FormInput;
