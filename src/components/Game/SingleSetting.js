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
  grid-template-areas: "icon slider";
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
  }
`

const Setting = styled.div`
  grid-area: slider;
  margin: 1.1875rem 1.1875rem 1.4375rem;
  ${up('md')} {
    align-self: center;
    margin: 2rem;
  }
`

const NoIconSetting = styled.div`
  grid-area: span 2 / span 2;
  text-align: center;
  margin: 1.375rem 4rem;
`

const Name = styled.h2`
  font-family: ATTAleckCd, sans-serif;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.1rem;
  margin-top: 0;
  ${up('md')} {
    font-size: 2.125rem;
    margin-bottom: 0.3rem;
  }
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

const RangeLabels = styled.div`
  color: #1A9EDB;
  display: flex;
  font-size: 0.625rem;
  justify-content: space-between;
  text-transform: uppercase;

  & > * {
    letter-spacing: 0.03125rem;
    margin: 0 0 0.1875rem;
    opacity: 0.5;
  }
  ${up('md')} {
    font-size: 1rem;
    font-weight: bold;
  }

`

const SingleSetting = ({ params, settingDef, onSettingUpdate }) => {
  const paramEntries = Object.entries(params)
  if (paramEntries.length > 1) {
    console.error('SingeSetting expects a params object with only a single parameter.')
    return <></>
  }

  const setting = paramEntries.map(([key, param]) => {
    return {key: key, setting: param}
  })[0]

  const onChanged = (value) => {
    const newParams = params
    const key = setting.key
    newParams[key] = value
    onSettingUpdate(newParams)
  }

  const label = settingDef.params[setting.key].label
  const initialVal = setting.setting

  return (
    <Container>
      {settingDef.icon && <Icon>
        <img src={settingDef.icon} alt={''}/>
      </Icon>}
      {settingDef.icon &&
      <Setting>
        <Name>{settingDef.name}</Name>
        <Label>{label}</Label>
        <RangeLabels><p>Off</p><p>Max</p></RangeLabels>
        <RangeSlider min={0.0} max={1.0} defaultValue={initialVal} step={0.1} onChange={onChanged}/>
      </Setting>}
      {!settingDef.icon &&
      <NoIconSetting>
        <Name>{settingDef.name}</Name>
        <Label>{label}</Label>
        <RangeLabels><p>Off</p><p>Max</p></RangeLabels>
        <RangeSlider min={0.0} max={1.0} defaultValue={initialVal} step={0.1} onChange={onChanged}/>
      </NoIconSetting>
      }
    </Container>
  )
}

export default SingleSetting
