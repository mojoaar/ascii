export function apiError(code: string, message: string, status = 400): Response {
  return Response.json({ error: message, code }, { status });
}

export function readJson<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
