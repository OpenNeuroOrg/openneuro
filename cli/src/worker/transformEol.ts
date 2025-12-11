import type { FileHandle } from "node:fs/promises"

/**
 * Streaming transformation of EOL characters from CRLF to LF.
 * @param readHandle fs.open FileHandle for reading the original file
 * @param writeHandle fs.open FileHandle for writing the transformed result
 */
export async function transformEol(
  readHandle: FileHandle,
  writeHandle: FileHandle,
) {
  // 8000 is the same preamble size used by git to detect binary files
  const preamble = new Uint8Array(8000)
  const { bytesRead: initialBytes } = await readHandle.read(
    preamble,
    0,
    preamble.length,
    null,
  )
  const firstChunk = preamble.subarray(0, initialBytes)
  const isBinary = firstChunk.includes(0)

  const fileStream = new ReadableStream({
    start(controller) {
      if (initialBytes > 0) {
        controller.enqueue(firstChunk)
      }
    },
    async pull(controller) {
      const buffer = new Uint8Array(65536)
      const { bytesRead } = await readHandle.read(
        buffer,
        0,
        buffer.length,
        null,
      )
      if (bytesRead === 0) {
        controller.close()
        await readHandle.close()
      } else {
        controller.enqueue(buffer.subarray(0, bytesRead))
      }
    },
    async cancel() {
      await readHandle.close()
    },
  })
  const targetStream = new WritableStream({
    async write(chunk) {
      await writeHandle.write(chunk, 0, chunk.length, null)
    },
    async close() {
      await writeHandle.close()
    },
    async abort() {
      await writeHandle.close()
    },
  })
  if (isBinary) {
    await fileStream.pipeTo(targetStream)
    return
  }
  let lastCharWasCR = false
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (chunk.length === 0) return
      let text = chunk
      if (lastCharWasCR) {
        if (!text.startsWith("\n")) {
          controller.enqueue("\r")
        }
        lastCharWasCR = false
      }
      if (text.endsWith("\r")) {
        lastCharWasCR = true
        text = text.slice(0, -1)
      }
      if (text.length > 0) {
        controller.enqueue(text.replace(/\r\n/g, "\n"))
      }
    },
    flush(controller) {
      if (lastCharWasCR) {
        controller.enqueue("\r")
      }
    },
  })
  await fileStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(transformStream)
    .pipeThrough(new TextEncoderStream())
    .pipeTo(targetStream)
}
