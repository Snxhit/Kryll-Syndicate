// CODE BEFORE I REFACTORED TO USING WORKER FOR PYODIDE
// (Backup for in case anything breaks too much and I have to go back)

import { useState, useEffect } from 'preact/hooks';
import KryllScript from "../kryllscript/ks.py?raw";

export default function PythonExecutor()
{
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
      await pyodide.runPython(KryllScript);

      let updateUI = (status) => {
        document.getElementById("gameStatus").innerText = `Status: ${status}`;
      }

      let proxy = pyodide.toPy(updateUI);
      await pyodide.runPythonAsync("ks.set_callback").then(fn => fn(proxy));

      // Execute user code
      let output = await pyodide.runPythonAsync(`
# Check kryllscript (ks.py) imports and top level for complete details of execution.

async def __user_main__():
  try:
    ${code
      .split("\n")
      .map(line => "        " + line)  // Indent all user code by 8 spaces to make it a part of the async func
      .join("\n")}
  except Exception as e:
    print("Error: ", e)

await __user_main__()
output.getvalue()
`)

      setOutput(output || "No output");

      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
  }

  return (
    <div>
      <p id="gameStatus"></p>

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
