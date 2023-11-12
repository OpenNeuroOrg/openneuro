import React from "react"
import DownloadS3Derivative from "../download/download-derivative-s3"
import DownloadDataLadDerivative from "../download/download-derivative-datalad"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3 } from "./styles/header-row"

interface DerivativeElementProps {
  name: string
  s3Url: string
  dataladUrl: string
  local: boolean
}

const DerivativeElement = ({
  name,
  s3Url,
  dataladUrl,
  local,
}: DerivativeElementProps): JSX.Element => {
  if (local) {
    return null
  } else {
    return (
      <>
        <hr />
        <h3>
          <a href={dataladUrl}>{name}</a>
        </h3>
        {s3Url && <DownloadS3Derivative url={s3Url} name={name} />}
        {dataladUrl && <DownloadDataLadDerivative url={dataladUrl} />}
      </>
    )
  }
}

interface DerivativesProps {
  derivatives: DerivativeElementProps[]
}

const Derivatives = ({ derivatives }: DerivativesProps): JSX.Element => {
  return (
    <DatasetPageBorder>
      <HeaderRow3>Available Derivatives</HeaderRow3>
      <h5>Acknowledgements</h5>
      <p>
        These derivatives were generated on the{" "}
        <a href="https://www.tacc.utexas.edu/">
          Texas Advanced Computing Center
        </a>{" "}
        Frontera computing system [1] through their{" "}
        <a href="https://frontera-portal.tacc.utexas.edu/allocations/">
          Pathways allocation
        </a>
        . This work was also funded by the{" "}
        <a href="https://grantome.com/grant/NIH/R24-MH117179-03">
          NIH BRAIN Initiative
        </a>
        .
      </p>
      <p>
        [1]: Dan Stanzione, John West, R. Todd Evans, Tommy Minyard, Omar
        Ghattas, and Dhabaleswar K. Panda. 2020. Frontera: The Evolution of
        Leadership Computing at the National Science Foundation. In Practice and
        Experience in Advanced Research Computing (PEARC ’20), July 26–30, 2020,
        Portland, OR, USA. ACM, New York, NY, USA, 11 pages.
        <a href="https://doi.org/10.1145/3311790.3396656">
          https://doi.org/10.1145/3311790.3396656
        </a>
      </p>
      {derivatives.map((derivative) => (
        <DerivativeElement key={derivative.name} {...derivative} />
      ))}
    </DatasetPageBorder>
  )
}

export default Derivatives
