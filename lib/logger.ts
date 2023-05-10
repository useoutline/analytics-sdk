import state from './state'

function log(...data: (string | number)[]) {
  if (state.getState().debug) {
    console.log('[Outline Logger]', ...data)
  }
}

export default { log }
