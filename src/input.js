/** Bounded UTF-8 input for incident facts, independent of terminal output. */
export async function readStdin(stream = process.stdin) {
  if (stream.isTTY) throw new TypeError("Pipe incident facts as JSON.");
  let size = 0;
  const chunks = [];
  for await (const chunk of stream) {
    const bytes = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    size += bytes.length;
    if (size > 262144) throw new RangeError("stdin exceeds 256 KiB.");
    chunks.push(bytes);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) throw new TypeError("Provide incident facts as JSON.");
  return text;
}
