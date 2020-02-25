import React, { Component } from "react";
import "./Main.css";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { removeLoginView, getSession, getDetailViewID } from "../../redux/reducer";
import axios from "axios";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      user_id: this.props.user.user_id
    };
  }

  componentDidMount() {
    this.props.removeLoginView();
    // this.props.getSession();
    this.getUserPosts(this.props.user.user_id);
  }

  getUserPosts = () => {
    axios
      .get(`/api/posts/${this.props.user.user_id}`)
      .then(posts => {
        console.log(posts)
        this.setState({
          posts: posts.data
        });
      })
      .catch(err => console.log("catch error", err));
  };

  deletePost = async e => {
    let id = e.target.value;
    await axios.delete(`/api/delete/${id}`);
    this.getUserPosts(this.props.user.user_id);
  };

  setDetail = (e) => {
    let id = e.target.value
    console.log('setdetail ID', id)
    this.props.getDetailViewID(id)
    this.props.history.push('/detail')
  }

  render() {
    const mappedPosts = this.state.posts.map(post => {
      return (
        <div key={post.post_id} className="postContainer">
          <div className="dashboardText">
            <h2>Species: {post.species}</h2>
            <h2>Edible: {post.edible}</h2>
            <h2>Date: {post.date}</h2>
            <p>Description: {post.description}</p>
            <button
              className="deleteButton"
              onClick={this.deletePost}
              value={post.post_id}
            >
              Delete
            </button>
              <button value={post.post_id} onClick={this.setDetail} >Post Details</button>
          </div>
          <div>
            <img className="postPhoto" alt="mushroom" src={post.image_url} />
          </div>
        </div>
      );
    });
    return <div>
    {this.props.user
      ?
    <div className="postParent">{mappedPosts}</div>
      :
      <Redirect to='/' /> 
    }
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  removeLoginView,
  getSession,
  getDetailViewID
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
