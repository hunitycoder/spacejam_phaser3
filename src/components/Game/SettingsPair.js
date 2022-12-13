import React from 'react'
import styled from 'styled-components'
import { up } from 'styled-breakpoints'
import RangeSlider from '../RangeSlider'

const Container = styled.div`
  border: 0.0625rem solid #1A9FDB;
  border-radius: 1.125rem;
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: auto;
  grid-template-areas: 
          "icon slider1"
          "icon slider2";
  margin-bottom: 1rem;
  width: 100%;
  &:first-child {
    margin-top: 1rem;
  }
`

const Icon = styled.div`
  align-items: center;
  display: flex;
  grid-area: icon;
  margin: 1.1875rem;
  width: 5.375rem;
  & > img {
    width: 100%;
    height: auto;
  }
  ${up('md')} {
    width: 13rem;
    margin: 2rem;
  }
`

const Setting = styled.div`
  margin: 1.1875rem;
  ${up('md')} {
    margin: 2rem;
  }
`

const FirstSetting = styled(Setting)`
  grid-area: slider1;
  margin-bottom: 1.4375rem;
`
const SecondSetting = styled(Setting)`
  grid-area: slider2;
  margin-top: 0;
`

const Label = styled.h3`
  font-family: ATTAleckCd, sans-serif;
  font-size: 0.9375rem;
  font-weight: bold;
  color: #1A9EDB;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  margin-top: 0;
  ${up('md')} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`

const SettingsPair = ({ settingsDef, params, onSettingUpdate }) => {
  const settings = Object.entries(params).map(([key, param]) => {
    return {key: key, setting: param}
  })

  const on1stChanged = (value) => {
    const newParams = params
    const key = settings[0].key
    newParams[key] = value
    onSettingUpdate(newParams)
  }

  const on2ndChanged = (value) => {
    const newParams = params
    const key = settings[1].key
    newParams[key] = value
    onSettingUpdate(newParams)
  }

  return (
    <Container>
      <Icon>
        <img src={settingsDef.icon} alt={''} />
      </Icon>
      <FirstSetting>
        <Label>{settingsDef.params[settings[0].key].label}</Label>
        <RangeSlider min={0.0} max={1.0} defaultValue={settings[0].setting} step={0.1} onChange={on1stChanged}/>
      </FirstSetting>
      <SecondSetting>
        <Label>{settingsDef.params[settings[1].key].label}</Label>
        <RangeSlider min={0.0} max={1.0} defaultValue={settings[1].setting} step={0.1} onChange={on2ndChanged}/>
      </SecondSetting>
    </Container>
  )
}

export default SettingsPair
