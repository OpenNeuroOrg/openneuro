import { snapshotCreationComparison } from "../snapshots"

describe("snapshotCreationComparison()", () => {
  it('sorts array of objects by the "created" and "tag" properties', () => {
    const testArray = [
      { id: 2, created: new Date("2018-11-20T00:05:43.473Z"), tag: "1.0.0" },
      { id: 1, created: new Date("2018-11-19T00:05:43.473Z"), tag: "1.0.1" },
      { id: 3, created: new Date("2018-11-23T00:05:43.473Z"), tag: "1.0.2" },
      { id: 5, created: new Date("2018-11-23T00:05:43.473Z"), tag: "1.0.10" },
      { id: 4, created: new Date("2018-11-23T00:05:43.473Z"), tag: "1.0.3" },
    ]
    const sorted = testArray.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe(2)
    expect(sorted[1].id).toBe(1)
    expect(sorted[2].id).toBe(3)
    expect(sorted[3].id).toBe(4)
    expect(sorted[4].id).toBe(5)
  })
  it('sorts array of objects by the "created" property as strings', () => {
    const testArray = [
      { id: 2, created: "2018-11-20T00:05:43.473Z", tag: "2.0.0" },
      { id: 1, created: "2018-11-19T00:05:43.473Z", tag: "1.0.0" },
      { id: 3, created: "2018-11-23T00:05:43.473Z", tag: "3.0.0" },
    ]
    const sorted = testArray.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe(1)
    expect(sorted[1].id).toBe(2)
    expect(sorted[2].id).toBe(3)
  })
  it("sorts non-semver tags mixed with semver tags", () => {
    const testArray = [
      { id: 2, created: new Date("2018-11-19T00:05:43.473Z"), tag: "1.0.2" },
      {
        id: 1,
        created: new Date("2018-11-19T00:05:43.473Z"),
        tag: "57fed018cce88d000ac1757f",
      },
      { id: 3, created: new Date("2018-11-19T00:05:43.473Z"), tag: "1.0.1" },
    ]
    const sorted = testArray.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe(2)
    expect(sorted[1].id).toBe(1)
    expect(sorted[2].id).toBe(3)
  })
  it("sorts snapshots with only non-semver tags", () => {
    const testArray = [
      {
        id: 2,
        created: new Date("2018-11-19T00:05:43.473Z"),
        tag: "00001",
      },
      {
        id: 1,
        created: new Date("2018-11-19T00:05:43.473Z"),
        tag: "57fed018cce88d000ac1757f",
      },
      {
        id: 3,
        created: new Date("2018-11-19T00:05:43.473Z"),
        tag: "57fed018cce88d000ac1757f",
      },
    ]
    const sorted = testArray.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe(2)
    expect(sorted[1].id).toBe(1)
    expect(sorted[2].id).toBe(3)
  })
  it("sorts very similar creation times by semver order", () => {
    const testSnapshots = [
      {
        id: "ds002680:1.0.0",
        created: "2020-04-03T23:19:56.000Z",
        tag: "1.0.0",
      },
      {
        id: "ds002680:1.2.0",
        created: "2021-10-19T16:26:43.000Z",
        tag: "1.2.0",
      },
      {
        id: "ds002680:1.1.0",
        created: "2021-10-19T16:26:44.000Z",
        tag: "1.1.0",
      },
    ]
    const sorted = testSnapshots.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe("ds002680:1.0.0")
    expect(sorted[1].id).toBe("ds002680:1.1.0")
    expect(sorted[2].id).toBe("ds002680:1.2.0")
  })
  it("sorts 000002 (legacy snapshots) before 1.0.1 (current format)", () => {
    const testSnapshots = [
      {
        id: "ds000247:00002",
        created: "2018-07-18T02:27:39.000Z",
        tag: "00002",
      },
      {
        id: "ds000247:00001",
        created: "2018-07-18T02:35:37.000Z",
        tag: "00001",
      },
      {
        id: "ds000247:1.0.0",
        created: "2021-07-05T15:58:18.000Z",
        tag: "1.0.0",
      },
      {
        id: "ds000247:1.0.1",
        created: "2021-08-25T23:37:53.000Z",
        tag: "1.0.1",
      },
    ]
    const sorted = testSnapshots.sort(snapshotCreationComparison)
    expect(sorted[0].id).toBe("ds000247:00002")
    expect(sorted[1].id).toBe("ds000247:00001")
    expect(sorted[2].id).toBe("ds000247:1.0.0")
    expect(sorted[3].id).toBe("ds000247:1.0.1")
  })
})
