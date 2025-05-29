import React from "react"
import { render, waitFor } from "@testing-library/react"
import { CoralEmbed } from "../coral-embed"
import { UserModalOpenCtx } from "../../../utils/user-login-modal-ctx"
import { vi } from "vitest"

vi.mock("../../../utils/user-login-modal-ctx", () => ({
  UserModalOpenCtx: React.createContext({ setUserModalOpen: vi.fn() }),
}))

global.fetch = vi.fn().mockResolvedValue(Promise.resolve({
  json: vi.fn().mockResolvedValue({ token: "mock-sso-token" }),
}))

// Mock the global Coral object
const mockCoralCreateStreamEmbed = vi.fn()
global.window.Coral = {
  createStreamEmbed: mockCoralCreateStreamEmbed,
}

describe("CoralEmbed - Simple Embed.js Check (Vitest)", () => {
  const mockStoryID = "simple-test-story"
  const mockModalities = ["test"]

  it("should check if window.Coral exists and initializeCoralEmbed is called", async () => {
    render(
      <UserModalOpenCtx.Provider value={{ setUserModalOpen: vi.fn() }}>
        <CoralEmbed storyID={mockStoryID} modalities={mockModalities} />
      </UserModalOpenCtx.Provider>,
    )

    // fetch and Coral initialization
    await waitFor(() => {
      expect(global.window.Coral).toBeDefined()
      expect(mockCoralCreateStreamEmbed).toHaveBeenCalledTimes(1)
    })

    expect(mockCoralCreateStreamEmbed).toHaveBeenCalledWith(
      expect.objectContaining({
        storyID: mockStoryID,
      }),
    )
  })
})
