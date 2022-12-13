import styled from 'styled-components'
import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import zoomInImage from '../../media/app-ui/button-zoom-in.png'
import zoomOutImage from '../../media/app-ui/button-zoom-out.png'

const Container = styled.button`
  width: 3.125rem;
  height: 3.125rem;
  transform: scale(${(props) => (props.isPressed ? '0.95' : '1')});
  transition: all 60ms ease;
  background-image: url(${({isZoomedIn}) => isZoomedIn ? zoomOutImage : zoomInImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70%;
  background-color: transparent;
  border: none;
  position: absolute;
  right: 0;

  :disabled {
    opacity: 0.5;
  }
`

const ZoomButton = (props) => {
  const { isZoomedIn } = props
  let ref = useRef(null)
  let { buttonProps, isPressed } = useButton(props, ref)

  return (
    <Container
      ref={ref}
      {...buttonProps}
      isPressed={isPressed}
      isZoomedIn={isZoomedIn}
    >
    </Container>
  )
}

export default ZoomButton