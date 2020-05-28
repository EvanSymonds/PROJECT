import React from 'react';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import ProgressBar from "../../components/basics/progressBar"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import renderer from 'react-test-renderer';

Enzyme.configure({adapter: new EnzymeAdapter()});

test("Progress bar renders correctly", () => {

  const wrapper = mount(
    <ThemeProvider theme={redGreyTheme}>
      <ProgressBar progress="50"/>
    </ThemeProvider>
  )

  const pb = wrapper.find("[test-data='component-progressBar']")

  expect(pb.length).toBe(1)

  const rendered = renderer.create(
    <ThemeProvider theme={redGreyTheme}>
      <ProgressBar progress="50"/>
    </ThemeProvider>
  )

    expect(rendered.toJSON()).toMatchSnapshot()

})