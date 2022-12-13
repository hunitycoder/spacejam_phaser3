import React from 'react'
import { string, number } from 'prop-types'
import { up } from 'styled-breakpoints'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;

  > div {
    grid-column: 1;
    grid-row: 1;
    font-family: Politica;
    font-weight: 900;
    font-size: ${props => props.fontSize ? props.fontSize : '2.5'}rem;
    text-transform: uppercase;
    line-height: 1.1;

    ${up('md')} {
      font-size: ${props => props.fontSize ? props.fontSize * 1.5 : '3.75'}rem;
    }
  }
`

const TopLayer = styled.div`
  color: transparent;
  -webkit-text-stroke: 0.03em white;
  z-index: 2;
`

const BottomLayer = styled.div`
  z-index: 1;
  opacity: 0.2;
  /* mix-blend-mode: soft-light; */
  text-shadow:
     0.03em  0.03em .1em white,
    -0.03em  0.03em .1em white,
     0.03em -0.03em .1em white,
    -0.03em -0.03em .1em white;
`
// fontSize is expressed as ems, but just the number without units
const FancyText = ({ text, fontSize }) => {
  return (
    <Container fontSize={fontSize}>
      <TopLayer>{text}</TopLayer>
      <BottomLayer aria-hidden="true">{text}</BottomLayer>
    </Container>
  )
}

FancyText.propTypes = {
  text: string.isRequired,
  fontSize: number,
}

export default FancyText