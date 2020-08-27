import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { STYLES, COLORS, HEADER_HEIGHT } from '../../utils/styleConstants'
import { useHistory } from 'react-router-dom'
import { MAX_SEARCH_QUERY_LENGTH } from '../../utils/constants'

type Props = {
  query: string
  submitHandler: () => void
  changeInputHandler: (query: string) => void
}

const StyledContainer = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 ${STYLES.padding};
  position: sticky;
  top: 0;
  background: white;
  z-index: 1000;
  border-bottom: 1px solid ${STYLES.borderColor};
`
const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  height: calc(${HEADER_HEIGHT} / 2);
`

const StyledButton = styled.button`
  font-size: 22px;
  line-height: 22px;
  color: black;
`

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInput = styled.input`
  width: 90%;
  border: none;
  background-color: white;
  height: 40px;
  border-radius: 8px;
  padding-left: 12px;
  font-size: 16px;
`

const StyledSubmitBtn = styled.button`
  margin-top: 2px;
  img {
    width: 24px;
  }
`

export const SearchBarHeader = (props: Props) => {
  const history = useHistory()
  const { query } = props

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    props.submitHandler()
  }

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.changeInputHandler(e.target.value)
  }

  return (
    <StyledContainer className="header" data-testid="header">
      <StyledHeader>
        <StyledButton className="header-back-button" onClick={() => history.goBack()}>
          <i className="icon">arrow_left</i>
        </StyledButton>
        <StyledForm className="search-form" onSubmit={submitHandler}>
          <StyledInput
            className="search-input"
            type="text"
            ref={inputRef}
            value={query}
            name="query"
            placeholder="B마트 상품을 검색해보세요!"
            autoComplete="off"
            spellCheck={false}
            onChange={changeInputHandler}
            maxLength={MAX_SEARCH_QUERY_LENGTH}
          />
          <StyledButton className="search-submit-btn" type="submit">
            <i className="icon">search</i>
          </StyledButton>
        </StyledForm>
      </StyledHeader>
    </StyledContainer>
  )
}
