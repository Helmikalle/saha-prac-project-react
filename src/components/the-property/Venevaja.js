import React, { Component } from 'react';
import axios from 'axios';

import VenevajaPicture from './PropertyPicture';
import '../../styles/Property.css';
import '@fortawesome/fontawesome-free/css/all.css';

export default class Venevaja extends Component {
  state = {
    paragraph: "",
    imageList: [],
    currentIndex: 0,
    translateValue: 0
  };

  componentDidMount() {
    axios
      .get("http://localhost:8081/property/venevaja1")
      .then(response => {
        const newParagraph = response.data.paragraph;
        const newPictures = response.data.imageList.map(c => {
          return {
            id: c.id,
            name: c.name,
            sahaPhotoURL: c.sahaPhotoURL
          };
        });
        const newState = Object.assign({}, this.state, {
          paragraph: newParagraph,
          imageList: newPictures
        });
        this.setState(newState);
      }).catch(error => console.log('ERROR: ', error))
  }

  goToPrevSlide = () => {
    if (this.state.currentIndex === 0)
      return;

    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }))
  }

  goToNextSlide = () => {
    // Exiting the method early if we are at the end of the images array.
    // We also want to reset currentIndex and translateValue, so we return
    // to the first image in the array.
    if (this.state.currentIndex === this.state.imageList.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      })
    }

    // This will not run if we met the if condition above
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -(this.slideWidth())
    }));
  }

  slideWidth = () => {
    return document.querySelector('.slide').clientWidth
  }

  render() {
    const { paragraph, imageList } = this.state;
    return (
      <div>
        <div className="image">
          <div className="slider">

            <div className="slider-wrapper"
              style={{
                transform: `translateX(${this.state.translateValue}px)`,
                transition: 'transform ease-out 0.45s'
              }}>
              {
                imageList.map(pic =>
                  <VenevajaPicture key={pic.id} name={pic.sahaPhotoURL} />
                )
              }
            </div>

            <LeftArrow
              goToPrevSlide={this.goToPrevSlide}
            />

            <RightArrow
              goToNextSlide={this.goToNextSlide}
            />
          </div>
        </div>
        <div className="paragraph">
          <h2 className='header'>Venevaja</h2>
          <p>{paragraph}</p>
        </div>
      </div>
    )
  }
}

const LeftArrow = (props) => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i>
    </div>
  );
}


const RightArrow = (props) => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="fa fa-arrow-right fa-2x" aria-hidden="true"></i>
    </div>
  );
}
