import React from 'react';

const EntityListBox = ({ entitiesWithLedger }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
        justifyContent: 'flex-start',
      }}
    >
      {entitiesWithLedger.map((entity, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: 'calc(33.333% - 14px)', // 3 per row with gap
            boxSizing: 'border-box',
            minWidth: '250px',
            flexGrow: 1
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333'
            }}
          >
            {entity.name}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            Reference: {entity.reference}
          </div>

          <div style={{ fontWeight: '600', marginBottom: '6px', color: '#444' }}>
            Transactions:
          </div>

          {entity.entries.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#999' }}>No transactions added yet.</div>
          ) : (
            entity.entries.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  borderLeft: '4px solid #007BFF',
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '4px'
                }}
              >
                <div style={{ fontSize: '14px', color: '#222' }}>
                  <strong>{entry.type}</strong> - ₹{entry.amount}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>{entry.description}</div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default EntityListBox;
