import React from "react";
import {
  Form,
  Nav,
  FormGroup,
  Row,
  InputGroup,
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
const ExampleCustomInput = React.forwardRef((props, ref) => {
  return (
    <Form.Control
      ref={ref}
      className="rounded-0"
      type="text"
      {...props}
      //   onClick={onClick}
    />
  );
});
export default ExampleCustomInput;
