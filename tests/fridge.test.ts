import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ValueList from '../app/components/ValueList.vue'

describe('ValueList', () => {
  it('renders each value with title and body', () => {
    const w = mount(ValueList, { props: { values: [
      { _key: 'v1', title: 'UNCONDITIONAL SUPPORT', body: 'We provide direct assistance.' },
    ] } })
    expect(w.text()).toContain('UNCONDITIONAL SUPPORT')
    expect(w.text()).toContain('direct assistance')
  })
})
