import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import ContentSitem from '../content/ContentSitem';
import { getContents } from '../../redux/action/postAction';
import Spinner from '../layout/spinner';
import { setAlert } from '../../redux/action/alertAction';

const Mypost = ({
  getContents,
  authReducer: { isAuthenticated, user },
  postReducer: { contents = [], loading },
  setAlert,
}) => {
  const [sortedData, setData] = useState({ contentsMarked: [], sort: '' });
  const { contentsMarked, sort } = sortedData;
  useEffect(() => {
    getContents();
  }, [getContents]);
  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }
  const onClickGenre = (e) => {
    if (e.target.classList.contains('picked')) {
      e.target.classList.remove('picked');
      setData({ ...sortedData, contentsMarked: [] });
    } else {
      const gen = e.target.innerText;
      const contentsPrep = contents.filter((content) =>
        content.genre.includes(gen)
      );
      if (contentsPrep.length === 0) {
        return setAlert(`Contents of ${gen} has not been created yet`);
      }
      e.target.classList.add('picked');
      setData({ ...sortedData, contentsMarked: contentsPrep });
    }
  };
  const sortSelected = (e) => {
    setData({ ...sortedData, sort: e.target.value });
  };
  if (sort === 'Liked') {
    if (contentsMarked.length > 0) {
      contentsMarked.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      contents.sort((a, b) => b.likes.length - a.likes.length);
    }
  }
  if (sort === 'Newest') {
    if (contentsMarked.length > 0) {
      contentsMarked.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      contents.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }
  return (
    <Fragment>
      <section id='main-filter'>
        <div className='filter flex-container'>
          <div className='flex-container'>
            <div className='sort'>
              <select name='sort' value={sort} onChange={sortSelected}>
                <option value='Newest'>Newest</option>
                <option value='Liked'>Liked Number</option>
              </select>
            </div>
            <div>
              <div className='sort-part'>
                Category<i className='fas fa-sort-down arrow'></i>
                <input type='checkbox' className='toggler' />
                <div className='hidden'>
                  <div>
                    <span onClick={onClickGenre}>SF</span>
                    <span onClick={onClickGenre}>Fantasy</span>
                    <span onClick={onClickGenre}>Drama</span>
                    <span onClick={onClickGenre}>Comedy</span>
                    <span onClick={onClickGenre}>Horror</span>
                    <span onClick={onClickGenre}>Thriller</span>
                    <span onClick={onClickGenre}>Kids</span>
                    <span onClick={onClickGenre}>Family</span>
                    <span onClick={onClickGenre}>Animation</span>
                    <span onClick={onClickGenre}>Action</span>
                    <span onClick={onClickGenre}>Crime</span>
                    <span onClick={onClickGenre}>Romance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id='space110'></div>

      <section id='main2' className='chart-down m1 p2 flex-container'>
        <h4 className='title flex-container'>
          <i className='fas fa-heart'></i>My Post
        </h4>
        <div className='bottom-line'></div>
        <div id='main2-content' className='grid'>
          {loading ? (
            <Spinner />
          ) : contents.some((content) => content.user === user._id) ? (
            contentsMarked.length > 0 ? (
              contentsMarked
                .filter((content) => content.user === user._id)
                .map((content) => (
                  <ContentSitem key={content._id} content={content} />
                ))
            ) : (
              contents
                .filter((content) => content.user === user._id)
                .map((content) => (
                  <ContentSitem key={content._id} content={content} />
                ))
            )
          ) : (
            <h4 className='parag'>No Content Created...</h4>
          )}
        </div>
      </section>
    </Fragment>
  );
};
Mypost.propTypes = {
  postReducer: PropTypes.object.isRequired,
  authReducer: PropTypes.object.isRequired,
  getContents: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  postReducer: state.postReducer,
  authReducer: state.authReducer,
});
export default connect(mapStateToProps, { getContents, setAlert })(Mypost);
