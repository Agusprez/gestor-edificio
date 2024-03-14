import React, { useState } from 'react';
import { Form } from 'react-bootstrap';


const ToggleSwitch = ({ idUsuario, ufAsociadahabilitada, onUpdate }) => {
  const [checked, setChecked] = useState(ufAsociadahabilitada);

  const handleToggle = () => {
    const newState = !checked;
    setChecked(newState);
    onUpdate(idUsuario, newState);
  };
  return (
    <Form>
      <Form.Check
        type="switch"
        id="ufAsociadahabilitada-switch"
        label={ufAsociadahabilitada ? "Usuario habilitado" : "Usuario sin autorización"}
        onClick={handleToggle}
        defaultChecked={ufAsociadahabilitada} // Establece defaultChecked en función de ufAsociadahabilitada
      />
    </Form>
  );
};

export default ToggleSwitch;
