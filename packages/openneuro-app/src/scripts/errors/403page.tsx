import React from "react"
import type { FC } from "react"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"

type ContainerProps = {
  styleContext: string
}
const Container = styled.div<ContainerProps>(({ styleContext }) => {
  switch (styleContext) {
    case "topLevel":
      return {
        margin: "50px 25px",
      }
    case "dataset":
      return {
        margin: "20px 0",
      }
  }
})

interface FourOThreePageProps {
  redirectRoute?: string
  redirectRouteName?: string
  theme?: string
}

const FourOThreePage: FC<FourOThreePageProps> = ({
  redirectRoute = "/",
  redirectRouteName = "the home page",
  theme = "topLevel",
}) => {
  return (
    <Container styleContext={theme} data-testid="403-page">
      <h3>
        403: You do not have access to this page, you may need to sign in.
      </h3>
      <p>
        Click <Link to={redirectRoute}>here</Link> to go to
        {" " + redirectRouteName}.
      </p>
    </Container>
  )
}

export default FourOThreePage
