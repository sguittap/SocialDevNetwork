import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../common/Spinner';
import {getProfileById} from '../../actions/profileActions';

const Profile = ({
    getProfileById,
    match,
    profile:{profile, loading},
    auth,
}) => {
    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById]);

    return (
        <div>
            
        </div>
    )
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps,{getProfileById})(Profile);
