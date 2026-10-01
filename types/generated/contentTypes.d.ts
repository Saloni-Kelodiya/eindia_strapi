import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON & Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordTokenExpiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAboutAbout extends Struct.SingleTypeSchema {
  collectionName: 'abouts';
  info: {
    description: 'Write about yourself and the content you create';
    displayName: 'About';
    pluralName: 'abouts';
    singularName: 'about';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blocks: Schema.Attribute.DynamicZone<
      ['shared.media', 'shared.quote', 'shared.rich-text', 'shared.slider']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::about.about'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAgeRatingAgeRating extends Struct.CollectionTypeSchema {
  collectionName: 'age_ratings';
  info: {
    displayName: 'Age Rating';
    pluralName: 'age-ratings';
    singularName: 'age-rating';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::age-rating.age-rating'
    > &
      Schema.Attribute.Private;
    movies: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiArticleViewArticleView extends Struct.CollectionTypeSchema {
  collectionName: 'article_views';
  info: {
    displayName: 'Article View';
    pluralName: 'article-views';
    singularName: 'article-view';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    article: Schema.Attribute.Relation<'manyToOne', 'api::article.article'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::article-view.article-view'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    system_id: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiArticleArticle extends Struct.CollectionTypeSchema {
  collectionName: 'articles';
  info: {
    description: 'Entertainment news articles';
    displayName: 'Article';
    pluralName: 'articles';
    singularName: 'article';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Authors: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    body: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 500;
      }>;
    canonical_url: Schema.Attribute.String;
    category: Schema.Attribute.Relation<'manyToMany', 'api::category.category'>;
    comment: Schema.Attribute.Relation<'oneToMany', 'api::comment.comment'>;
    cons_1: Schema.Attribute.String;
    cons_2: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    firstPublishedAt: Schema.Attribute.DateTime;
    gallery: Schema.Attribute.Relation<'manyToMany', 'api::gallery.gallery'>;
    genres: Schema.Attribute.Relation<'manyToMany', 'api::genre.genre'>;
    h1_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    hero_image: Schema.Attribute.Media<'images'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    > &
      Schema.Attribute.Private;
    MainCategory: Schema.Attribute.Enumeration<['news', 'article']>;
    meta_description: Schema.Attribute.Text;
    meta_keywords: Schema.Attribute.String;
    moderation_status: Schema.Attribute.Enumeration<
      ['draft', 'pending', 'published', 'archived', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    movie: Schema.Attribute.Relation<'manyToOne', 'api::movie.movie'>;
    primary_image_alt: Schema.Attribute.String;
    pros_1: Schema.Attribute.String;
    pros_2: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal;
    reading_time: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    related_to: Schema.Attribute.Enumeration<
      ['Movie Reviews', 'Music', 'Fashion', 'Awards']
    >;
    releaseYear: Schema.Attribute.BigInteger;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sponsor_meta: Schema.Attribute.JSON;
    sponsored: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    tags: Schema.Attribute.Relation<'manyToMany', 'api::tag.tag'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    tv_shows: Schema.Attribute.Relation<'manyToMany', 'api::show.show'>;
    typecontent: Schema.Attribute.Enumeration<
      ['LatestNews', 'CelebrityNews', 'ViralNews']
    >;
    updated_datetime: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.Relation<'manyToOne', 'api::video.video'>;
    views: Schema.Attribute.BigInteger;
    watching_platform: Schema.Attribute.Component<
      'watching-platform.platform',
      true
    >;
    web_series: Schema.Attribute.Relation<
      'manyToMany',
      'api::web-series.web-series'
    >;
  };
}

export interface ApiAuthorRequestAuthorRequest
  extends Struct.CollectionTypeSchema {
  collectionName: 'author_requests';
  info: {
    displayName: 'Author-Request';
    pluralName: 'author-requests';
    singularName: 'author-request';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    applicant: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::author-request.author-request'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    request_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAuthorAuthor extends Struct.CollectionTypeSchema {
  collectionName: 'authors';
  info: {
    description: 'Content authors';
    displayName: 'Author';
    pluralName: 'authors';
    singularName: 'author';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    bio: Schema.Attribute.RichText;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::author.author'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    social_links: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAwardAward extends Struct.CollectionTypeSchema {
  collectionName: 'awards';
  info: {
    displayName: 'Award';
    pluralName: 'awards';
    singularName: 'award';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    awardCategories: Schema.Attribute.Component<
      'awards.award-categories',
      true
    >;
    categories: Schema.Attribute.String;
    countriesRepresented: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date;
    description: Schema.Attribute.Blocks;
    firstPublishedAt: Schema.Attribute.DateTime;
    host: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files'>;
    industry_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::category.category'
    >;
    language: Schema.Attribute.Enumeration<['en', 'hi']>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::award.award'> &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String;
    totalNominations: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wikipediaUrl: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface ApiCategoryCategory extends Struct.CollectionTypeSchema {
  collectionName: 'categories';
  info: {
    description: 'Content categories';
    displayName: 'Category';
    pluralName: 'categories';
    singularName: 'category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    awards: Schema.Attribute.Relation<'oneToMany', 'api::award.award'>;
    celebrities_profiles: Schema.Attribute.Relation<
      'manyToMany',
      'api::celebrities-profile.celebrities-profile'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    galleries: Schema.Attribute.Relation<'manyToMany', 'api::gallery.gallery'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::category.category'
    > &
      Schema.Attribute.Private;
    movies: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    seoinfo: Schema.Attribute.Component<'seo.seo-info', false>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    songs: Schema.Attribute.Relation<'manyToMany', 'api::song.song'>;
    tv_shows: Schema.Attribute.Relation<'manyToMany', 'api::show.show'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    web_series: Schema.Attribute.Relation<
      'manyToMany',
      'api::web-series.web-series'
    >;
  };
}

export interface ApiCelebritiesProfileCelebritiesProfile
  extends Struct.CollectionTypeSchema {
  collectionName: 'celebrities_profiles';
  info: {
    displayName: 'Celebrities profile';
    pluralName: 'celebrities-profiles';
    singularName: 'celebrities-profile';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Avatar: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    awards: Schema.Attribute.Component<'award.award', true>;
    Bio: Schema.Attribute.RichText;
    Birthdate: Schema.Attribute.Date;
    carrerTimeline: Schema.Attribute.Component<
      'career-timeline.career-timeline',
      true
    >;
    category: Schema.Attribute.Relation<'manyToMany', 'api::category.category'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deathDate: Schema.Attribute.Date;
    familyDetails: Schema.Attribute.Component<
      'family-details.celebirity',
      false
    >;
    firstPublishedAt: Schema.Attribute.DateTime;
    galleries: Schema.Attribute.Relation<'oneToMany', 'api::gallery.gallery'>;
    industry: Schema.Attribute.Relation<'oneToMany', 'api::industry.industry'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::celebrities-profile.celebrities-profile'
    > &
      Schema.Attribute.Private;
    movies: Schema.Attribute.Relation<'manyToMany', 'api::movie.movie'>;
    name: Schema.Attribute.String;
    personalLife: Schema.Attribute.Component<'personal-life.celebirity', false>;
    popularname: Schema.Attribute.String;
    professions: Schema.Attribute.Relation<
      'oneToMany',
      'api::profession.profession'
    >;
    profile_bg_poster: Schema.Attribute.Media<'images' | 'files'>;
    publishedAt: Schema.Attribute.DateTime;
    relatedCelebrity: Schema.Attribute.Component<
      'related-celebrity.related-celebrity',
      true
    >;
    Slug: Schema.Attribute.UID<'name'>;
    social_account: Schema.Attribute.Component<
      'social-media-account.social-account',
      true
    >;
    tagline: Schema.Attribute.String;
    total_awards: Schema.Attribute.BigInteger;
    total_movies: Schema.Attribute.BigInteger;
    total_tvshows: Schema.Attribute.BigInteger;
    total_webseries: Schema.Attribute.BigInteger;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    upcomingprojects: Schema.Attribute.Component<
      'upcoming-projects.celebirity-projects',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommentComment extends Struct.CollectionTypeSchema {
  collectionName: 'comments';
  info: {
    description: 'User comments with moderation';
    displayName: 'Comment';
    pluralName: 'comments';
    singularName: 'comment';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    article: Schema.Attribute.Relation<'manyToOne', 'api::article.article'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::comment.comment'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    moderation_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    news: Schema.Attribute.Relation<'manyToOne', 'api::news-item.news-item'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiContactMessageContactMessage
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_messages';
  info: {
    displayName: 'contact-message';
    pluralName: 'contact-messages';
    singularName: 'contact-message';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-message.contact-message'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    subject: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGalleryGallery extends Struct.CollectionTypeSchema {
  collectionName: 'galleries';
  info: {
    description: 'Photo galleries';
    displayName: 'Gallery';
    pluralName: 'galleries';
    singularName: 'gallery';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::category.category'
    >;
    celebrity_name: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    event: Schema.Attribute.String;
    event_date: Schema.Attribute.Date;
    fashionCategory: Schema.Attribute.Enumeration<
      [
        'red-carpet',
        'casual',
        'photoshoot',
        ' trends',
        ' all',
        'met gala',
        'pink-carpet',
      ]
    >;
    firstPublishedAt: Schema.Attribute.DateTime;
    image: Schema.Attribute.Media<'files' | 'images'> &
      Schema.Attribute.Required;
    language: Schema.Attribute.Enumeration<['en ', 'hi']> &
      Schema.Attribute.DefaultTo<'en '>;
    likes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::gallery.gallery'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    photos: Schema.Attribute.Component<'gallary.photo-item', true>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGenreGenre extends Struct.CollectionTypeSchema {
  collectionName: 'genres';
  info: {
    displayName: 'Genres';
    pluralName: 'genres';
    singularName: 'genre';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::genre.genre'> &
      Schema.Attribute.Private;
    movies: Schema.Attribute.Relation<'manyToMany', 'api::movie.movie'>;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'>;
    tv_shows: Schema.Attribute.Relation<'manyToMany', 'api::show.show'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    web_series: Schema.Attribute.Relation<
      'manyToMany',
      'api::web-series.web-series'
    >;
  };
}

export interface ApiGlobalGlobal extends Struct.SingleTypeSchema {
  collectionName: 'globals';
  info: {
    description: 'Define global settings';
    displayName: 'Global';
    pluralName: 'globals';
    singularName: 'global';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    defaultSeo: Schema.Attribute.Component<'shared.seo', false>;
    favicon: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::global.global'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    siteDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    siteName: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGoogleReportGoogleReport
  extends Struct.CollectionTypeSchema {
  collectionName: 'google_reports';
  info: {
    displayName: 'Google Report';
    pluralName: 'google-reports';
    singularName: 'google-report';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    authorId: Schema.Attribute.BigInteger;
    authorName: Schema.Attribute.String;
    clicks: Schema.Attribute.BigInteger;
    content: Schema.Attribute.Enumeration<
      [
        'Article',
        'Movie',
        'Web Story',
        'Celebrity Profile',
        'Web Series',
        'Tv Show',
        'Photo',
        'Video',
        'Song',
      ]
    >;
    contentId: Schema.Attribute.BigInteger;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.DateTime;
    firstPublishedAt: Schema.Attribute.DateTime;
    impressions: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::google-report.google-report'
    > &
      Schema.Attribute.Private;
    position: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
  };
}

export interface ApiIndustryIndustry extends Struct.CollectionTypeSchema {
  collectionName: 'industries';
  info: {
    displayName: 'Industry';
    pluralName: 'industries';
    singularName: 'industry';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry.industry'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLanguageLanguage extends Struct.CollectionTypeSchema {
  collectionName: 'languages';
  info: {
    displayName: 'languages';
    pluralName: 'languages';
    singularName: 'language';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    language: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::language.language'
    > &
      Schema.Attribute.Private;
    movies: Schema.Attribute.Relation<'manyToMany', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'language'>;
    songs: Schema.Attribute.Relation<'manyToMany', 'api::song.song'>;
    tv_shows: Schema.Attribute.Relation<'manyToMany', 'api::show.show'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    web_series: Schema.Attribute.Relation<
      'manyToMany',
      'api::web-series.web-series'
    >;
  };
}

export interface ApiMovieReviewMovieReview extends Struct.CollectionTypeSchema {
  collectionName: 'movie_reviews';
  info: {
    displayName: 'movie-reviews';
    pluralName: 'movie-reviews';
    singularName: 'movie-review';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comment: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::movie-review.movie-review'
    > &
      Schema.Attribute.Private;
    movie: Schema.Attribute.Relation<'manyToOne', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiMovieMovie extends Struct.CollectionTypeSchema {
  collectionName: 'movies';
  info: {
    displayName: 'Movie';
    pluralName: 'movies';
    singularName: 'movie';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_rating: Schema.Attribute.Relation<
      'manyToOne',
      'api::age-rating.age-rating'
    >;
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    award: Schema.Attribute.Component<'movie-elements.award', true>;
    backdrop: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    boxOffice: Schema.Attribute.Component<'movie-elements.box-office', true>;
    cast: Schema.Attribute.Component<'movie-elements.cast-member', true>;
    category: Schema.Attribute.Relation<'manyToOne', 'api::category.category'>;
    celebrities_profiles: Schema.Attribute.Relation<
      'manyToMany',
      'api::celebrities-profile.celebrities-profile'
    >;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    crewMembers: Schema.Attribute.Component<'movie-elements.crewmember', true>;
    description: Schema.Attribute.RichText;
    duration: Schema.Attribute.String;
    firstPublishedAt: Schema.Attribute.DateTime;
    genres: Schema.Attribute.Relation<'manyToMany', 'api::genre.genre'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    languages: Schema.Attribute.Relation<
      'manyToMany',
      'api::language.language'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'> &
      Schema.Attribute.Private;
    movie_review: Schema.Attribute.Component<
      'movie-elements.movie-review',
      true
    >;
    movie_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::movie-review.movie-review'
    >;
    poll_votes: Schema.Attribute.Relation<
      'oneToMany',
      'api::poll-vote.poll-vote'
    >;
    pollActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    poster: Schema.Attribute.Media<'files' | 'images'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Relation<'manyToOne', 'api::rating.rating'>;
    release_year: Schema.Attribute.Relation<
      'manyToOne',
      'api::release-year.release-year'
    >;
    releaseDate: Schema.Attribute.Date & Schema.Attribute.Required;
    releaseType: Schema.Attribute.Enumeration<['upcoming', 'released']> &
      Schema.Attribute.DefaultTo<'released'>;
    similarMovies: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    totalVotes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    trailer_id: Schema.Attribute.String;
    trending: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.Relation<'manyToOne', 'api::video.video'>;
    where_to_watch: Schema.Attribute.Component<
      'movie-elements.where-to-watch',
      true
    >;
  };
}

export interface ApiMusicGenreMusicGenre extends Struct.CollectionTypeSchema {
  collectionName: 'music_genres';
  info: {
    displayName: 'MusicGenres';
    pluralName: 'music-genres';
    singularName: 'music-genre';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::music-genre.music-genre'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'>;
    songs: Schema.Attribute.Relation<'manyToMany', 'api::song.song'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsItemNewsItem extends Struct.CollectionTypeSchema {
  collectionName: 'news';
  info: {
    displayName: 'News';
    pluralName: 'news';
    singularName: 'news-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Authors: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    body: Schema.Attribute.RichText;
    category: Schema.Attribute.Relation<'manyToMany', 'api::category.category'>;
    comment: Schema.Attribute.Relation<'oneToMany', 'api::comment.comment'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    firstPublishedAt: Schema.Attribute.DateTime;
    h1_title: Schema.Attribute.String;
    hero_image: Schema.Attribute.Media<'images' | 'files'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-item.news-item'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keywords: Schema.Attribute.String;
    moderation_status: Schema.Attribute.Enumeration<
      ['draft', 'published', 'pending', 'archived', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    sponsored: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    summary: Schema.Attribute.Text;
    tags: Schema.Attribute.Relation<'manyToMany', 'api::tag.tag'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    typecontent: Schema.Attribute.Enumeration<
      ['LatestNews', 'CelebrityNews', 'ViralNews']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    views: Schema.Attribute.BigInteger;
  };
}

export interface ApiNewsletterNewsletter extends Struct.CollectionTypeSchema {
  collectionName: 'newsletters';
  info: {
    displayName: 'Newsletter';
    pluralName: 'newsletters';
    singularName: 'newsletter';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    firstPublishedAt: Schema.Attribute.DateTime;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter.newsletter'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    source: Schema.Attribute.String;
    subscribedAt: Schema.Attribute.DateTime & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotificationNotification
  extends Struct.CollectionTypeSchema {
  collectionName: 'notifications';
  info: {
    displayName: 'Notification';
    pluralName: 'notifications';
    singularName: 'notification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    isRead: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification.notification'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    recipient: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    relatedId: Schema.Attribute.Integer;
    state: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected', 'published', 'read', 'unread']
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'welcome',
        'author_request',
        'article_status',
        'post_like',
        'comment',
        'follow',
        'system',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPhotoPostPhotoPost extends Struct.CollectionTypeSchema {
  collectionName: 'photo_posts';
  info: {
    displayName: 'Photo Post';
    pluralName: 'photo-posts';
    singularName: 'photo-post';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    firstPublishedAt: Schema.Attribute.DateTime;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isPremium: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    likes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::photo-post.photo-post'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    tags: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    views: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiPollVotePollVote extends Struct.CollectionTypeSchema {
  collectionName: 'poll_votes';
  info: {
    displayName: 'PollVote';
    pluralName: 'poll-votes';
    singularName: 'poll-vote';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::poll-vote.poll-vote'
    > &
      Schema.Attribute.Private;
    movie: Schema.Attribute.Relation<'manyToOne', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    votedAt: Schema.Attribute.DateTime;
  };
}

export interface ApiPostCommentPostComment extends Struct.CollectionTypeSchema {
  collectionName: 'post_comments';
  info: {
    displayName: 'PostComment';
    pluralName: 'post-comments';
    singularName: 'post-comment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    isPinned: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-comment.post-comment'
    > &
      Schema.Attribute.Private;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    text: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPostPost extends Struct.CollectionTypeSchema {
  collectionName: 'posts';
  info: {
    displayName: 'Post';
    pluralName: 'posts';
    singularName: 'post';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    content: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    likedBy: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::post.post'> &
      Schema.Attribute.Private;
    media: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    post_comments: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-comment.post-comment'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    views: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
  };
}

export interface ApiProfessionProfession extends Struct.CollectionTypeSchema {
  collectionName: 'professions';
  info: {
    displayName: 'Profession';
    pluralName: 'professions';
    singularName: 'profession';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::profession.profession'
    > &
      Schema.Attribute.Private;
    profession_Field: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'profession_Field'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRatingRating extends Struct.CollectionTypeSchema {
  collectionName: 'ratings';
  info: {
    displayName: 'Rating';
    pluralName: 'ratings';
    singularName: 'rating';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::rating.rating'
    > &
      Schema.Attribute.Private;
    movie: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReleaseYearReleaseYear extends Struct.CollectionTypeSchema {
  collectionName: 'release_years';
  info: {
    displayName: 'Release Year';
    pluralName: 'release-years';
    singularName: 'release-year';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::release-year.release-year'
    > &
      Schema.Attribute.Private;
    movie: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSeasonSeason extends Struct.CollectionTypeSchema {
  collectionName: 'seasons';
  info: {
    displayName: 'season';
    pluralName: 'seasons';
    singularName: 'season';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::season.season'
    > &
      Schema.Attribute.Private;
    number: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiShowShow extends Struct.CollectionTypeSchema {
  collectionName: 'shows';
  info: {
    displayName: 'Tv-Shows';
    pluralName: 'shows';
    singularName: 'show';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_rating: Schema.Attribute.Enumeration<
      ['UA', 'UA16+', 'UA13+', 'UA17+', 'A', 'U']
    >;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    backdrop_poster: Schema.Attribute.Media<'images' | 'files'>;
    cast: Schema.Attribute.Component<'cast-celebrity.cast', true>;
    categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::category.category'
    >;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    crew: Schema.Attribute.Component<'crew-celebrity.crewmembers', true>;
    description: Schema.Attribute.RichText;
    faqs: Schema.Attribute.Component<'web-series.faqs', true>;
    firstPublishedAt: Schema.Attribute.DateTime;
    genres: Schema.Attribute.Relation<'manyToMany', 'api::genre.genre'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    languages: Schema.Attribute.Relation<
      'manyToMany',
      'api::language.language'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::show.show'> &
      Schema.Attribute.Private;
    metadescription: Schema.Attribute.Text;
    poster: Schema.Attribute.Media<'images' | 'files'>;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal;
    realeaseDate: Schema.Attribute.Date;
    realted_articles: Schema.Attribute.Relation<
      'manyToMany',
      'api::article.article'
    >;
    seasonNumber: Schema.Attribute.Integer;
    shows_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::shows-review.shows-review'
    >;
    shows_seasons: Schema.Attribute.Component<'seasons.seasons', true>;
    similar_tv_shows: Schema.Attribute.Relation<'oneToMany', 'api::show.show'>;
    slug: Schema.Attribute.UID<'title'>;
    tag: Schema.Attribute.Relation<'oneToOne', 'api::tag.tag'>;
    title: Schema.Attribute.String;
    trailer_id: Schema.Attribute.String;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    tv_show_awards: Schema.Attribute.Component<
      'tv-shows.tv-shows-awards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    watchingPlatform: Schema.Attribute.Component<
      'movie-elements.where-to-watch',
      true
    >;
  };
}

export interface ApiShowsReviewShowsReview extends Struct.CollectionTypeSchema {
  collectionName: 'shows_reviews';
  info: {
    displayName: 'Shows-review';
    pluralName: 'shows-reviews';
    singularName: 'shows-review';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comment: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::shows-review.shows-review'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    tv_show: Schema.Attribute.Relation<'manyToOne', 'api::show.show'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiSongSong extends Struct.CollectionTypeSchema {
  collectionName: 'songs';
  info: {
    displayName: 'Song';
    pluralName: 'songs';
    singularName: 'song';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    album: Schema.Attribute.String;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    body: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 120;
      }>;
    categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::category.category'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    duration: Schema.Attribute.String;
    firstPublishedAt: Schema.Attribute.DateTime;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::song.song'> &
      Schema.Attribute.Private;
    metadescription: Schema.Attribute.Text;
    music_genres: Schema.Attribute.Relation<
      'manyToMany',
      'api::music-genre.music-genre'
    >;
    Platform: Schema.Attribute.Component<'movie-elements.platform', true>;
    publishedAt: Schema.Attribute.DateTime;
    releaseDate: Schema.Attribute.Date;
    slug: Schema.Attribute.UID<'title'>;
    song_artists: Schema.Attribute.Component<'song-artists.song', true>;
    song_language: Schema.Attribute.Relation<
      'manyToMany',
      'api::language.language'
    >;
    song_singer: Schema.Attribute.Component<'song-singer.song-singer', true>;
    thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trending: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStoryViewStoryView extends Struct.CollectionTypeSchema {
  collectionName: 'story_views';
  info: {
    displayName: 'Story View';
    pluralName: 'story-views';
    singularName: 'story-view';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::story-view.story-view'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    system_id: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    web_story: Schema.Attribute.Relation<
      'manyToOne',
      'api::web-story.web-story'
    >;
  };
}

export interface ApiSubscriptionSubscription
  extends Struct.CollectionTypeSchema {
  collectionName: 'subscriptions';
  info: {
    displayName: 'Subscription';
    pluralName: 'subscriptions';
    singularName: 'subscription';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    endDate: Schema.Attribute.Date;
    firstPublishedAt: Schema.Attribute.DateTime;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subscription.subscription'
    > &
      Schema.Attribute.Private;
    paymentProvider: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'stripe'>;
    paymentStatus: Schema.Attribute.Enumeration<
      ['pending', 'succeeded', 'failed', 'refunded']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    plan: Schema.Attribute.Enumeration<['free', 'monthly', 'yearly']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'free'>;
    publishedAt: Schema.Attribute.DateTime;
    rupees: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    transactionId: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiTableTable extends Struct.CollectionTypeSchema {
  collectionName: 'tables';
  info: {
    displayName: 'Table';
    pluralName: 'tables';
    singularName: 'table';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::table.table'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    tableHtml: Schema.Attribute.Blocks;
    tablerow: Schema.Attribute.Component<'table-table-rows.table-rows', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTagTag extends Struct.CollectionTypeSchema {
  collectionName: 'tags';
  info: {
    description: 'Article tags and topics';
    displayName: 'Tag';
    pluralName: 'tags';
    singularName: 'tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'manyToMany', 'api::article.article'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::tag.tag'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    news: Schema.Attribute.Relation<'manyToMany', 'api::news-item.news-item'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTrendingTagTrendingTag extends Struct.CollectionTypeSchema {
  collectionName: 'trending_tags';
  info: {
    displayName: 'Trending Tag';
    pluralName: 'trending-tags';
    singularName: 'trending-tag';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::trending-tag.trending-tag'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rank: Schema.Attribute.Integer;
    tag: Schema.Attribute.Relation<'oneToOne', 'api::tag.tag'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUserArticleUserArticle extends Struct.CollectionTypeSchema {
  collectionName: 'user_articles';
  info: {
    displayName: 'User Article';
    pluralName: 'user-articles';
    singularName: 'user-article';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    isPremium: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    likes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-article.user-article'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    views: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiVideoVideo extends Struct.CollectionTypeSchema {
  collectionName: 'videos';
  info: {
    description: 'Video content';
    displayName: 'Video';
    pluralName: 'videos';
    singularName: 'video';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    duration: Schema.Attribute.BigInteger;
    firstPublishedAt: Schema.Attribute.DateTime;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::video.video'> &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    related_articles: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
    related_movies: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    related_videos: Schema.Attribute.Relation<'oneToMany', 'api::video.video'>;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video_content: Schema.Attribute.RichText &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    video_id: Schema.Attribute.String & Schema.Attribute.Required;
    videotype: Schema.Attribute.Enumeration<
      [
        'Trailers',
        'Celeb Interviews',
        'First Day First Show',
        'Parties & Events',
        'Exclusive & Specials',
        'Movie Songs',
        'Music',
      ]
    >;
    views: Schema.Attribute.BigInteger;
  };
}

export interface ApiWebSeriesReviewWebSeriesReview
  extends Struct.CollectionTypeSchema {
  collectionName: 'web_series_reviews';
  info: {
    displayName: 'WebSeries Review';
    pluralName: 'web-series-reviews';
    singularName: 'web-series-review';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comment: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    firstPublishedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series-review.web-series-review'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    web_series: Schema.Attribute.Relation<
      'manyToOne',
      'api::web-series.web-series'
    >;
  };
}

export interface ApiWebSeriesWebSeries extends Struct.CollectionTypeSchema {
  collectionName: 'web_series_collections';
  info: {
    displayName: 'Web Series';
    pluralName: 'web-series-collections';
    singularName: 'web-series';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_rating: Schema.Attribute.Enumeration<
      [
        'U',
        'UA',
        'UA7+',
        'UA10+',
        'UA13+',
        'UA16+',
        'U/A 7+',
        'U/A 10+',
        'U/A 13+',
        'U/A 16+',
        'A (18+)',
        'A',
        'S',
        'G',
        'PG',
        'PG-13',
        'R',
        'NC-17',
        'TV-MA',
      ]
    >;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    backdrop_poster: Schema.Attribute.Media<'images' | 'files'>;
    cast: Schema.Attribute.Component<'cast-celebrity.cast', true>;
    categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::category.category'
    >;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    crew: Schema.Attribute.Component<'crew-celebrity.crewmembers', true>;
    description: Schema.Attribute.RichText;
    faqs: Schema.Attribute.Component<'web-series.faqs', true>;
    firstPublishedAt: Schema.Attribute.DateTime;
    gallery: Schema.Attribute.Component<'web-series.season-gallery', true>;
    genres: Schema.Attribute.Relation<'manyToMany', 'api::genre.genre'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    languages: Schema.Attribute.Relation<
      'manyToMany',
      'api::language.language'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series.web-series'
    > &
      Schema.Attribute.Private;
    poster: Schema.Attribute.Media<'images' | 'files'>;
    production_company: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal;
    relatedArticles: Schema.Attribute.Relation<
      'manyToMany',
      'api::article.article'
    >;
    releaseDate: Schema.Attribute.Date;
    running_status: Schema.Attribute.Enumeration<['Ongoing', 'Completed']>;
    runtime: Schema.Attribute.String;
    seasonNumber: Schema.Attribute.Integer;
    series_seasons: Schema.Attribute.Component<'seasons.seasons', true>;
    similar_webseries: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series.web-series'
    >;
    slug: Schema.Attribute.UID<'title'>;
    tagline: Schema.Attribute.String;
    tags: Schema.Attribute.Relation<'oneToMany', 'api::tag.tag'>;
    title: Schema.Attribute.String;
    total_votes: Schema.Attribute.String;
    trailer_id: Schema.Attribute.String;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    watchingPlatform: Schema.Attribute.Component<
      'movie-elements.where-to-watch',
      true
    >;
    web_series_awards: Schema.Attribute.Component<
      'web-series.web-series-awards',
      true
    >;
    web_series_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series-review.web-series-review'
    >;
  };
}

export interface ApiWebShowWebShow extends Struct.CollectionTypeSchema {
  collectionName: 'web_shows';
  info: {
    displayName: 'Web Show';
    pluralName: 'web-shows';
    singularName: 'web-show';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    age_rating: Schema.Attribute.Enumeration<
      [
        'U',
        'UA',
        'UA7+',
        'UA10+',
        'UA13+',
        'UA16+',
        'U/A 7+',
        'U/A 10+',
        'U/A 13+',
        'U/A 16+',
        'A (18+)',
        'A',
        'S',
        'G',
        'PG',
        'PG-13',
        'R',
        'NC-17',
        'TV-MA',
      ]
    >;
    auther: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    backdrop_poster: Schema.Attribute.Media<'images' | 'files'>;
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    faqs: Schema.Attribute.Component<'web-series.faqs', true>;
    firstPublishedAt: Schema.Attribute.DateTime;
    gallery: Schema.Attribute.Component<'web-series.season-gallery', true>;
    genres: Schema.Attribute.Relation<'oneToMany', 'api::genre.genre'>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.Required;
    languages: Schema.Attribute.Relation<'oneToMany', 'api::language.language'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-show.web-show'
    > &
      Schema.Attribute.Private;
    metadescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    poster: Schema.Attribute.Media<'files' | 'images'>;
    production_company: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal;
    releasedate: Schema.Attribute.DateTime;
    runtime: Schema.Attribute.String;
    seasons: Schema.Attribute.Component<'seasons.seasons', true>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    tag: Schema.Attribute.Relation<'oneToOne', 'api::tag.tag'>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    total_seasons: Schema.Attribute.Integer;
    total_votes: Schema.Attribute.String;
    trailer_id: Schema.Attribute.String;
    trending: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    watching_platform: Schema.Attribute.Component<
      'movie-elements.where-to-watch',
      true
    >;
  };
}

export interface ApiWebStoryWebStory extends Struct.CollectionTypeSchema {
  collectionName: 'web_stories';
  info: {
    displayName: 'Web Story';
    pluralName: 'web-stories';
    singularName: 'web-story';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    auther: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    category: Schema.Attribute.Enumeration<
      [
        'all',
        'box-office',
        'celebrity',
        'fashion',
        'lifestyle',
        'events',
        'entertainment',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    firstPublishedAt: Schema.Attribute.DateTime;
    heroText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    language: Schema.Attribute.Enumeration<['en', 'hi']> &
      Schema.Attribute.DefaultTo<'en'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-story.web-story'
    > &
      Schema.Attribute.Private;
    meta_keywords: Schema.Attribute.String;
    moderation_status: Schema.Attribute.Enumeration<
      ['pending', 'published', 'rejected']
    >;
    publishedAt: Schema.Attribute.DateTime;
    related_stories: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-story.web-story'
    >;
    seo_description: Schema.Attribute.Text;
    seo_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    slides: Schema.Attribute.Component<'web-story.slide', true>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    story_views: Schema.Attribute.Relation<
      'oneToMany',
      'api::story-view.story-view'
    >;
    thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    views: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    articles_views: Schema.Attribute.BigInteger;
    avatar: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    bio: Schema.Attribute.Text;
    bio_hindi: Schema.Attribute.Text;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    celebrities_profiles: Schema.Attribute.Relation<
      'oneToMany',
      'api::celebrities-profile.celebrities-profile'
    >;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    coverImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    followers: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    following: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    galleries: Schema.Attribute.Relation<'oneToMany', 'api::gallery.gallery'>;
    liked_posts: Schema.Attribute.Relation<'manyToMany', 'api::post.post'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    movies: Schema.Attribute.Relation<'oneToMany', 'api::movie.movie'>;
    news: Schema.Attribute.Relation<'oneToMany', 'api::news-item.news-item'>;
    notifications: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification.notification'
    >;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    post_comments: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-comment.post-comment'
    >;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    shows_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::shows-review.shows-review'
    >;
    songs: Schema.Attribute.Relation<'oneToMany', 'api::song.song'>;
    tv_shows: Schema.Attribute.Relation<'oneToMany', 'api::show.show'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    username_hindi: Schema.Attribute.String;
    web_series: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series.web-series'
    >;
    web_series_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-series-review.web-series-review'
    >;
    web_stories: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-story.web-story'
    >;
    website: Schema.Attribute.String;
    webstory_views: Schema.Attribute.BigInteger;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::about.about': ApiAboutAbout;
      'api::age-rating.age-rating': ApiAgeRatingAgeRating;
      'api::article-view.article-view': ApiArticleViewArticleView;
      'api::article.article': ApiArticleArticle;
      'api::author-request.author-request': ApiAuthorRequestAuthorRequest;
      'api::author.author': ApiAuthorAuthor;
      'api::award.award': ApiAwardAward;
      'api::category.category': ApiCategoryCategory;
      'api::celebrities-profile.celebrities-profile': ApiCelebritiesProfileCelebritiesProfile;
      'api::comment.comment': ApiCommentComment;
      'api::contact-message.contact-message': ApiContactMessageContactMessage;
      'api::gallery.gallery': ApiGalleryGallery;
      'api::genre.genre': ApiGenreGenre;
      'api::global.global': ApiGlobalGlobal;
      'api::google-report.google-report': ApiGoogleReportGoogleReport;
      'api::industry.industry': ApiIndustryIndustry;
      'api::language.language': ApiLanguageLanguage;
      'api::movie-review.movie-review': ApiMovieReviewMovieReview;
      'api::movie.movie': ApiMovieMovie;
      'api::music-genre.music-genre': ApiMusicGenreMusicGenre;
      'api::news-item.news-item': ApiNewsItemNewsItem;
      'api::newsletter.newsletter': ApiNewsletterNewsletter;
      'api::notification.notification': ApiNotificationNotification;
      'api::photo-post.photo-post': ApiPhotoPostPhotoPost;
      'api::poll-vote.poll-vote': ApiPollVotePollVote;
      'api::post-comment.post-comment': ApiPostCommentPostComment;
      'api::post.post': ApiPostPost;
      'api::profession.profession': ApiProfessionProfession;
      'api::rating.rating': ApiRatingRating;
      'api::release-year.release-year': ApiReleaseYearReleaseYear;
      'api::season.season': ApiSeasonSeason;
      'api::show.show': ApiShowShow;
      'api::shows-review.shows-review': ApiShowsReviewShowsReview;
      'api::song.song': ApiSongSong;
      'api::story-view.story-view': ApiStoryViewStoryView;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::table.table': ApiTableTable;
      'api::tag.tag': ApiTagTag;
      'api::trending-tag.trending-tag': ApiTrendingTagTrendingTag;
      'api::user-article.user-article': ApiUserArticleUserArticle;
      'api::video.video': ApiVideoVideo;
      'api::web-series-review.web-series-review': ApiWebSeriesReviewWebSeriesReview;
      'api::web-series.web-series': ApiWebSeriesWebSeries;
      'api::web-show.web-show': ApiWebShowWebShow;
      'api::web-story.web-story': ApiWebStoryWebStory;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
