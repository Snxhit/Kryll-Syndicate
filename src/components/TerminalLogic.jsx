import { useState, useEffect } from 'preact/hooks';

export default function TerminalLogic()
{
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  
  const processInput = (e) =>
  {
    setInput(e.target.value);
  }
  
  const handleKeyDown = (e) =>
  {
    if (e.key === 'Enter' && input.trim() !== '')
    {
      setHistory([...history, input]);
      setInput('');
    }
  }

  return (
    <div>
      <div>
        <ol>
          {history.map((cmd, index) => (
            <li key={index}>{cmd}</li>
          ))}
        </ol>
      </div>
      <input
        type="text"
        placeholder="Enter a command"
        value={input}
        onChange={processInput}
        onKeyDown={handleKeyDown}
        autoFocus
        style=
        {{
          position: "fixed",
          bottom: "2vw",
          left: 0,
          right: 0,
          width: "90vw",
          margin: "0 auto",
          padding: "13px",
          fontSize: "16px",
          border: "10px",
          borderRadius: "10px",
          outline: "2px solid #454444",
          backgroundColor: "#222",
          color: "#fff",
        }}
      />
    </div>
  );
}
