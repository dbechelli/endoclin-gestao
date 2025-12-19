import { Plus, Trash2 } from 'lucide-react';

function AbaPagamentos({ config, updateConfig }) {
  const tiposDeAtendimento = [
    'Particular',
    'Convênio',
    'Telemedicina'
  ];

  const handleAddTipo = () => {
    const newTipos = [...(config.tipos_atendimento || []), { tipo: 'Particular', procedimento: '', valor: 0 }];
    updateConfig('tipos_atendimento', newTipos);
  };

  const handleRemoveTipo = (index) => {
    const newTipos = config.tipos_atendimento.filter((_, i) => i !== index);
    updateConfig('tipos_atendimento', newTipos);
  };

  const handleUpdateTipo = (index, field, value) => {
    const newTipos = [...config.tipos_atendimento];
    
    if (field === 'valor') {
      const numericValue = value.replace(/[^0-9,.]/g, '');
      newTipos[index][field] = numericValue;
    } else {
      newTipos[index][field] = value;
    }
    
    updateConfig('tipos_atendimento', newTipos);
  };

  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2).replace('.', ',');
    }
    return value || '';
  };

  const parseCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace('.', '').replace(',', '.'));
  };

  return (
    <div>
      <h3 style={h3Style}>Formas de Pagamento e Atendimento</h3>
      <p style={pStyle}>
        Configure os tipos de atendimento que o profissional oferece, junto com seus respectivos valores.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {(config.tipos_atendimento || []).map((atendimento, index) => (
          <div key={index} style={itemStyle}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center' }}>
              {/* Seletor de Tipo */}
              <div>
                <label style={labelStyle}>Tipo de Atendimento</label>
                <select
                  value={atendimento.tipo}
                  onChange={(e) => handleUpdateTipo(index, 'tipo', e.target.value)}
                  style={inputStyle}
                >
                  {tiposDeAtendimento.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Campo Procedimento */}
              <div>
                <label style={labelStyle}>Procedimento</label>
                <input
                  type="text"
                  placeholder="Ex: Consulta, Exame, etc."
                  value={atendimento.procedimento || ''}
                  onChange={(e) => handleUpdateTipo(index, 'procedimento', e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Campo Valor */}
              <div>
                <label style={labelStyle}>Valor (R$)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>R$</span>
                  <input
                    type="text"
                    placeholder="150,00"
                    value={formatCurrency(atendimento.valor)}
                    onBlur={(e) => handleUpdateTipo(index, 'valor', parseCurrency(e.target.value))}
                    onChange={(e) => handleUpdateTipo(index, 'valor', e.target.value.replace('R$ ', ''))}
                    style={{ ...inputStyle, paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </div>

            {/* Botão de Remover */}
            <button
              onClick={() => handleRemoveTipo(index)}
              style={removeButtonStyle}
              title="Remover tipo de atendimento"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddTipo}
        style={addButtonStyle}
      >
        <Plus size={16} /> Adicionar Tipo de Atendimento
      </button>
    </div>
  );
}

// Estilos
const h3Style = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d3748',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '10px',
  marginBottom: '10px'
};

const pStyle = {
  fontSize: '14px',
  color: '#718096'
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  background: '#f8fafc',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0'
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#4a5568',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  transition: 'all 0.2s',
  background: 'white'
};

const addButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: '#eef2ff',
  color: '#4338ca',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '20px',
  transition: 'background 0.2s'
};

const removeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default AbaPagamentos;