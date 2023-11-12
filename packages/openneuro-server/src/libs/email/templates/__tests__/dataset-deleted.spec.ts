import { datasetDeleted } from "../dataset-deleted"

describe("email template -> comment created", () => {
  it("renders with expected arguments", () => {
    expect(
      datasetDeleted({
        siteUrl: "https://openneuro.org",
        name: "J. Doe",
        datasetName: "ds1245678",
      }),
    ).toMatchSnapshot()
  })
})
