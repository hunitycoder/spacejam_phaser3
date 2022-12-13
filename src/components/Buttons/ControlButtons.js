import styled from 'styled-components'
import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import aimImage from '../../media/app-ui/button-aim.png'
import fireImage from '../../media/app-ui/button-fire.png'

const Container = styled.button`
  width: 5.5rem;
  height: 5.5rem;
  transform: scale(${(props) => (props.isPressed ? '0.95' : '1')});
  transition: all 60ms ease;
  background-image: url(${fireImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-color: transparent;
  border: none;

  :disabled {
    opacity: 0.5;
  }
`

export const FireButton = (props) => {
  let ref = useRef(null)
  let { buttonProps, isPressed } = useButton(props, ref)

  return (
    <Container
      ref={ref}
      {...buttonProps}
      isPressed={isPressed}
    >
    </Container>
  )
}


const AimContainer = styled.button`
  width: 5.875rem;
  height: 3.125rem;
  background-image: url(${aimImage});
  transform:
    rotate(${(props) => (props.isRight ? '180deg' : '0deg')})
    scale(${(props) => (props.isPressed ? '0.95' : '1')});
  transition: all 60ms ease;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: transparent;
  border: none;

  :disabled {
    opacity: 0.5;
  }

`

export const AimButton = (props) => {
  const { isRight } = props
  let ref = useRef(null)
  let { buttonProps, isPressed } = useButton(props, ref)

  return (
    <AimContainer
      ref={ref}
      {...buttonProps}
      isPressed={isPressed}
      isRight={isRight}
    >
    </AimContainer>
  )
}


