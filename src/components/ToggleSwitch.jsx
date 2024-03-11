import React from 'react';
import { Form } from 'react-bootstrap';

const ToggleSwitch = ({ ufAsociadahabilitada }) => {
  return (
    <Form>
      <Form.Check
        type="switch"
        id="ufAsociadahabilitada-switch"
        label="Usuario habilitado"
        defaultChecked={ufAsociadahabilitada} // Establece defaultChecked en función de ufAsociadahabilitada
      />
    </Form>
  );
};

export default ToggleSwitch;
