# Below are definitions for executing user code
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
