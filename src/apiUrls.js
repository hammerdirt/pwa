const prefix = 'https://mwshovel.pythonanywhere.com/api/'
// authentication
// export const LOG_OUT= `${prefix}hd-auth/logout/`
export const REFRESH_TOKEN = `${prefix}hd-auth/jwt/refresh/`
export const SERVER_CHECK = `${prefix}list-of-beaches/`
export const TOKEN_AUTH = `${prefix}hd-auth/jwt/create/`
export const VERIFY_TOKEN = `${prefix}hd-auth/jwt/verify/`
export const ARE_WE_ONLINE = `${prefix}are-we-online/`
export const TOKEN_TIME_OUT = 36000
// user-data
export const LIST_OF_USERS = `${prefix}users/`
// litter-data
export const CITY_CODE_TOTALS = `${prefix}code-totals/cities/`
export const DAILY_TOTALS_PCS_M = `${prefix}surveys/daily-totals/`
export const LIST_OF_BEACHES = `${prefix}list-of-beaches/`
export const LIST_OF_BEACHES_CATEGORY = `${prefix}list-of-beaches/by-category/`
export const LIST_OF_CATEGORIES = `${prefix}list-of-beaches/categories/`
export const LIST_OF_CODES = `${prefix}mlw-codes/list/`
export const POST_CODE_TOTAlS = `${prefix}code-totals/post-code/`
export const SURVEY_TO_SERVER = `${prefix}surveys/`
export const DIMS_TO_SERVER =  `${prefix}surveys/dim-data/dim-data-create/`
export const SURVEY_DIMS = `${prefix}surveys/dim-data/`
export const WATER_BODY_CODE_TOTAlS = `${prefix}code-totals/water-bodies/`
export const LATEST_DAILY_TOTALS = `${prefix}surveys/daily-totals/code-totals/daily-totals/`
// articles and references
export const ARTICLE_LIST = `${prefix}article-view/`
export const ARTICLE_SEARCH_TERMS =  `${prefix}article-search/`
export const ARTICLE_UPDATE = `${prefix}article-update/`
export const CREATE_ARTICLE = `${prefix}create-article/`
export const CREATE_COMMENT =  `${prefix}article-comment/create/`
export const COMMENT_LIST = `${prefix}article-comment/`
// export const LIST_OF_REFERENCES = `${prefix}list-of-references/titles/`
//links
export const EU_RIVERINE = "https://mcc.jrc.ec.europa.eu/documents/201703034325.pdf"
export const EU_BEACH_MONITOR = "https://mcc.jrc.ec.europa.eu/documents/201702074014.pdf"
