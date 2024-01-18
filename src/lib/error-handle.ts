export function errorContent(errName?: string, errMsg?: string) {
  return {
    errName: errName,
    errMsg: errMsg,
  };
}

export function errorHeaders(status?: number) {
  return {
    headers: { "Content-Type": "application/json" },
    status: status ?? 500,
  };
}
