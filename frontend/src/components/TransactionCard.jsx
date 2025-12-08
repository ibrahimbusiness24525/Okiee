export const TransactionCard = ({ tx, type }) => {
  const colors = {
    taking: '#ef4444',
    giving: '#22c55e',
    simple: '#3b82f6',
  };

  const labels = {
    taking: 'Taking Credit',
    giving: 'Giving Credit',
    simple: 'Transaction Note',
  };

  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid #eee',
        marginBottom: '12px',
        borderRadius: '6px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: colors[type],
            flexShrink: 0,
          }}
        ></div>
        <div>
          <p
            style={{
              margin: '0',
              fontWeight: '600',
              color: colors[type],
            }}
          >
            {labels[type]}
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: type === 'simple' ? '14px' : '18px',
              fontWeight: type === 'simple' ? '400' : '700',
              color: type === 'simple' ? '#4b5563' : colors[type],
            }}
          >
            {type === 'simple'
              ? tx.description
              : (type === 'taking'
                  ? tx.takingCredit.toLocaleString()
                  : tx.givingCredit.toLocaleString()) + ' PKR'}
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #eee',
          paddingTop: '8px',
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#6b7280',
            fontStyle: 'italic',
          }}
        >
          {new Date(tx.createdAt).toLocaleString()}
        </p>
        {tx.reference && (
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            Ref: {tx.reference}
          </p>
        )}
      </div>
    </div>
  );
};
