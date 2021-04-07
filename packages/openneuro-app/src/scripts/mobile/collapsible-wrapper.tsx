import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

interface IsOpenProps {
  isOpen: boolean
}

// wrapper for collapsible content on mobile
const Content = styled.div<IsOpenProps>`
  height: 7em;
  overflow: hidden;
  text-align: left;
  ${(props): string =>
    props.isOpen &&
    `
      display: block;
      height: auto;
      overflow: auto;
    `};
`

const Collapse = ({ children, isOpen }): React.ReactElement => {
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

const Title = styled.p`
  padding-right: 0.5rem;
  cursor: pointer;
  color: #00505c;
  text-decoration: none;
  font-family: 'Cabin', sans-serif;
  font-size: 12px;
`

const Collapsible = ({ children, ...otherProps }): React.ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const toggleItem = (): void => {
    setOpen(prevState => !prevState)
  }
  return (
    <>
      <div>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </div>
      <Item onClick={toggleItem}>
        <Wrapper>
          <Title>{!isOpen ? otherProps.title[0] : otherProps.title[1]}</Title>
        </Wrapper>
      </Item>
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
