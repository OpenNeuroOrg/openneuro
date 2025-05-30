import { assertEquals } from "@std/assert/equals"
import { PromiseQueue } from "./queue.ts"

Deno.test("PromiseQueue should execute promises in order", async () => {
  const order: number[] = []
  const promiseQueue = new PromiseQueue()

  promiseQueue.enqueue(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10))
    order.push(1)
  })
  promiseQueue.enqueue(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10))
    order.push(2)
  })
  promiseQueue.enqueue(async () => {
    await Promise.resolve()
    order.push(3)
  })

  await new Promise((resolve) => setTimeout(resolve, 50))

  assertEquals(order, [1, 2, 3])
})
