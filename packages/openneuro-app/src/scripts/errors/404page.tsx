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

interface FourOFourPageProps {
  redirectRoute?: string
  redirectRouteName?: string
  theme?: string
  message?: string
}

const FourOFourPage: FC<FourOFourPageProps> = ({
  redirectRoute = "/",
  redirectRouteName = "the home page",
  theme = "topLevel",
  message = "",
}) => {
  return (
    <Container styleContext={theme} data-testid="404-page">
      <h3>404: The page you are looking for does not exist.</h3>
      {message && <p>{message}</p>}
      <p>
        Click <Link to={redirectRoute}>here</Link> to go to
        {" " + redirectRouteName}.
      </p>
    </Container>
  )
}

export default FourOFourPage
