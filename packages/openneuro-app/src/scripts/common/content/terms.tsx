import React, { ReactElement } from "react"

/** Terms and conditions content. */
export function Terms(): ReactElement {
  return (
    <>
      <p>
        I am the owner of this dataset and have any necessary ethics permissions
        to share the data publicly. This dataset does not include any
        identifiable personal health information as defined by the{" "}
        <a href="https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/">
          Health Insurance Portability and Accountability Act of 1996
        </a>{" "}
        (including names, zip codes, dates of birth, acquisition dates, etc). I
        agree to destroy any key linking the personal identity of research
        participants to the subject codes used in the dataset.
      </p>
      <p>
        I agree that this dataset will become publicly available under a{" "}
        <a href="https://wiki.creativecommons.org/wiki/CC0">
          Creative Commons CC0
        </a>{" "}
        license after a grace period of 36 months counted from the date of the
        first snapshot creation for this dataset. You will be able to apply for
        up to two 6 month extensions to increase the grace period in case the
        publication of a corresponding paper takes longer than expected. See
        {" "}
        <a href="/faq">FAQ</a> for details.
      </p>
      <p>This dataset is not subject to GDPR protections.</p>
      <p>
        Generally, data should only be uploaded to a single data archive. In the
        rare cases where it is necessary to upload the data to two databases
        (such as the NIMH Data Archive), I agree to ensure that the datasets are
        harmonized across archives.
      </p>
    </>
  )
}
