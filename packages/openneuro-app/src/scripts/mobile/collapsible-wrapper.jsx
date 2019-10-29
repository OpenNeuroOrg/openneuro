import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

// wrapper for collapsible content on mobile

const Content = styled.div`
  height: 7em;
  overflow: hidden;
  text-align: left;
  font-size: 14px;
  ${props =>
    props.isOpen &&
    `
      display: block;
      height: auto;
      overflow: auto;
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
  cursor: pointer;
  color: #00505c;
  text-decoration: none;
  font-family: "Cabin", sans-serif;
  font-size: 12px;
`

const Collapsible = ({ children, ...otherProps }) => {
  const [isOpen, setOpen] = useState(false)
  const toggleItem = () => {
    setOpen(prevState => !prevState)
  }
  return (
    <>
      <Body>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </Body>
      {!isOpen && (
        <Item onClick={toggleItem}>
          <Wrapper>
            <Title>{otherProps.title[0]}</Title>
          </Wrapper>
        </Item>
      )}
      {isOpen && (
        <Item onClick={toggleItem}>
          <Wrapper>
            <Title>{otherProps.title[1]}</Title>
          </Wrapper>
        </Item>
      )}
    </>
  )
}

Collapsible.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
}

Collapsible.defaultProps = {
  icon: 'down-chevron',
  isOpen: false,
}

export default Collapsible
