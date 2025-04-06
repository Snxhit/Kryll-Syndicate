import { useState, useEffect, useRef } from 'preact/hooks';
import KryllScript from "../kryllscript/ks.py?raw";

export default function PythonExecutor() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [filename, setFilename] = useState('');
  const [isFileOpened, setIsFileOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const workerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    if (file) {
      setIsFileOpened(true);
      setFilename(file || '');
      setCode(localStorage.getItem(file) || '');
    }

    const worker = new Worker('/pyodide-worker.js');
    workerRef.current = worker;

    worker.onmessage = (event) =>
    {
      const { type, output, error, message } = event.data;

      if (type === "ready")
      {
       setLoading(false);
      }
      else if (type === "result")
      {
       setOutput(output || "No output");
       setLoading(false);
      }
      else if (type === "error")
      {
       setOutput(`Error: ${error}`);
       setLoading(false);
      }
      else if (type === "status")
      {
       setStatusMessage(`Status: ${message}`);
      }
    };

  return () => worker.terminate();
  }, []);

  function saveFile()
  {
    if (filename && code) {
      localStorage.setItem(filename, code);
      setIsFileOpened(true);
    }
  }

  function runPython()
  {
    if (!workerRef.current) {
      setOutput("Worker not ready.");
      return;
    }
    setLoading(true);
    setOutput("Running...");
    workerRef.current.postMessage({
      type: "run",
      code,
      kryllScript: KryllScript,
    });
  }

  return (
    <div>
      <p id="gameStatus">{statusMessage}</p>

      <textarea
        style={{
          width: "98vw",
        }}
        rows="30"
        cols="200"
        placeholder="Write Python code here..."
        value={code}
        onInput={(e) => setCode(e.target.value)}
      />
      <br />

      <input
        type="text"
        value={filename}
        disabled={isFileOpened}
        placeholder="File name"
        onInput={(e) => setFilename(e.target.value)}
      />
      <br />

      <button onClick={runPython} disabled={loading}>
        {loading ? "Please wait..." : "Run Python"}
      </button>
      <button onClick={saveFile} disabled={loading}>
        {loading ? "Please wait..." : "Save file"}
      </button>

      <pre>{output}</pre>
    </div>
  );
}
