import React from 'react';
import { DeepRequired } from 'ts-essentials';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import type { Where } from '../../types/index.js';
import { User } from '../../auth/types.js';
import { PayloadRequest } from '../../express/types.js';
import { Access, Endpoint, EntityDescription, GeneratePreviewURL } from '../../config/types.js';
import { Field } from '../../fields/config/types.js';
import { IncomingGlobalVersions, SanitizedGlobalVersions } from '../../versions/types.js';
import {
  CustomPreviewButtonProps,
  CustomPublishButtonProps,
  CustomSaveButtonProps,
  CustomSaveDraftButtonProps,
} from '../../admin/components/elements/types.js';

export type TypeWithID = {
  id: string | number
}

export type BeforeValidateHook = (args: {
  data?: any;
  req?: PayloadRequest;
  originalDoc?: any;
}) => any;

export type BeforeChangeHook = (args: {
  data: any;
  req: PayloadRequest;
  originalDoc?: any;
}) => any;

export type AfterChangeHook = (args: {
  doc: any;
  previousDoc: any;
  req: PayloadRequest;
}) => any;

export type BeforeReadHook = (args: {
  doc: any;
  req: PayloadRequest;
}) => any;

export type AfterReadHook = (args: {
  doc: any
  req: PayloadRequest
  query?: Where
  findMany?: boolean
}) => any;

export type GlobalAdminOptions = {
  /**
   * Exclude the global from the admin nav and routes
   */
  hidden?: ((args: { user: User }) => boolean) | boolean;
  /**
   * Place globals into a navigational group
   * */
  group?: Record<string, string> | string;
  /**
   * Custom description for collection
   */
  description?: EntityDescription;
  /**
   * Hide the API URL within the Edit view
   */
  hideAPIURL?: boolean
  /**
   * Custom admin components
   */
  components?: {
    views?: {
      Edit?: React.ComponentType<any>
    }
    elements?: {
      /**
       * Replaces the "Save" button
       * + drafts must be disabled
       */
      SaveButton?: CustomSaveButtonProps
      /**
       * Replaces the "Publish" button
       * + drafts must be enabled
       */
      PublishButton?: CustomPublishButtonProps
      /**
       * Replaces the "Save Draft" button
       * + drafts must be enabled
       * + autosave must be disabled
       */
      SaveDraftButton?: CustomSaveDraftButtonProps
      /**
       * Replaces the "Preview" button
       */
      PreviewButton?: CustomPreviewButtonProps
    },
  };
  /**
   * Function to generate custom preview URL
   */
  preview?: GeneratePreviewURL
}

export type GlobalConfig = {
  slug: string
  label?: Record<string, string> | string
  graphQL?: {
    name?: string
  } | false
  /**
   * Options used in typescript generation
   */
  typescript?: {
    /**
     * Typescript generation name given to the interface type
     */
    interface?: string
  }
  versions?: IncomingGlobalVersions | boolean
  hooks?: {
    beforeValidate?: BeforeValidateHook[]
    beforeChange?: BeforeChangeHook[]
    afterChange?: AfterChangeHook[]
    beforeRead?: BeforeReadHook[]
    afterRead?: AfterReadHook[]
  }
  endpoints?: Omit<Endpoint, 'root'>[] | false
  access?: {
    read?: Access;
    readDrafts?: Access;
    readVersions?: Access;
    update?: Access;
  }
  fields: Field[];
  admin?: GlobalAdminOptions
  /** Extension point to add your custom data. */
  custom?: Record<string, any>;
}

export interface SanitizedGlobalConfig extends Omit<DeepRequired<GlobalConfig>, 'fields' | 'versions' | 'endpoints'> {
  fields: Field[]
  endpoints: Omit<Endpoint, 'root'>[] | false
  versions: SanitizedGlobalVersions
}

export type Globals = {
  config: SanitizedGlobalConfig[]
  graphQL?: {
    [slug: string]: {
      type: GraphQLObjectType
      mutationInputType: GraphQLNonNull<any>
      versionType?: GraphQLObjectType
    }
  } | false
}