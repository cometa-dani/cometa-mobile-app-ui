/* eslint-disable no-unused-vars */
export enum QueryKeys {
  // loggedInUser
  GET_EVENT_INFO_BY_ID,
  GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION,
  GET_All_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION,
  GET_LOGGED_IN_USER_INFO_PROFILE,
  GET_CURRENT_LOCATION_CITIES,

  // targetUser
  GET_TARGET_USER_INFO_PROFILE,
  GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID_WITH_PAGINATION,
  GET_SAME_MATCHED_EVENTS_BY_TWO_USERS_WITH_PAGINATION,

  // friendships
  GET_FRIENDSHIP_BY_TARGET_USER_ID,
  GET_NEWEST_FRIENDS_WITH_PAGINATION,

  // search
  GET_HOME_TOWN_CITIES,
  GET_ALL_LANGUAGES,
  SEARCH_FRIENDS_BY_USERNAME,
  SEARCH_USERS_BY_USERNAME_WITH_PAGINATION,
  SEARCH_EVENTS_WITH_PAGINATION,
}
