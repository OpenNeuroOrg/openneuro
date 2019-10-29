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

//
const Container = styled.div`
  height: 110px;
  ${props =>
    props.isOpen &&
    `
    overflow: auto;
    height: 100%;
    `};
  display: block;
  overflow: hidden;
`

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
  color: blue;
  text-decoration: underline;
  font-size: 12px;
`

const Accordion = ({ children, ...otherProps }) => {
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

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
}

Accordion.defaultProps = {
  icon: 'down-chevron',
  isOpen: false,
}

export default Accordion
