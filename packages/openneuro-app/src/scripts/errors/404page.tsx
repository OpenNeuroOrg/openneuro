import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const Container = styled.div({
  margin: '50px 25px',
})

interface FourOFourPageProps {
  redirectRoute?: string
  redirectRouteName?: string
}

const FourOFourPage: FC<FourOFourPageProps> = ({
  redirectRoute = '/',
  redirectRouteName = 'the home page',
}) => {
  return (
    <Container>
      <h3>404: The page you are looking for does not exist.</h3>
      <p>
        Click <Link to={redirectRoute}>here</Link> to go to
        {' ' + redirectRouteName}.
      </p>
    </Container>
  )
}

export default FourOFourPage
