/* eslint-disable no-unused-vars */
export enum QueryKeys {
  // events
  GET_LATEST_EVENTS_WITH_PAGINATION,
  GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_LOGGED_IN_USER_WITH_PAGINATION,
  GET_LIKED_EVENTS_FOR_BUCKETLIST_BY_TARGET_USER_ID_WITH_PAGINATION,
  GET_EVENT_INFO_BY_ID,
  GET_SAME_MATCHED_EVENTS_BY_TWO_USERS_WITH_PAGINATION,

  // authenticated user
  GET_USERS_WHO_LIKED_SAME_EVENT_BY_ID_WITH_PAGINATION,
  GET_LOGGED_IN_USER_INFO_PROFILE,
  GET_TARGET_USER_INFO_PROFILE,
  GET_CURRENT_LOCATION_CITIES,
  GET_HOME_TOWN_CITIES,
  GET_ALL_LANGUAGES,

  // second user

  // friendships
  GET_FRIENDSHIP_BY_RECEIVER_ID_AND_SENDER_ID,
  GET_NEWEST_FRIENDS_WITH_PAGINATION,
}
