import React, { useRef } from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import { useButton } from '@react-aria/button'

const Container = styled.div`
  width: 3.375rem;
  height: 3.375rem;
  border-color: ${({borderColor}) => borderColor};
  border-style: solid;
  border-width: ${({isActive}) => isActive ? '0.125rem' : '0.0625rem'};
  box-sizing: border-box;
  border-radius: 1.125rem;
  margin: 0 0.2rem;
  background-color: ${({backgroundColor}) => backgroundColor};
  transform: scale(${({isPressed}) => isPressed ? '0.95' : '1'});
  transition: all 60ms ease;
  ${up('md')} {
    width: 6.25rem;
    height: 6.25rem;
    margin: 0 0.4rem;
  }  
`

const ImageIcon = styled.img`
  width: 100%;
  height: 100%;
`

const OptionButton = (props) => {
  const { image, color, isActive } = props
  const ref = useRef(null)
  const { buttonProps, isPressed } = useButton(props, ref)

  const getBackgroundColor = () => {
    if (color) {
      return color
    } else if (isActive) {
      return 'rgb(35 201 255 / 44%)'
    } else {
      return 'transparent'
    }
  }

  const getBorderColor = () => {
    if (isActive) {
      return 'white'
    } else if (image) {
      return '#1A9FDB'
    } else if (color) {
      return 'transparent'
    }
  }

  return (
    <Container
      ref={ref}
      {...buttonProps}
      isPressed={isPressed}
      backgroundColor={getBackgroundColor()}
      isActive={isActive}
      borderColor={getBorderColor()}
    >
      { image && <ImageIcon src={image} /> }
    </Container>
  )
}

export default OptionButton