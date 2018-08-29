export const callRPCPromised = (funcName, params) =>
  window.client.invoke_promised(funcName, params);

export const callRPC = (funcName, params, callback) =>
  window.client.invoke(funcName, params, callback);
