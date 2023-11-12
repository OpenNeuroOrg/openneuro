import { expiringBanner } from "../userNotify.js"
import { toast } from "react-toastify"

vi.mock("react-toastify", () => ({
  ...vi.importActual("react-toastify"),
  toast: { warn: vi.fn() },
}))

describe("userNotify.js", () => {
  describe("expiringBanner", () => {
    afterEach(() => {
      vi.clearAllMocks()
    })
    it("is displayed before expiration time", () => {
      const future = new Date()
      // Engage the flux capacitor
      future.setSeconds(future.getSeconds() + 30)
      expiringBanner("message", future)
      expect(toast.warn).toHaveBeenCalled()
    })
    it("is not displayed after expiration", () => {
      const past = new Date()
      // Rewind time 30 seconds
      past.setSeconds(past.getSeconds() - 30)
      expiringBanner("message", past)
      expect(toast.warn).not.toHaveBeenCalled()
    })
  })
})
