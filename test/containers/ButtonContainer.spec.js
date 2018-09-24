import React from 'react';
import Enzyme, { mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'react-router-redux';
import ButtonContainer from '../../app/views/VesicleAnalyzer/containers/ButtonContainer';
import { configureStore } from '../../app/store/configureStore';
import { shallowEqual } from 'recompose';

Enzyme.configure({ adapter: new Adapter() });

function setup(initialState) {
  const store = configureStore(initialState);
  const history = createBrowserHistory();
  const provider = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ButtonContainer scale={4.5} />
      </ConnectedRouter>
    </Provider>
  );
  const app = mount(provider);
  return {
    app,
    buttons: app.find('button'),
    scale: app.find('input')
  };
}

describe('containers', () => {
  describe('ButtonContainer', () => {
    it('should display description', () => {
        const { buttons } = setup();
        expect(buttons.at(0).text()).toMatch("Back")
        expect(buttons.at(1).text()).toMatch("Load files")
        expect(buttons.at(2).text()).toMatch("Calculate All")
        expect(buttons.at(3).text()).toMatch("Save to excel")
        
    });
    it('should have scale', () => {
        const { scale } = setup();
        expect(scale.at(0).props().value).toBe(4.5)
    })
  });
});
