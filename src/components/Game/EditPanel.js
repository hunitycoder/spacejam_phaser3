import React, { useMemo } from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import RangeSlider from '../RangeSlider'
import FancyText from '../FancyText'
import { Button } from '../Buttons/Button'
import OptionButton from '../Buttons/OptionButton'
import bgDesktopImage from '../../media/app-ui/main-bg-desktop.png'
import bgMobileImage from '../../media/app-ui/main-bg-mobile.png'

import SettingsPair from './SettingsPair'
import SingleSetting from './SingleSetting'
import { BALL_COLORS, TRAIL_COLORS, BASKET_COLORS, OBSTACLES, POWERUPS, PHYSICS } from '../../constants/params'

const Container = styled.div`
  background-image: url(${bgMobileImage});
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 20;
  align-items: center;
  display: flex;
  flex-direction: column;
  ${up('md')} {
    background-image: url(${bgDesktopImage});
    top: 0;
    left: 35.5%;
    width: 64.5%;
    background-image: none;
    background-color: black;
    justify-content: center;
  }
`
const Title = styled.div`
  margin: 0.6rem;
  ${up('md')} {
    display: none;
  }
`
const WidgetsContainer = styled.div`
  width: 90%;
  background-color: #0F3D58;
  border: 0.125rem solid #1A9FDB;
  box-sizing: border-box;
  border-radius: 1.125rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  ${up('md')} {
    width: 70%;
    border-width: 0.3125rem;
  }
`
const Label = styled.h3`
  font-family: ATTAleckCd;
  font-size: 0.9375rem;
  font-weight: bold;
  color: #1A9EDB;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  ${up('md')} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 3rem;
    }
`
const OptionRow = styled.div`
  display: flex;
`
const BallImage = styled.img`
  width: 6.25rem;
  height: 6.25rem;
  margin-top: 1rem;
  ${up('md')} {
    width: 18rem;
    height: 18rem;
    margin-top: 2rem;
  }  
`
const HoopImage = styled.img`
  width: 9.25rem;
  height: 9.25rem;
  margin-top: 1rem;
  ${up('md')} {
    width: 24rem;
    height: 24rem;
    margin-top: 2rem;
  }
`
const RangeContainer = styled.div`
  width: 12rem;
  margin-bottom: 2rem;
  ${up('md')} {
    width: 22rem;
    margin-bottom: 4rem;
  }  
`
const BottomButtonRow = styled.div`
  flex-grow: 1;
  align-items: center;
  width: 90%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  ${up('md')} {
    display: none;
  }
`

const EditPanel = ({ name, params, updateParams, onClosePanel }) => {

  const Widgets = useMemo(() => {

    // used for option swatches and simple range sliders
    const onChange = (paramKey, newValue) => {
      updateParams(prevParams => {
        const allParams = {...prevParams}
        allParams[name][paramKey] = newValue
        return allParams
      })
    }

    // used for settings pair and single setting sliders
    const onUpdated = (idx, newValue) => {
      const paramKey = Object.keys(params[name])[idx]
      updateParams(prevParams => {
        const allParams = {...prevParams}
        allParams[name][paramKey] = newValue
        return allParams
      })
    }

    // console.log('params for panel', pendingParam)
    switch (name) {
    case 'ball':
      return <>
        <BallImage src={BALL_COLORS[params.ball.ballColor]} />
        <Label>Ball Color</Label>
        <OptionRow>
          {BALL_COLORS.map((ballImage, index) => (
            <OptionButton
              key={index}
              isActive={params.ball.ballColor === index}
              image={ballImage}
              onPress={() => onChange('ballColor', index)}
            />
          ))}
        </OptionRow>
        <Label>Movement Trail Color</Label>
        <OptionRow>
          {TRAIL_COLORS.map((color, index) => (
            <OptionButton
              key={index}
              isActive={params.ball.trailColor === index}
              color={color}
              onPress={() => onChange('trailColor', index)}
            />
          ))}
        </OptionRow>
        <Label>Movement Trail Length</Label>
        <RangeContainer>
          <RangeSlider
            min={0.0}
            max={1.0}
            step={0.1}
            defaultValue={params.ball.trailLength}
            onChange={onChange.bind(this, 'trailLength')}
          />
        </RangeContainer>
      </>
    case 'hoop':
      return <>
        <HoopImage src={BASKET_COLORS[params.hoop.color]} />
        <Label>Hoop Color</Label>
        <OptionRow>
          {BASKET_COLORS.map((basketImage, index) => (
            <OptionButton
              key={index}
              isActive={params.hoop.color === index}
              image={basketImage}
              onPress={() => onChange('color', index)}
            />
          ))}
        </OptionRow>
        <Label>Hoop Size</Label>
        <RangeContainer>
          <RangeSlider
            min={0.0}
            max={1.0}
            step={0.1}
            defaultValue={params.hoop.size}
            onChange={onChange.bind(this, 'size')}
          />
        </RangeContainer>
      </>
    case 'obstacles': {
      return (
        Object.entries(params[name]).map(([name, params], i) => {
          return <SettingsPair key={`os${i}`} settingsDef={OBSTACLES[name]} params={params}
            onSettingUpdate={onUpdated.bind(this, i)}/>
        })
      )
    }
    case 'powerUps': {
      return (
        Object.entries(params[name]).map(([name, params], i) => {
          return <SingleSetting key={`pu${i}`} settingDef={POWERUPS[name]} params={params}
            onSettingUpdate={onUpdated.bind(this, i)}/>
        })
      )
    }
    case 'physics': {
      return (
        Object.entries(params[name]).map(([name, params], i) => {
          return <SingleSetting key={`pu${i}`} settingDef={PHYSICS[name]} params={params}
            onSettingUpdate={onUpdated.bind(this, i)}/>
        })
      )
    }
    default:
      return <div>Unknown setting</div>
    }
  }, [name, params, updateParams])

  return (
    <Container>
      <Title>
        <FancyText text={name} />
      </Title>
      <WidgetsContainer>
        {Widgets}
      </WidgetsContainer>
      <BottomButtonRow>
        <Button onPress={onClosePanel}>Back</Button>
      </BottomButtonRow>
    </Container>
  )
}

export default EditPanel
