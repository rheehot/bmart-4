import React from 'react'
import { ProductCardType } from '../../types/productCard'
import { StyledWrapper } from '../../styles/StyledWrapper'
import { STYLES } from '../../utils/styleConstants'
import styled from 'styled-components'
import { ProductCardList } from './ProductCardList'

export type Props = {
  title: string
  lazyLoad?: boolean
  productList: ProductCardType[]
}

const StyledContainer = styled.div`
  padding: 12px ${STYLES.padding};
  padding-bottom: 0;
  width: 100%;
`
const StyledHeader = styled.div`
  h2 {
    margin: 0;
    line-height: 30px;
  }
`

export const VerticalList = (props: Props) => {
  const { title, productList, lazyLoad } = props

  return (
    <StyledWrapper>
      <StyledContainer>
        <StyledHeader>
          <h2 className="title">{title}</h2>
        </StyledHeader>
        <ProductCardList lazyLoad={lazyLoad} productList={productList} />
      </StyledContainer>
    </StyledWrapper>
  )
}
