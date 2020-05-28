import React from 'react';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import Button from "../../components/basics/button"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import renderer from 'react-test-renderer';

Enzyme.configure({adapter: new EnzymeAdapter()});

describe("Button", () => {

  test("Type: normal contained", () => {
    const testClick = jest.fn()

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normal" variant="contained" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    const b = wrapper.find("[data-test='component-button']")

    b.prop("onClick")

    expect(testClick).toBeCalledTimes(1)

    const normalContainedRendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normal" variant="contained" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    expect(normalContainedRendered.toJSON()).toMatchSnapshot()
  })

  test("Type: normal with icon outlined", () => {
    const testClick = jest.fn()

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normalWithIcon" variant="outlined" icon="GetApp" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    const b = wrapper.find("[data-test='component-button']")

    b.prop("onClick")

    expect(testClick).toBeCalledTimes(1)

    const normalWithIconOutlinedRendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normalWithIcon" variant="outlined" icon="GetApp" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    expect(normalWithIconOutlinedRendered.toJSON()).toMatchSnapshot()
  })

  test("Type: icon", () => {
    const testClick = jest.fn()

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="icon" variant="contained" icon="GetApp" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    const b = wrapper.find("[data-test='component-button']")

    b.prop("onClick")

    expect(testClick).toBeCalledTimes(1)

    const iconRendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="icon" variant="contained" icon="GetApp" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    expect(iconRendered.toJSON()).toMatchSnapshot()
  })

  test("Type: text", () => {
    const testClick = jest.fn()

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normal" variant="text" icon="GetApp" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    const b = wrapper.find("[data-test='component-button']")

    b.prop("onClick")

    expect(testClick).toBeCalledTimes(1)

    const textRendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Button type="normal" variant="text" icon="GetApp" buttonText="Download" color="primary" onClick={testClick()}/>
      </ThemeProvider>
    )

    expect(textRendered.toJSON()).toMatchSnapshot()
  })

})