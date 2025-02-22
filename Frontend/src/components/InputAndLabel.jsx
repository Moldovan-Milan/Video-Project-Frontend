import React from "react";

const InputAndLabel = ({
  name,
  inputId,
  type = "text",
  value,
  isReadOnly = false,
}) => (
  <div className="form-group">
    <label htmlFor={inputId}>{name}</label>
    <input
      type={type}
      className="form-control"
      id={inputId}
      value={value}
      readOnly={isReadOnly}
    />
  </div>
);

export default InputAndLabel;
