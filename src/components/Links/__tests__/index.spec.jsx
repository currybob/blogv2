import React from 'react'
import { shallow } from 'enzyme'
import Links from '../'

describe('Links', () => {
  it('should render', () => {
    const tree = shallow(<Links />)
    expect(tree).toMatchSnapshot()
  })
})
