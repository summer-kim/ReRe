import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  getContent,
  deleteContent,
  likeUnlikeBag,
  likeUnlikeBagUndo,
} from '../../redux/action/postAction';

import { usePressLike } from '../hook/usePressLike'; //custom hook for interaction with like, unlike, bag button

import { sortAndLimitTag } from '../../util/sortAndLimitTag';
import TagSection from '../tag/TagSection';

import logo from '../../img/logo.png';
import '../../css/contentItem.css';

const ContentItem = ({
  getContent,
  deleteContent,
  postReducer: { content, loading },
  authReducer,
  match,
  history,
  likeUnlikeBag,
  likeUnlikeBagUndo,
}) => {
  useEffect(() => {
    getContent(match.params.postid);
  }, []);

  const {
    _id = '',
    movieName = '',
    genre = [],
    summary = '',
    img = '',
    user = '',
    likes = [],
    unlikes = [],
    tags = [],
  } = content;

  const { Liked, Unliked, Bag, onClickSet } = usePressLike({
    _id,
    likes,
    unlikes,
    loading,
    authUser: authReducer.user,
  });

  //when User click like heart button
  const onClick = (type, bool) => {
    bool ? likeUnlikeBagUndo(type, _id) : likeUnlikeBag(type, _id);
    onClickSet(type);
  };

  const onClickDelete = (postid) => {
    if (window.confirm('Are you sure to delete ?')) {
      deleteContent(postid);
      history.goBack();
    }
  };
  return (
    <Fragment>
      <div id='space80'></div>
      <section id='about1' className='m1 p1 flex-container'>
        <div id='about1-bio' className='p1 flex-container'>
          <div id='about1-bio-img'>
            <img
              src={
                img
                  ? 'https://summerzzang.s3.ap-northeast-2.amazonaws.com/uploads/' +
                    img
                  : logo
              }
              alt='#'
            />
          </div>
          <div id='about1-bio-side'>
            <div>
              <h1>{movieName}</h1>
              <div className='bottom-line'></div>
            </div>
            <div>
              <div className='summary'>
                <p>{summary}</p>
              </div>

              <div className='info'>
                <span>
                  {genre.map((gen, index) => (
                    <span key={index} className='genre'>
                      {index === genre.length - 1 ? gen : gen + '/'}
                    </span>
                  ))}
                </span>
                <span className='content-interest'>
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      onClick('like', Liked);
                    }}
                    className={Liked ? 'whenliked' : 'heartbtn'}
                  >
                    <i className='fas fa-heart'></i>
                    {likes ? likes.length : 0}
                  </span>
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      onClick('unlike', Unliked);
                    }}
                    className={Unliked ? 'whenliked' : 'heartbtn'}
                  >
                    <i className='fas fa-heart-broken'></i>
                    {unlikes ? unlikes.length : 0}
                  </span>
                </span>
              </div>

              <div className='tags'>{sortAndLimitTag(tags)}</div>

              <div className='side-end flex-container'>
                <div
                  className={Bag ? 'plus iconSelected' : 'plus'}
                  onClick={(e) => {
                    e.preventDefault();
                    onClick('bag', Bag);
                  }}
                >
                  <i className='fas fa-plus'></i>
                </div>
                {!authReducer.loading &&
                authReducer.user &&
                user === authReducer.user._id ? ( //Only user who created can see
                  <Fragment>
                    <Link className='trash' to={`/makepost/${_id}`}>
                      <i class='fas fa-edit'></i>
                    </Link>
                    <div className='trash'>
                      <i
                        class='fas fa-trash-alt'
                        onClick={() => onClickDelete(_id)}
                      ></i>
                    </div>
                  </Fragment>
                ) : undefined}
              </div>
            </div>
          </div>
        </div>
      </section>
      <TagSection tags={tags} _id={_id} />
      <div id='space80'></div>
    </Fragment>
  );
};
ContentItem.propTypes = {
  getContent: PropTypes.func.isRequired,
  deleteContent: PropTypes.func.isRequired,
  postReducer: PropTypes.object.isRequired,
  authReducer: PropTypes.object.isRequired,
  likeUnlikeBag: PropTypes.func.isRequired,
  likeUnlikeBagUndo: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  postReducer: state.postReducer,
  authReducer: state.authReducer,
});
export default connect(mapStateToProps, {
  getContent,
  deleteContent,
  likeUnlikeBag,
  likeUnlikeBagUndo,
})(ContentItem);
