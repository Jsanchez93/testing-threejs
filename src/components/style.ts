import styled from 'styled-components'

export const SearchContainer = styled.form`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  left: 0;
  padding: 10px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
  & .helper {
    background-color: transparent;
    height: 1px;
    width: 100%;
  }
  & div {
    display: flex;
    & input,
    & button {
      background-color: white;
      border: 1px solid rgba(0, 0, 0, 0.3);
      display: block;
      box-sizing: border-box;
      height: 40px;
      margin: 0;
      z-index: 110;
    }
    & input {
      border-radius: 5px 0 0 5px;
      border-right-width: 0;
      font-size: 16px;
      width: 320px;
      &:focus {
        outline: none;
      }
    }
    & button {
      border-radius: 0 5px 5px 0;
      border-left-width: 0;
    }
  }
`

export const ModalBody = styled.div`
  padding: 10px 15px;
  position: relative;
  & img {
    display: block;
    margin: 0 auto 10px auto;
  }
  & svg {
    color: #a4261f;
    position: absolute;
    right: 10px;
    top: 5px;
  }
`

export const SearchResult = styled.div`
  background-color: white;
  border-radius: 0 0 5px 5px;
  height: auto;
  max-height: calc(100vh - 120px);
  max-width: 345px;
  overflow-y: auto;
  width: 100%;
  & ul {  
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    & li {
      padding: 6px 10px;
      transition: background-color 0.1s linear;
      width: 100%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.1s linear;
      }
    }
  }
`
