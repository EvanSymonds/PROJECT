import React from 'react';
import Input from "../../components/basics/input"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import renderer from 'react-test-renderer';

Enzyme.configure({adapter: new EnzymeAdapter()});

describe("Input", () => {

  test("Standard", () => {

    const wrapper = mount(
      <Input type="normal" variant="outlined" color="primary" label="Password"/>
    )

    const i = wrapper.find("[data-test='component-input']").hostNodes()

    expect(i.text()).toBe("PasswordPassword")

    i.simulate("change", {target: {value: "pa55"}})

    expect(i.text()).toBe("pa55pa55")

    const rendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Input type="iconAndHide" variant="standard" color="primary" label="Password"/>
      </ThemeProvider>
    )

    expect(rendered.toJSON).toMatchSnapshot()

  })

  /*test("Filled", () => {

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Input type="normal" variant="filled" color="primary" label="Input"/>
      </ThemeProvider>
    )

    const i = wrapper.find("[data-test='component-input']").hostNodes()

    expect(i.text()).toBe("Input")

    i.simulate("change", {value: "text"})

    expect(i.prop("value").value).toBe("text")

    const rendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Input type="normal" variant="filled" color="primary" label="Input"/>
      </ThemeProvider>
    )

    expect(rendered.toJSON).toMatchSnapshot()

  })

  test("Outlined", () => {

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <Input type="normal" variant="outlined" color="primary" label="Input"/>
      </ThemeProvider>
    )

    const i = wrapper.find("[data-test='component-input']").hostNodes()

    expect(i.text()).toBe("Input")

    i.simulate("change", {value: "text"})

    expect(i.prop("value").value).toBe("text")

    const rendered = renderer.create(
      <ThemeProvider theme={redGreyTheme}>
        <Input type="normal" variant="outlined" color="primary" label="Input"/>
      </ThemeProvider>
    )

    expect(rendered.toJSON).toMatchSnapshot()

  })
  */

})
