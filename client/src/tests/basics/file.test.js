import React from 'react';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import File from "../../components/basics/file"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import EnzymeToJson from 'enzyme-to-json';

Enzyme.configure({adapter: new EnzymeAdapter()});

test("Renders working file", () => {

  const testUpdateParent = jest.fn()

  const wrapper = mount(
    <ThemeProvider theme={redGreyTheme}>
      <File fileType="jpg" fileName="test.jpg" updateParent={testUpdateParent()} />
    </ThemeProvider>
  )

  const f = wrapper.find("[data-test='component-file']")

  f.prop("updateParent")

  expect(testUpdateParent).toBeCalledTimes(1)

  expect(EnzymeToJson(wrapper)).toMatchSnapshot()

})