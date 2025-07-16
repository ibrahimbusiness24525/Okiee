export const DetailRow = ({ label, value, highlight = false }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '0.9rem'
    }}>
        <span style={{ color: '#616161' }}>{label}:</span>
        <span style={{
            color: highlight ? '#2e7d32' : '#424242',
            fontWeight: highlight ? '600' : '400'
        }}>
            {value}
        </span>
    </div>
);