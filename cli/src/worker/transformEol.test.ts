import { assertEquals } from "@std/assert"
import { transformEol } from "./transformEol.ts"
import type { FileHandle } from "node:fs/promises"

// Mock FileHandle for reading
class MockReadHandle {
  private data: Uint8Array
  private pos: number = 0
  private chunkSize: number

  constructor(content: string, chunkSize: number = 65536) {
    this.data = new TextEncoder().encode(content)
    this.chunkSize = chunkSize
  }

  // Matches fs.promises.FileHandle.read signature used in transformEol
  async read(
    buffer: Uint8Array,
    offset: number,
    length: number,
    _position: number | null,
  ) {
    if (this.pos >= this.data.length) {
      return { bytesRead: 0, buffer }
    }
    const size = Math.min(length, this.chunkSize, this.data.length - this.pos)
    buffer.set(this.data.subarray(this.pos, this.pos + size), offset)
    this.pos += size
    return { bytesRead: size, buffer }
  }

  async close() {}
}

// Mock FileHandle for writing
class MockWriteHandle {
  public chunks: Uint8Array[] = []

  async write(
    buffer: Uint8Array,
    offset: number,
    length: number,
    _position: number | null,
  ) {
    const chunk = buffer.slice(offset, offset + length)
    this.chunks.push(chunk)
    return { bytesWritten: length, buffer }
  }

  async close() {}

  get content(): string {
    const totalLength = this.chunks.reduce((acc, c) => acc + c.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of this.chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    return new TextDecoder().decode(result)
  }
}

Deno.test("transformEol() basic CRLF to LF", async () => {
  const input = "line1\r\nline2\r\nline3"
  const expected = "line1\nline2\nline3"
  const read = new MockReadHandle(input) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() binary file with null byte", async () => {
  const input = "line1\r\n\0line2"
  // Expect no transformation because of the null byte
  const expected = "line1\r\n\0line2"
  const read = new MockReadHandle(input) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() split CRLF across chunks", async () => {
  const input = "line1\r\nline2"
  const expected = "line1\nline2"
  // Chunk size 6 ensures split happens around \r\n for "line1\r\n" (length 7)
  // "line1\r" (6) -> next chunk "\nline2"
  const read = new MockReadHandle(input, 6) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() standalone CR preserved", async () => {
  const input = "line1\rline2"
  const expected = "line1\rline2"
  const read = new MockReadHandle(input, 3) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() CR at end of file preserved", async () => {
  const input = "line1\r"
  const expected = "line1\r"
  const read = new MockReadHandle(input) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() mixed content with small chunks", async () => {
  const input = "A\r\nB\rC\r\nD\r"
  const expected = "A\nB\rC\nD\r"
  // Force small chunks to test state machine
  const read = new MockReadHandle(input, 1) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() empty file", async () => {
  const input = ""
  const expected = ""
  const read = new MockReadHandle(input) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})

Deno.test("transformEol() multibyte characters", async () => {
  const input = "👍\r\nTest"
  const expected = "👍\nTest"
  const read = new MockReadHandle(input, 1) as unknown as FileHandle
  const write = new MockWriteHandle()

  await transformEol(read, write as unknown as FileHandle)
  assertEquals(write.content, expected)
})
