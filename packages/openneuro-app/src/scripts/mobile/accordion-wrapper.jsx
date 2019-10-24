import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

// wrapper for collapsible content on mobile

const Content = styled.div`
  display: none;
  text-align: left;
  font-size: 14px;
  ${props =>
    props.isOpen &&
    `
      display: block;
    `};
`

const Collapse = ({ children, isOpen }) => {
  return <Content isOpen={isOpen}>{children}</Content>
}

Collapse.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
}

Collapse.defaultProps = {
  isOpen: undefined,
}

//

const Item = styled.button`
  background-color: transparent;
  border: 0;
  font-weight: 700;
  padding: 0;
  &,
  &:hover {
    text-decoration: none;
  }
  &:focus {
    outline: 0;
  }
`

const Wrapper = styled.span`
  display: flex;
  align-items: center;
`

const Body = styled.div`
  ${props =>
    props.isOpen &&
    `
    padding: 1rem 0;
    `}
`

const Title = styled.p`
  padding-right: 0.5rem;
  color: #666;
`

const Accordion = ({ children, ...otherProps }) => {
  const [isOpen, setOpen] = useState(false)
  const arrow = isOpen ? '\u25BE' : '\u25C2'
  const title = isOpen ? 'Click to hide ' : 'Click to expand '
  const toggleItem = () => {
    setOpen(prevState => !prevState)
  }
  return (
    <>
      <Item onClick={toggleItem}>
        <Wrapper>
          <Title>{`${title} ${arrow}`}</Title>
        </Wrapper>
      </Item>
      <Body isOpen={isOpen}>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </Body>
    </>
  )
}

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
}

Accordion.defaultProps = {
  icon: 'down-chevron',
  isOpen: false,
}

export default Accordion
