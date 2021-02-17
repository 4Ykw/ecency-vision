import React, {Component} from "react";

import {Modal, Button} from "react-bootstrap";

import {PrivateKey} from "@hiveio/dhive";

import {Global} from "../../store/global/types";
import {Community} from "../../store/communities/types";
import {ActiveUser} from "../../store/active-user/types";


import BaseComponent from "../base";
import {error} from "../feedback";
import KeyOrHot from "../key-or-hot";
import LinearProgress from "../linear-progress";


import {communityRewardsRegister, communityRewardsRegisterHot, formatError} from "../../api/operations";
import {getRewardedCommunities} from "../../api/private";

import {_t} from "../../i18n";


interface Props {
    global: Global;
    community: Community;
    activeUser: ActiveUser;
    signingKey: string;
    setSigningKey: (key: string) => void;
    onHide: () => void;
}

interface State {
    loading: boolean,
    inProgress: boolean;
    registered: boolean;
    form: boolean;
    done: boolean;
}


export class CommunityRewardsRegistration extends BaseComponent<Props, State> {
    state: State = {
        loading: true,
        inProgress: false,
        registered: false,
        form: false,
        done: false,
    }

    componentDidMount() {
        const {community} = this.props;

        getRewardedCommunities().then(r => {
            const registered = !!r.find(x => x.name === community.name);
            this.stateSet({registered});
        }).finally(() => {
            this.stateSet({loading: false});
        })
    }

    next = () => {
        this.stateSet({form: true})
    }

    sign = (key: PrivateKey) => {
        const {community} = this.props;

        this.stateSet({inProgress: true});
        communityRewardsRegister(key, community.name).then(r => {
            this.stateSet({done: true});
        }).catch(err => {
            error(formatError(err));
        }).finally(() => {
            this.setState({inProgress: false});
        });
    }

    hotSign = () => {
        const {community} = this.props;

        communityRewardsRegisterHot(community.name)
    }

    signKs = () => {

    }

    render() {
        const {inProgress, loading, registered, form, done} = this.state;

        if (loading) {
            return <LinearProgress/>
        }

        if (done) {
            return <div className="dialog-content">
                <p className="text-info">{_t("community-rewards-registration.done-body-text")}</p>
            </div>
        }

        if (form) {
            return <div className="dialog-content">
                {KeyOrHot({
                    ...this.props,
                    inProgress,
                    onKey: this.sign,
                    onHot: this.hotSign,
                    onKc: this.signKs
                })}
            </div>
        }

        if (registered) {
            return <div className="dialog-content">
                <p className="text-info">{_t("community-rewards-registration.conflict-body-text")}</p>
            </div>
        }

        return <div className="dialog-content">
            <p>{_t("community-rewards-registration.body-text")}</p>
            <Button size="sm" onClick={this.next}>{_t("community-rewards-registration.btn-next-label")}</Button>
        </div>
    }
}

export default class CommunityRewardsRegistrationDialog extends Component<Props> {
    render() {
        const {onHide} = this.props;
        return (
            <Modal animation={false} show={true} centered={true} onHide={onHide} keyboard={false} className="community-rewards-registration-dialog">
                <Modal.Header closeButton={true}>
                    <Modal.Title>{_t('community-rewards-registration.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CommunityRewardsRegistration {...this.props} />
                </Modal.Body>
            </Modal>
        );
    }
}
