import { useState, useEffect } from 'preact/hooks';

export default function PythonExecutor() {
    const [pyodide, setPyodide] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [filename, setFilename] = useState('');
    const [isFileOpened, setIsFileOpened] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const file = params.get('file');
        if (file)
        {
          setIsFileOpened(true);
          setFilename(file || '');
          setCode(localStorage.getItem(file) || '');
        }
        async function loadPyodide() {
            try {
                setLoading(true);
                const pyodideModule = await import('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs');
                const py = await pyodideModule.loadPyodide();
                setPyodide(py);
            } catch (err) {
                setOutput(`Failed to load Pyodide: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
        loadPyodide();
    }, []);

    function saveFile()
    {
      if (filename && code)
      {
        localStorage.setItem(filename, code)
        setIsFileOpened(true);
      }
    }  

    async function runPython() {
        if (!pyodide) {
            setOutput("Please wait...");
            return;
        }

        try {
            // Redirect Python print output to a string
            pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = sys.stderr = StringIO()
            `);

            // Execute user code
            pyodide.runPython(code);
            // localStorage.setItem("test", code)

            // Get the printed output
            const result = pyodide.runPython("sys.stdout.getvalue()");
            setOutput(result || "No output");
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    }

    return (
        <div>
            <textarea
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
