import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import Counter from '../Counter.component';

describe('Counter component', () => {
  it('Counter: renders correctly', () => {
    const tree = renderer.create(<Counter />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('componentWillMount: should set the passed initialCountValue to state', () => {
    const wrapper = shallow(<Counter initialCountValue={2}/>);
    expect(wrapper.instance().state.count).toBe(2);
  });
  it('incrementCounter: should increment state.count by 1', () => {
    const wrapper = shallow(<Counter initialCountValue={0}/>);
    const instance = wrapper.instance();
    expect(instance.state.count).toBe(0);
    instance.incrementCounter();
    expect(instance.state.count).toBe(1);
  });
  it('decrementCounter: should decrement state.count by 1', () => {
    const wrapper = shallow(<Counter initialCountValue={1}/>);
    const instance = wrapper.instance();
    expect(instance.state.count).toBe(1);
    instance.decrementCounter();
    expect(instance.state.count).toBe(0);
  });
  it('should call props on increment/decrement', () => {
    const incrementSpy = jest.fn();
    const decrementSpy = jest.fn();
    const wrapper = shallow(<Counter initialCountValue={1} onIncrement={incrementSpy} onDecrement={decrementSpy}/>);
    const instance = wrapper.instance();
    instance.incrementCounter();
    expect(incrementSpy).toBeCalledWith(2);
    instance.decrementCounter();
    expect(decrementSpy).toBeCalledWith(1);
  });
});