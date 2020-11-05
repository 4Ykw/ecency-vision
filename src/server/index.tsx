import express from "express";

import cookieParser from "cookie-parser";

import {EntryFilter, ProfileFilter} from "../common/store/global/types";

import entryIndexHandler from "./handlers/entry-index";
import communityHandler from "./handlers/community";
import profileHandler from "./handlers/profile";
import entryHandler from "./handlers/entry";
import fallbackHandler from "./handlers/fallback";
import {entryRssHandler, authorRssHandler} from "./handlers/rss";
import {
    receivedVesting,
    leaderboard,
    notifications,
    markNotifications,
    unreadNotifications,
    hsTokenRefresh,
    createAccount,
    usrActivity,
    popularUsers,
    images,
    imagesDelete,
    imagesAdd,
    drafts,
    draftsAdd,
    draftsUpdate,
    draftsDelete,
    bookmarks,
    bookmarksAdd,
    bookmarksDelete,
    favorites,
    favoritesCheck,
    favoritesAdd,
    favoritesDelete,
    points,
    pointList,
    pointsClaim,
    pointsCalc,
    promotePrice,
    promotedPost,
    searchPath,
    boostOptions,
    boostedPost,
    commentHistory,
    search,
    promotedEntries
} from "./handlers/private-api";

const server = express();

const entryFilters = Object.values(EntryFilter);
const profileFilters = Object.values(ProfileFilter);

server
    .disable("x-powered-by")
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
    .use(express.json())
    .use(cookieParser())
    .get(
        [
            `^/:filter(${entryFilters.join("|")})/:tag/rss.xml$`, // /trending/esteem/rss.xml
        ],
        entryRssHandler
    )
    .get(
        [
            "^/@:author/:section(feed|blog|posts)/rss.xml$", // /posts/@esteemapp/rss.xml
            "^/@:author/rss.xml$", // @esteemapp/rss.xml
        ],
        authorRssHandler
    )
    .get(
        [
            `^/:filter(${entryFilters.join("|")}|subscribers|activities|roles)/:name(hive-[\\d]+)$`, //  /hot/hive-231312
        ],
        communityHandler
    )
    .get(
        [
            "^/$", // index
            `^/:filter(${entryFilters.join("|")})$`, // /trending
            `^/:filter(${entryFilters.join("|")})/:tag$`, //  /trending/esteem
            `^/@:tag/:filter(feed)$`, //  /@user/feed
        ],
        entryIndexHandler
    )
    .get(
        [
            "^/@:username$", // /@esteemapp
            `^/@:username/:section(${profileFilters.join("|")}|communities|wallet|points)$`, // /@esteemapp/comments
        ],
        profileHandler
    )
    .get(
        [
            "^/:category/@:author/:permlink$", // /esteem/@esteemapp/rss-feeds-added-into-esteem-website
            "^/@:author/:permlink$", // /@esteemapp/rss-feeds-added-into-esteem-website
        ],
        entryHandler
    )
    .get("^/api/received-vesting/:username$", receivedVesting)
    .get("^/api/leaderboard/:duration(day|week|month)$", leaderboard)
    .get("^/api/popular-users$", popularUsers)
    .get("^/api/promoted-entries$", promotedEntries)
    .post("^/api/notifications$", notifications)
    .post("^/api/notifications/mark$", markNotifications)
    .post("^/api/notifications/unread$", unreadNotifications)
    .post("^/api/hs-token-refresh$", hsTokenRefresh)
    .post("^/api/usr-activity$", usrActivity)
    .post("^/api/images$", images)
    .post("^/api/images-delete$", imagesDelete)
    .post("^/api/images-add$", imagesAdd)
    .post("^/api/drafts$", drafts)
    .post("^/api/drafts-add$", draftsAdd)
    .post("^/api/drafts-update$", draftsUpdate)
    .post("^/api/drafts-delete$", draftsDelete)
    .post("^/api/bookmarks$", bookmarks)
    .post("^/api/bookmarks-add$", bookmarksAdd)
    .post("^/api/bookmarks-delete$", bookmarksDelete)
    .post("^/api/account-create$", createAccount)
    .post("^/api/favorites$", favorites)
    .post("^/api/favorites-check$", favoritesCheck)
    .post("^/api/favorites-add$", favoritesAdd)
    .post("^/api/favorites-delete$", favoritesDelete)
    .post("^/api/points$", points)
    .post("^/api/point-list$", pointList)
    .post("^/api/points-claim$", pointsClaim)
    .post("^/api/points-calc$", pointsCalc)
    .post("^/api/promote-price$", promotePrice)
    .post("^/api/promoted-post$", promotedPost)
    .post("^/api/search-path$", searchPath)
    .post("^/api/boost-options$", boostOptions)
    .post("^/api/boosted-post$", boostedPost)
    .post("^/api/comment-history$", commentHistory)
    .post("^/api/search$", search)
    .get("*", fallbackHandler);

export default server;
