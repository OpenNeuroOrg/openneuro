import { commentCreated } from "../comment-created"

describe("email template -> comment created", () => {
  it("renders with expected arguments", () => {
    expect(
      commentCreated({
        siteUrl: "https://openneuro.org",
        name: "J. Doe",
        commentStatus: "new",
        commentId: "12345",
        commentUserId: "56789",
        commentContent: "Test comment, please ignore",
        datasetName: "ds1245678",
        datasetLabel: "Not Real Dataset",
        dateCreated: "2063-04-05",
      }),
    ).toMatchSnapshot()
  })
})
