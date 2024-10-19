import { memo } from 'react';

function ErrorMessage({ message }) {
    if (!message) return null;
    return <div style={{ color: 'red', marginTop: '4px' }}>{message}</div>;
}

export default memo(ErrorMessage);
