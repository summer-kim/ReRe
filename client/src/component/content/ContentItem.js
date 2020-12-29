import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getContent,
  deleteContent,
  likePost,
  likePostUndo,
  unlikePost,
  unlikePostUndo,
} from '../../action/postAction';
import {
  addToMyBag,
  addToMyBagUndo,
  addToMylikes,
  addToMylikesUndo,
} from '../../action/authAction';
import { addTag } from '../../action/tagAction';

import { sortAndLimitTag } from '../../util/sortAndLimitTag';

import logo from '../../img/logo.png';
import Tagbox from '../tags/Tagbox';
import postReducer from '../../reducer/postReducer';
import { setAlert } from '../../action/alertAction';
import { Link } from 'react-router-dom';

const ContentItem = ({
  getContent,
  addTag,
  deleteContent,
  postReducer: { content },
  authReducer,
  match,
  history,
  likePost,
  likePostUndo,
  unlikePost,
  unlikePostUndo,
  addToMyBag,
  addToMyBagUndo,
  addToMylikes,
  addToMylikesUndo,
}) => {
  useEffect(() => {
    getContent(match.params.postid);
  }, [getContent, match.params.postid]);
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
  const [tagData, setData] = useState({
    tagName: '',
  });
  const [likeData, setlikeData] = useState({
    Liked: false,
    Unliked: false,
    Put: false,
  });
  const setVariable = async () => {
    if (authReducer.user) {
      if (likes && likes.some((like) => like.user === authReducer.user._id)) {
        await setlikeData({ ...likeData, Liked: true });
      }
      if (
        unlikes &&
        unlikes.some((unlike) => unlike.user === authReducer.user._id)
      ) {
        await setlikeData({ ...likeData, Unliked: true });
      }
      if (authReducer.user.myBag.some((list) => list.post.toString() === _id)) {
        await setlikeData({ ...likeData, Put: true });
      }
    }
  };
  useEffect(() => {
    setVariable();
  }, [postReducer.loading, authReducer.loading]);

  //when User click like heart button
  const onClickLike = () => {
    if (likeData.Liked) {
      likePostUndo(_id);
      addToMylikesUndo(_id);
      setlikeData({ ...likeData, Liked: false });
    } else {
      likePost(_id);
      addToMylikes(_id);
      setlikeData({ ...likeData, Liked: true });
    }
  };
  //when User click unlike heart-broken button
  const onClickUnlike = () => {
    if (likeData.Uniked) {
      unlikePostUndo(_id);
      setlikeData({ ...likeData, Uniked: false });
    } else {
      unlikePost(_id);
      setlikeData({ ...likeData, Uniked: true });
    }
  };
  const onClickMyBag = () => {
    if (likeData.Put) {
      addToMyBagUndo(_id);
      setlikeData({ ...likeData, Put: false });
    } else {
      addToMyBag(_id);
      setlikeData({ ...likeData, Put: true });
    }
  };

  const { tagName } = tagData;
  const inputBox = document.getElementById('inputBox');
  const onChange = (e) =>
    setData({ ...tagData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    addTag({ tagData, _id });
    setData({ tagName: '' });
    inputBox.value = '';
  };

  const onClickDelete = (postid) => {
    deleteContent(postid);
    history.goBack();
  };
  return (
    <Fragment>
      <div id='space80'></div>
      <section id='about1' className='m1 p2 flex-container'>
        <div id='about1-bio' className='p1 flex-container'>
          <div id='about1-bio-img'>
            <img
              src={img ? window.location.origin + '/uploads/' + img : logo}
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
                  {' '}
                  {genre.map((gen, index) => {
                    if (index === genre.length - 1) {
                      return (
                        <span key={index} className='genre'>
                          {gen}
                        </span>
                      );
                    } else {
                      return (
                        <span key={index} className='genre'>
                          {gen}/
                        </span>
                      );
                    }
                  })}
                </span>
                <span className='content-interest'>
                  <span
                    onClick={() => onClickLike()}
                    className={likeData.Liked ? 'whenliked' : 'heartbtn'}
                  >
                    <i className='fas fa-heart'></i>
                    {likes ? likes.length : 0}
                  </span>
                  <span
                    onClick={() => onClickUnlike()}
                    className={likeData.Uniked ? 'whenliked' : 'heartbtn'}
                  >
                    <i className='fas fa-heart-broken'></i>
                    {unlikes ? unlikes.length : 0}
                  </span>
                </span>
              </div>

              <div className='tags'>{sortAndLimitTag(tags)}</div>
              <div className='side-end flex-container'>
                <div
                  className={likeData.Put ? 'plus iconSelected' : 'plus'}
                  onClick={() => onClickMyBag()}
                >
                  <i className='fas fa-plus'></i>
                </div>
                {!authReducer.loading &&
                authReducer.user &&
                user === authReducer.user._id ? (
                  <Link className='trash'>
                    <i class='fas fa-edit'></i>
                  </Link>
                ) : (
                  ''
                )}
                <div className='trash'>
                  {!authReducer.loading &&
                  authReducer.user &&
                  user === authReducer.user._id ? (
                    <i
                      class='fas fa-trash-alt'
                      onClick={() => onClickDelete(_id)}
                    ></i>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id='aboutTag' className='p1 m1'>
        <h4 className='title'>
          <i className='fas fa-heart'></i>Tag List
        </h4>
        <div className='tagBox p1'>
          <div className='tagList grid'>
            {tags.length > 0 ? (
              tags.map((tag) => <Tagbox tag={tag} postid={_id} key={tag._id} />)
            ) : (
              <h4 className='parag'> No Tag founded </h4>
            )}
          </div>
          <div className='tagInput flex-container'>
            <i className='fas fa-plus'></i>
            <i className='fas fa-hashtag hashTag'></i>
            <form onSubmit={onSubmit}>
              <input
                className='inputBox'
                classtype='text'
                placeholder='Tag Name (50 letters limit)'
                name='tagName'
                value={tagName}
                onChange={onChange}
                id='inputBox'
              />
              <button className='btn-main' type='submit'>
                ADD
              </button>
            </form>
          </div>
        </div>
      </section>
      <div id='space80'></div>
    </Fragment>
  );
};
ContentItem.propTypes = {
  getContent: PropTypes.func.isRequired,
  deleteContent: PropTypes.func.isRequired,
  postReducer: PropTypes.object.isRequired,
  authReducer: PropTypes.object.isRequired,
  addTag: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  likePostUndo: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  unlikePostUndo: PropTypes.func.isRequired,
  addToMyBag: PropTypes.func.isRequired,
  addToMyBagUndo: PropTypes.func.isRequired,
  addToMylikes: PropTypes.func.isRequired,
  addToMylikesUndo: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  postReducer: state.postReducer,
  authReducer: state.authReducer,
});
export default connect(mapStateToProps, {
  getContent,
  addTag,
  deleteContent,
  likePost,
  likePostUndo,
  unlikePost,
  unlikePostUndo,
  addToMyBag,
  addToMyBagUndo,
  addToMylikes,
  addToMylikesUndo,
})(ContentItem);
