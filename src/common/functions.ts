import { Dispatch, SetStateAction } from 'react'
import filter from 'lodash/fp/filter'
import includes from 'lodash/fp/includes'
import toLower from 'lodash/fp/toLower'

import { Ilist } from '../types'

let countSearch = 0
let intervalSearch: NodeJS.Timeout

const executeSearch = (
  list: Ilist[],
  value: string,
  setResult: Dispatch<SetStateAction<Ilist[]>>
) => {
  clearInterval(intervalSearch)
  countSearch = 0

  setResult(
    filter(
      el => {
        const objToString = toLower(JSON.stringify(el))
        return includes(toLower(value), objToString)
      },
      list
    )
  )
}

export const searchObj = (
  list: Ilist[],
  value: string,
  setResult: Dispatch<SetStateAction<Ilist[]>>
) => {
  clearInterval(intervalSearch)
  countSearch = 0

  // for some reason the lodash debounce function doesn't work so I have to make a custom function using setInterval
  intervalSearch = setInterval(() => {
    if (countSearch >= 1000) {
      executeSearch(list, value, setResult)
    } else {
      countSearch += 100
    }
  }, 100)
}
