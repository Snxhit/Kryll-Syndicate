import{d as t,A as I,y as P}from"./hooks.module.BfrFCcS3.js";import{u as e}from"./jsxRuntime.module.DCTds_QK.js";import"./preact.module.xc0zIhQ1.js";const j=`# Below are definitions for executing user code
from io import StringIO
import sys
sys.stdout = sys.stderr = output = StringIO()
# ----

from pyodide.ffi import create_proxy

import time
import asyncio

class KryllScript:
  def __init__(self):
    self.resources = {}
    self.current_action = "idle"
    self.current_mine = None
    self.js_callback = None

  def set_callback(self, callback):
    self.js_callback = callback

  def _update_ui(self, message):
    if self.js_callback:
      self.js_callback(message)

  async def explore(self, time):
    self.current_action = "exploring"
    self._update_ui("exploring")
    for i in range(time, 0, -1):
      self._update_ui(f"Exploring: {i} seconds remaining")
      await asyncio.sleep(1)
    self.current_mine = {"health": 100, "ore": "iron"}
    self._update_ui("mine found: iron")


ks = KryllScript()
`;function C(){const[n,d]=t(""),[g,r]=t(""),[a,p]=t(""),[y,m]=t(!1),[s,o]=t(!0),[_,h]=t(""),c=I(null);P(()=>{const u=new URLSearchParams(window.location.search).get("file");u&&(m(!0),p(u||""),d(localStorage.getItem(u)||""));const f=new Worker("/pyodide-worker.js");return c.current=f,f.onmessage=w=>{const{type:i,output:S,error:x,message:v}=w.data;i==="ready"?o(!1):i==="result"?(r(S||"No output"),o(!1)):i==="error"?(r(`Error: ${x}`),o(!1)):i==="status"&&h(`Status: ${v}`)},()=>f.terminate()},[]);function k(){a&&n&&(localStorage.setItem(a,n),m(!0))}function b(){if(!c.current){r("Worker not ready.");return}o(!0),r("Running..."),c.current.postMessage({type:"run",code:n,kryllScript:j})}return e("div",{children:[e("p",{id:"gameStatus",children:_}),e("textarea",{style:{width:"98vw"},rows:"30",cols:"200",placeholder:"Write Python code here...",value:n,onInput:l=>d(l.target.value)}),e("br",{}),e("input",{type:"text",value:a,disabled:y,placeholder:"File name",onInput:l=>p(l.target.value)}),e("br",{}),e("button",{onClick:b,disabled:s,children:s?"Please wait...":"Run Python"}),e("button",{onClick:k,disabled:s,children:s?"Please wait...":"Save file"}),e("pre",{children:g})]})}export{C as default};
