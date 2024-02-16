import React from 'react';

class UnidadesFuncionales extends React.Component {


  const response = await fetch("http://localhost:4500/UF")

  render() {
    return (
      <div>
        Hola desde UF
      </div>
    );
  }
}

export default UnidadesFuncionales
