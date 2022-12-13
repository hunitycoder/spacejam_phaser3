import styled from 'styled-components'
import React, { useImperativeHandle, useRef } from 'react'
import { useButton } from '@react-aria/button'
import standardBG from '../../media/app-ui/button-standard.png'
import { up } from 'styled-breakpoints'


// default button is the wider one for most text buttons
const Container = styled.button`
  width: 158px;
  height: 55px;
  transform: scale(${(props) => (props.isPressed ? '0.95' : '1')});
  transition: all 60ms ease;

  display: grid;
  padding: 0;
  border: none;
  background-color: transparent;

  :disabled {
    opacity: 0.5;
  }

  ${up('md')}{
    width: 316px;
    height: 111px;
  }
`

const Background = styled.div`
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  height: 100%;
  background-image: url(${standardBG});
  transform: rotate(${(props) => (props.isPressed ? '180deg' : '0deg')});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const Content = styled.div`
  grid-column: 1;
  grid-row: 1;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 1.125rem;
  font-family: ATTAleckCd;
  font-weight: bold;
  color: white;

  ${up('md')} {
    font-size: 1.75rem;
  }
`
export const Button = React.forwardRef((props, ref) => {
  let buttonRef = useRef(null)
  let { buttonProps, isPressed } = useButton(props, buttonRef)
  let { children } = props
  useImperativeHandle(ref, () => (buttonRef.current))

  return (
    <Container ref={buttonRef} {...buttonProps} isPressed={isPressed}>
      <Background isPressed={isPressed} />
      <Content>{children}</Content>
    </Container>
  )
})
