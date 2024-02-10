type StrapiAttributeType =
  | 'string'
  | 'text'
  | 'richtext'
  | 'email'
  | 'password'
  | 'integer'
  | 'biginteger'
  | 'float'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enumeration'
  | 'relation'
  | 'media'
  | 'json'
  | 'uid'
  | 'dynamiczone';

type StrapiEnumeration = {
  type: 'enumeration';
  enum: string[];
  default?: string;
  required?: boolean;
};

type StrapiDynamicZone = {
  type: 'dynamiczone';
  components: string[];
};

export type StrapiAttribute =
  | { type: Exclude<StrapiAttributeType, 'enumeration' | 'dynamiczone'>; required?: boolean }
  | StrapiEnumeration
  | StrapiDynamicZone;

export type StrapiModel = {
  kind: 'collectionType' | 'singleType';
  collectionName: string;
  info: {
    singularName: string;
    pluralName: string;
    displayName: string;
    description?: string;
  };
  options?: {
    draftAndPublish?: boolean;
  };
  pluginOptions?: Record<string, unknown>;
  attributes: Record<string, StrapiAttribute>;
};

export type Content = {
  original: string | null;
  modified: string | null;
  staged: string | null;
};

export type Models = {
  original: StrapiModel;
  modified: StrapiModel;
  staged: StrapiModel;
};
