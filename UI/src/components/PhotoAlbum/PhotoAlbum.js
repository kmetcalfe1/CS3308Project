import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as albumActions from '../../redux/actions/albumActions.js';
import * as loginActions from '../../redux/actions/loginActions.js';
class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: ''
    }
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.albumActions.getAllFamilyImages(this.props.user.family);
    }
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    const familyID = this.props.family;
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);
    data.append('family', familyID);
    fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
        response.json().then((body) => {
          let imageURL = `http://localhost:4000/${body.file}`;
          //pass image url to database
          //dispatch? would be easier
          this.props.albumActions.addImageToDB(imageURL, familyID);
          this.setState({ imageURL });
        });
      }).catch(error => console.log(error));
      setTimeout(() => {
        this.props.albumActions.getAllFamilyImages(this.props.user.family);
      }, 300)
  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.albumActions.getAllFamilyImages(this.props.user.family)
  }

  render() {
    let imageGrid = this.props.images ? this.props.images.map((image, i) =>
    <div key={i} className='image-grid-item'>
      <img src={image} alt={`${i}`} key={i} height="300px" width="330px"/>
    </div>
  ) : (null);


    return (
      <div className='album-wrapper'>
        <h1 className= "calenderHeader">Album</h1>
        <h2 className= "description"> Add photos and view past photos of your family adventures.</h2>
        <div className="container photos">
          <form onSubmit={this.handleUploadImage}>

          <div class="upload-btn-wrapper">
            <button className="btn">Choose file</button>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" name="myfile" />
          </div>
            
            <div>
              <input className= "nameFile" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
            </div>
            <br />
            <div className="upload-btn-wrapper">
            <button className="btn">Upload</button>
            </div>
          </form>
        </div>
        <br/>
        <div className="container image-grid-container">
          {imageGrid}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    albumReducer: state.albumReducer,
    homeReducer: state.homeReducer,
    user: state.loginReducer.user,
    family: state.loginReducer.user.family,
    images: state.albumReducer.images
  };
};

const mapDispatchToProps = dispatch => {
  return {
    albumActions: bindActionCreators(albumActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Album)
