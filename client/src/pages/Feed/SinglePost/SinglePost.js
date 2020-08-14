import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const method = 'GET';
    fetch(`http://localhost:8080/api/feed/${postId}`, {
        method,
        headers: {
                Authorization: 'Bearer ' + this.props.token
            }
        })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          _id: resData.feed._id,
          title: resData.feed.title,
          author: resData.feed.creator.name,
          image: 'http://localhost:8080/' + encodeURI(resData.feed.imageUrl.slice(resData.feed.imageUrl.search('images'))),
          date: new Date(resData.feed.createdAt).toLocaleDateString('en-US'),
          content: resData.feed.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
