* Shallow rendering the component
```js
import { shallow } from 'enzyme';
describe('MyComponent', () => {
  it('Shallow rendering', () => {
    const wrapper = shallow(<MyComponent {..props}/>);
  });
});
```

* Accessing methods like state/props using **wrapper**
```js
import {shallow} from 'enzyme';
describe('MyComponent component', () => {
  it('Shallow rendering', () => {
    const wrapper = shallow(<MyComponent someProp={1}/>);
    const componentInstance = wrapper.instance();
    //react lifecyle methods
    componentInstance.componentDidMount();
    componentInstance.componentWillMount();
    //component state
    expect(wrapper.state('someStateKey')).toBe(true);
    //component props
    expect(wrapper.props.someProp).toEqual(1);
    //Accessing class methods
    expect(componentInstance.counter(1)).toEqual(2);
  });
});
```

