import React from 'react';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import FileUpload from "../../components/complex/fileUpload"
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import axios from "axios"
import renderer from 'react-test-renderer';

jest.mock('axios');

Enzyme.configure({adapter: new EnzymeAdapter()});

test("Renders a working fileUpload", async () => {

  const testUpdateParent = jest.fn()

  const wrapper = mount(
    <ThemeProvider theme={redGreyTheme}>
      <FileUpload updateParent={testUpdateParent()}/>
    </ThemeProvider>
  )

  const fileInputField = wrapper.find("[id='icon-button-file']")

  fileInputField.simulate("change", {
    target: {
      files: [
        {file: {
          name: "test.txt"
        }}
      ]
    }
  })

  const uploadButton = wrapper.find('[data-test="component-uploadButton"]')

  axios.post.mockResolvedValue({Status: 200})

  uploadButton.simulate("click")

  expect(testUpdateParent).toBeCalledTimes(1)

  const rendered = renderer.create(
    <ThemeProvider theme={redGreyTheme}>
      <FileUpload updateParent={testUpdateParent()}/>
    </ThemeProvider>
  )

  expect(rendered.toJSON()).toMatchSnapshot()

})