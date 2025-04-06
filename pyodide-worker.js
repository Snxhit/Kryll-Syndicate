
self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

let pyodideReadyPromise = (async () => {
  self.pyodide = await loadPyodide();
  self.postMessage({ type: "ready" });
})();

self.onmessage = async (event) => {
  await pyodideReadyPromise;

  const { type, code, kryllScript } = event.data;

  if (type === "run") {
    try {
      await pyodide.runPython(kryllScript);

      // Set up the callback that Python can call into JS
      const jsCallback = (status) => {
        self.postMessage({ type: "status", message: status });
      };

      const proxy = pyodide.toPy(jsCallback);
      await pyodide.runPythonAsync("ks.set_callback").then((fn) => fn(proxy));

      await pyodide.runPython(`
from io import StringIO
import sys
sys.stdout = sys.stderr = output = StringIO()
`);

      const fullCode = `
async def __user_main__():
    try:
${code.split("\n").map(line => "        " + line).join("\n")}
    except Exception as e:
        print("Error:", e)

await __user_main__()
result = output.getvalue()
`;
      await pyodide.runPythonAsync(fullCode);
      const result = pyodide.runPython("result");
      self.postMessage({ type: "result", output: result });
    } catch (err) {
      self.postMessage({ type: "error", error: err.message });
    }
  }
};

