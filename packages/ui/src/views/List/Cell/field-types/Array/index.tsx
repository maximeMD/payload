import React from 'react'
import { useTranslation } from 'react-i18next'

import type { ArrayField } from 'payload/types'
import type { CellComponentProps } from '../../types'

import { getTranslation } from 'payload/utilities'

const ArrayCell: React.FC<CellComponentProps<ArrayField, Record<string, unknown>>> = ({
  data,
  field,
}) => {
  const { i18n, t } = useTranslation('general')
  const arrayFields = data ?? []
  const label = `${arrayFields.length} ${getTranslation(field?.labels?.plural || t('rows'), i18n)}`

  return <span>{label}</span>
}

export default ArrayCell