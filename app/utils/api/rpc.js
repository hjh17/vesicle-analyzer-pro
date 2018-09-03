export const callRPCPromised = (funcName, ...params) =>
  window.client.invoke_promised(funcName, ...params);

export const callRPC = (funcName, callback,  ...params) =>
  window.client.invoke(funcName, ...params, callback);
