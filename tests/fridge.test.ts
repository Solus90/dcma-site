import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FridgeValueList from '../app/components/fridge/FridgeValueList.vue'

describe('FridgeValueList', () => {
  it('renders section heading and each value', () => {
    const w = mount(FridgeValueList, { props: {
      heading: 'Why we run it',
      values: [
        { _key: 'v1', title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance.' },
      ],
    } })
    expect(w.text()).toContain('Why we run it')
    expect(w.text()).toContain('UNCONDITIONAL SUPPORT')
    expect(w.text()).toContain('direct assistance')
    expect(w.find('#values-heading').exists()).toBe(true)
  })
})
