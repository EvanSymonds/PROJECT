import React from 'react';
//import ReactDOM from 'react-dom';
import Enzyme, {shallow} from "enzyme"
import EnzymeAdapter from "enzyme-adapter-react-16"
import './index.css';
import Main from './components/pages/main';
import * as serviceWorker from './serviceWorker';

Enzyme.configure({adapter: new EnzymeAdapter()});

test("renders without error", () => {
  const wrapper = shallow(<Main />)
  const mainComponent = wrapper.find("[data-test='component-main']")
  expect(mainComponent.length).toBe(1);
});

serviceWorker.unregister();
