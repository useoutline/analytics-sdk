import state from "./state";

function log(...data: (string | number)[]) {
  if (state.getDebug()) {
    console.log("[Outline Logger]", ...data);
  }
}

export default { log };
