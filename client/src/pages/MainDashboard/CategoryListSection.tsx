import React, { useState } from 'react'
import { CategoryList } from './CategoryList'
import { CATEGORIES } from '../../utils/constants'
import { CategoryListSectionHeader } from './CategoryListSectionHeader'

type Props = {}

export const CategoryListSection = (props: Props) => {
  const [focusedCategory, selectCategory] = useState<string>(CATEGORIES[0].name)

  const changeFocus = (category: string, flag: 'in' | 'out') => {
    if (flag === 'in' && focusedCategory !== category) {
      selectCategory(category)
    }

    if (flag === 'out') {
      const idx = CATEGORIES.findIndex((c) => c.name === category)
      if (idx > 0) selectCategory(CATEGORIES[idx - 1].name)
    }
  }

  let lazyLoadedIndex = CATEGORIES.findIndex((c) => c.name === focusedCategory)
  if (lazyLoadedIndex < 0) lazyLoadedIndex = CATEGORIES.length

  return (
    <section className="category-list-section">
      <CategoryListSectionHeader focusedCategory={focusedCategory} />
      {CATEGORIES.map((category, idx) => (
        <div className="wrap" key={idx}>
          <CategoryList
            idx={idx}
            category={category.name}
            lazyLoad={idx < lazyLoadedIndex + 2}
            changeFocus={changeFocus}
          />
        </div>
      ))}
    </section>
  )
}
