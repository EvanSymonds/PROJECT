import React from 'react';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import Dropzone from "../../components/basics/dropzone"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import renderer from 'react-test-renderer';

Enzyme.configure({adapter: new EnzymeAdapter()});

test("Renders a working dropzone", () => {

  const testDrop = jest.fn()

  const wrapper = mount(
    <ThemeProvider theme={redGreyTheme}>
      <Dropzone onDrop={testDrop()} disabled={false} />
    </ThemeProvider>
  )

  const d = wrapper.find("[data-test='component-dropzone']")
  
  d.prop("onDrop")

  expect(testDrop).toBeCalledTimes(1)

  const rendered = renderer.create(
    <ThemeProvider theme={redGreyTheme}>
      <Dropzone onDrop={testDrop()} disabled={false} />
    </ThemeProvider>
  )

  expect(rendered.toJSON()).toMatchSnapshot()
})