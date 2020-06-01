import {Filter} from './store/global/types';

const filters = Object.values(Filter);

export default {
    HOME: `/`,
    ABOUT: `/about`,
    GUESTS: `/guest-posts`,
    CONTRIBUTE: `/contribute`,
    SIGN_UP: `/signup`,
    WHITE_PAPER: `/whitepaper`,
    PRIVACY: `/privacy-policy`,
    TOS: `/terms-of-service`,
    FILTER: `/:filter(${filters.join('|')})`,
    FILTER_TAG: `/:filter(${filters.join('|')})/:tag`,
    ENTRY: `/:category/:username(@[\\w\\.\\d-]+)/:permlink`,
    USER: `/:username(@[\\w\\.\\d-]+)`,
    USER_SECTION: `/:username(@[\\w\\.\\d-]+)/:section(feed|blog|comments|replies|wallet)`,
};
