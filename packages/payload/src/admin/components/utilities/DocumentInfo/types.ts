import React from 'react';
import { CollectionPermission, GlobalPermission } from '../../../../auth/types.js';
import { SanitizedCollectionConfig, TypeWithID, TypeWithTimestamps } from '../../../../collections/config/types.js';
import { SanitizedGlobalConfig } from '../../../../globals/config/types.js';
import type { PaginatedDocs } from '../../../../database/types.js';
import { TypeWithVersion } from '../../../../versions/types.js';

export type Version = TypeWithVersion<any>

export type DocumentPermissions = null | GlobalPermission | CollectionPermission

export type ContextType = {
  collection?: SanitizedCollectionConfig
  global?: SanitizedGlobalConfig
  slug?: string
  id?: string | number
  preferencesKey?: string
  versions?: PaginatedDocs<Version>
  unpublishedVersions?: PaginatedDocs<Version>
  publishedDoc?: TypeWithID & TypeWithTimestamps & { _status?: string }
  getVersions: () => Promise<void>
  docPermissions: DocumentPermissions
  getDocPermissions: () => Promise<void>
  setDocFieldPreferences: (field: string, fieldPreferences: { [key: string]: unknown }) => void
  getDocPreferences: () => Promise<{ [key: string]: unknown }>
}

export type Props = {
  collection?: SanitizedCollectionConfig
  global?: SanitizedGlobalConfig
  id?: string | number
  idFromParams?: boolean
  children?: React.ReactNode
}