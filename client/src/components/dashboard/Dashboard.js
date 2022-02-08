import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import store from '../../store';
import Spinner from '../layout/Spinner';
import { DashboardActions } from './DashboardActions';
import Education from './Education';
import Experience from './Experience';

const Dashboard = () => {
  useEffect(() => {
    store.dispatch(getCurrentProfile());
  }, []);
  const deleteAcc = () => {
    store.dispatch(deleteAccount());
  };

  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  return profile.loading && profile.profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='larg text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'> Welcome {auth.user && auth.user.name} </i>
      </p>
      {profile.profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.profile.experience} />
          <Education education={profile.profile.education} />
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAcc()}>
              <i className='fas fa-user-minus'></i> DELETE MY ACCOUNT
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet set up a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
