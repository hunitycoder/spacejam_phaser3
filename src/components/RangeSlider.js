import React, { useState } from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import TrackImgWhite from '../media/app-ui/slider-white-bg.png'
import TrackImgBlue from '../media/app-ui/slider-blue-bg.png'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Track = styled.div`
  position: absolute;
  top: 5px;
  width: 100%;
  height: 10px;
  ${up('md')} {
    top: 8px;
    height: 20px;
  }
`

const TrackBg = styled.div`
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 16px);
  ${up('md')} {
    width: calc(100% - 32px);
  }
`

//Attrs used because we don't want to generate 100s of classes for each percent.
const TrackLayerBlue = styled(TrackBg).attrs(
  props => ({
    style: {
      clipPath: `inset(0px 0px 0px ${props.percent}%)`,
    },
  }))`
  background-image: url(${TrackImgBlue});
`
//Attrs used because we don't want to generate 100s of classes for each percent.
const TrackLayerWhite = styled(TrackBg).attrs(
  props => ({
    style: {
      clipPath: `inset(0px ${100 - props.percent}% 0px 0px)`,
    },
  }))`
  background-image: url(${TrackImgWhite});
`

const Slider = styled.input`
  appearance: none;
  background: none;
  position: relative;
  width: 100%;
  height: 16px;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
  }
  ${up('md')} {
    height: 32px;

    &::-webkit-slider-thumb {
      width: 32px;
      height: 32px;
    }
    &::-moz-range-thumb {
      width: 32px;
      height: 32px;
    }
  }
`
/**
 * RangeSlider is a styled "range" HTML5 input.
 *
 * Min/max must be a whole number unless step is set to a fractional value!
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
 * @constructor
 */
const RangeSlider = ( { min = 0, max = 100, defaultValue = 50, step, onChange }) => {
  const [percent, setPercent] = useState((defaultValue - min) / (max - min) * 100)

  const changed = (e) => {
    const value = e.target.value
    const decimalValue = (value - min) / (max - min)
    setPercent(decimalValue * 100)
    if (onChange) { onChange(decimalValue)}
  }

  return (
    <Container>
      <Track>
        <TrackLayerWhite percent={percent} />
        <TrackLayerBlue percent={percent} />
      </Track>
      <Slider type={'range'} min={min} max={max} step={step} defaultValue={defaultValue} onChange={changed}/>
    </Container>
  )
}

export default RangeSlider

