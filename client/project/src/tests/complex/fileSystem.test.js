import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import Enzyme, { mount } from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"
import FileSystem from "../../components/complex/fileSystem"
import axios from "axios"
import renderer from 'react-test-renderer';

jest.mock('axios');
afterEach(cleanup)

Enzyme.configure({adapter: new EnzymeAdapter()});

describe("File system", () => {
  test("Renders all files", async () => {

    const data = {
      "rows": [
        {
            "file_data_id": 17095,
            "file_type": "txt",
            "file_name": "test.txt",
            "file_id": "624",
            "project_id": "2"
        },
        {
          "file_data_id": 17096,
          "file_type": "jpg",
          "file_name": "image.jpg",
          "file_id": "625",
          "project_id": "2"
        }
      ]
    }
  
    axios.get.mockResolvedValue({status: 200, data: data})
  
    const { getAllByTestId } = render(
      <ThemeProvider theme={redGreyTheme}>
        <FileSystem/>
      </ThemeProvider>
    )
  
    const files = await waitForElement(() => getAllByTestId('component-file'));
  
    expect(files.length).toBe(2)
  
    
  
  })

  test("Renders upload component", () => {
    console.error = jest.fn();

    const wrapper = mount(
      <ThemeProvider theme={redGreyTheme}>
        <FileSystem/>
      </ThemeProvider>
    )

    const b = wrapper.find('[data-test="component-showUploaderButton"]')

    b.simulate("click")

    const fu = wrapper.find('[data-test="component-fileUpload"]')

    expect(fu.length).toBe(1)
  })
})
