import React, { useRef, MouseEvent, useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { MAX_PRODUCT_PURCHASE_LIMIT, MIN_PRODUCT_PURCHASE_LIMIT } from '../../utils/constants'
import { useMutation } from '@apollo/client'
import { ADD_PRODUCT_TO_CART, AddProductToCartVars } from '../../apis/graphqlQuery'
import { parseToLocalMoneyString } from '../../utils/parser'

type Props = {
  id: string
  name: string
  price: number
  thumbnailSrc: string
  savedCount: number
  setSavedCount: (count: number) => void
  setIsModalVisible: (flag: boolean) => void
  setIsOrderPlaced: (flag: boolean) => void
}

const StyledExitButton = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 30px;
  border-radius: 50%;
  color: #888;
  background-color: #eee;
  width: 35px;
  height: 35px;
  text-align: center;
  user-select: none;
  i {
    margin: auto auto;
  }
  &:focused {
    background-color: #ccc;
  }
`

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;

  .order-modal-overlay {
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: absolute;
  }

  @keyframes slideUpModal {
    0% {
      transform: translateY(400px);
    }
    100% {
      transform: translateY(0);
    }
  }
`

const StyledModalContent = styled.div`
  position: absolute;
  bottom: 0;
  padding: 16px;
  display: flex;
  width: 100%;
  height: 40%;
  background-color: white;
  border-radius: 20px 20px 0 0;
  animation: 0.3s ease-in slideUpModal;

  justify-items: stretch;
  align-items: center;

  .order-modal-content-thumbnail {
    width: 100%;
  }

  .order-modal-content-data {
    margin: 0px 15px 0 15px;
    p {
      font-size: 2em;
    }
    .order-modal-content-name {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .order-modal-content-price {
      font-weight: 300;
    }
  }
`
const StyledModalError = styled.p`
  grid-column: 1/13;
  align-self: start;
  color: red;
  font-size: 12px;
  text-align: center;
`

const StyledWrapper = styled.div`
  margin: 0 0 0 20px;
`

const StyledModalOrderButton = styled.button`
  position: fixed;
  bottom: 15px;
  left: 5%;
  z-index: 2000;
  width: 90%;
  border: 1px solid #bbb;
  border-radius: 5px;
  padding: 15px 0;
  background-color: #fff;
`

const StyledController = styled.div`
  margin: 10px 15px 0px 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  border-radius: 20px;
  background-color: #bbb;
  font-size: 30px;
  color: #fff;

  button {
    font-size: 30px;
    width: 100%;
    height: 100%;
  }
`

type State = {
  count: number
  error: string
  isErrorVisible: boolean
}

type Action = {
  type: string
}

const modalReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment': {
      return state.count >= MAX_PRODUCT_PURCHASE_LIMIT
        ? {
            ...state,
            error: `최대 ${MAX_PRODUCT_PURCHASE_LIMIT}개 까지 구매 가능합니다`,
            isErrorVisible: true,
          }
        : {
            ...state,
            isErrorVisible: false,
            count: state.count + 1,
          }
    }
    case 'decrement': {
      return state.count <= MIN_PRODUCT_PURCHASE_LIMIT
        ? {
            ...state,
            error: '최소 구매 수량입니다',
            isErrorVisible: true,
          }
        : {
            ...state,
            isErrorVisible: false,
            count: state.count - 1,
          }
    }
    default:
      break
  }
  return state
}

export const OrderModal = (props: Props) => {
  const { id, name, price, thumbnailSrc, savedCount } = props

  const initialState: State = {
    count: savedCount,
    error: '',
    isErrorVisible: false,
  }
  const [state, dispatch] = useReducer(modalReducer, initialState)
  const modalOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    props.setSavedCount(state.count)
  }, [state.count])

  const [addProductToCart] = useMutation<{}, AddProductToCartVars>(ADD_PRODUCT_TO_CART)

  const exitButtonHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    props.setIsModalVisible(false)
  }
  const clickOutsideModalHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.target === modalOverlayRef.current) props.setIsModalVisible(false)
  }

  const clickOrderButtonHandler = () => {
    addProductToCart({
      variables: { productId: id, quantity: state.count },
    })
    props.setIsModalVisible(false)
    props.setIsOrderPlaced(true)
    props.setSavedCount(1)
  }

  return (
    <StyledContainer className="order-modal" onClick={clickOutsideModalHandler}>
      <div className="order-modal-overlay" ref={modalOverlayRef} />
      <StyledModalContent className="order-modal-content">
        <StyledExitButton onClick={exitButtonHandler}>
          <i className="icon">multiply</i>
        </StyledExitButton>
        <img
          className="order-modal-content-thumbnail"
          src={thumbnailSrc}
          alt={`order-modal-thumbnail-${id}`}
        />
        <StyledWrapper>
          <div className="order-modal-content-data">
            <p className="order-modal-content-name">{name}</p>
            <p className="order-modal-content-price">{parseToLocalMoneyString(price)}원</p>
          </div>
          <StyledController className="order-modal-controller">
            <button
              className="order-modal-controller-decrement-btn"
              onClick={() => dispatch({ type: 'decrement' })}
            >
              -
            </button>
            <p className="order-modal-controller-quantity">{state.count}</p>
            <button
              className="order-modal-controller-increment-btn"
              onClick={() => dispatch({ type: 'increment' })}
            >
              +
            </button>
          </StyledController>
        </StyledWrapper>
        {state.isErrorVisible ? <StyledModalError>{state.error}</StyledModalError> : ''}
        <StyledModalOrderButton
          className="order-modal-content-order-btn"
          onClick={clickOrderButtonHandler}
        >
          장바구니에 담기
        </StyledModalOrderButton>
      </StyledModalContent>
    </StyledContainer>
  )
}
