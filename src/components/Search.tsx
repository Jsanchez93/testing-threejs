import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

import { Ilist } from '../types'
import { searchObj } from '../common/functions'

import { focusTree } from './process'
import { SearchContainer } from './style'

import list from './example.json'

export const Search: React.FC = () => {
  const [string, setString] = useState('')
  const [result, setResult] = useState<Ilist[]>([])

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    searchObj(list, string, setResult)
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget
    setString(value)

    if (value) {
      searchObj(list, value, setResult)
    } else {
      setResult([])
    }
  }

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={string}
          onChange={handleChange}
          onClick={ev => ev.stopPropagation()}
          name="search-string"
        />
        <button type="submit" className="cursor">
          <MdSearch size={20} />
        </button>
      </div>
      <span className="helper" />
      <ul>
        {result.map(el => (
          <li
            key={el.id}
            onClick={ev => {
              ev.stopPropagation()
              focusTree(el)
              setString(el.name)
              setResult([])
            }}
          >
            {el.name}-{el.date}
          </li>
        ))}
      </ul>
    </SearchContainer>
  )
}
