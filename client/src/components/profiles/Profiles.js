import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import store from '../../store';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Profiles = () => {
  const { profiles, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    store.dispatch(getProfiles());
  }, []);
  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'>
              Browse and connect with developers
            </i>
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found!</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default Profiles;
