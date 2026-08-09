import { useMemo, useState } from 'react';

const formatValue = (value) => {
  if (value === 'Error') return 'Error';
  if (!value) return '0';
  return value;
};

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const displayValue = useMemo(() => {
    return formatValue(expression || result);
  }, [expression, result]);

  const handleButtonPress = (value) => {
    if (value === 'C') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === '⌫') {
      const nextExpression = expression.slice(0, -1);
      setExpression(nextExpression);
      setResult(nextExpression || '0');
      return;
    }

    if (value === '=') {
      if (!expression) return;

      try {
        const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');
        if (!sanitized) {
          setResult('0');
          return;
        }

        const calculated = Function(`"use strict"; return (${sanitized})`)();
        if (Number.isFinite(calculated)) {
          setResult(String(calculated));
          setExpression('');
        } else {
          setResult('Error');
          setExpression('');
        }
      } catch {
        setResult('Error');
        setExpression('');
      }
      return;
    }

    const nextExpression = expression + value;
    setExpression(nextExpression);
    setResult(nextExpression || '0');
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="notch" />
        <div className="status-bar">
          <span>9:41</span>
          <div className="status-icons">◉ ◉ ◉</div>
        </div>

        <div className="calculator">
          <div className="display">
            <div className="display-expression">{expression || '0'}</div>
            <div className="display-result" key={displayValue}>
              {displayValue}
            </div>
          </div>

          <div className="top-row">
            <button className="control clear" onClick={() => handleButtonPress('C')}>
              C
            </button>
            <button className="control delete" onClick={() => handleButtonPress('⌫')}>
              ⌫
            </button>
          </div>

          <div className="controls">
            {buttons.flat().map((btn) => (
              <button
                key={btn}
                className={`control ${btn === '0' ? 'zero' : ''} ${['+', '-', '*', '/', '='].includes(btn) ? 'operator' : ''}`.trim()}
                onClick={() => handleButtonPress(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <div className="home-indicator" />
      </div>
    </div>
  );
}

export default App;
