import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    files: [],
    selectedImage: '',
    selectedImageUrl: '',
    selectedFiles: [],
    uploadedFiles: [],
    points: 0
  }

  uploadFiles = (files) => {
    this.setState({files})
  }

  selectImage = (img) => {
    this.setState({selectedImage: img})
  }

  fileChangedHandler = (event) => {
    console.log("_______ event.target.files", event.target.files);
    [...event.target.files].forEach(f => console.log("_______ f", f.name, f))
    this.setState({selectedFiles: [...event.target.files]})
  }

  uploadHandler = () => {
    this.state.selectedFiles.forEach((file) => {
      let reader = new FileReader()
      reader.onloadend = () => {
        const fileObject = {
          name: file.name,
          url: reader.result
        }
        const uploadedFiles = [].concat(this.state.uploadedFiles).concat(fileObject)
        this.setState({
          ...this.state,
          uploadedFiles: uploadedFiles
        })
      }
      reader.readAsDataURL(file)
    })
  }


  render() {
    return (
      <div className="App">
        {
          this.state.uploadedFiles.length > 0
            ? <div className='App-menu'>
              <ul>
                Images:
                {this.state.uploadedFiles.map((file, i) => <li
                  onClick={() => this.selectImage(file.url)} key={file.name}>{
                  console.log(file)
                }
                  {i + 1}
                </li>)}
              </ul>
            </div>
            : <header className="App-header">
              <h1 className="App-title">BRYLLUP AKLEKSANDRA & LARS</h1>
            </header>
        }

        <div className='App-content'>
          {
            this.state.selectedImage
              ? <ImageContainer selectedImage={this.state.selectedImage}/>
              : <div>
                <h1>Selet files to start game</h1>
                <input type="file" onChange={this.fileChangedHandler} multiple/>
                <button onClick={this.uploadHandler}>Start!</button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default App;


export class ImageContainer extends Component {
  state = {
    uncovered: []
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.selectedImage !== nextProps.selectedImage) {
      this.setState({uncovered: []})
    }
  }

  uncover = () => {
    const {uncovered} = this.state
    if (uncovered.length <= 19) {
      const tileNumber = this.getNextTileNumber(uncovered)
      const nextState = [...uncovered, tileNumber]
      this.setState({uncovered: nextState})
    } else {
      alert('Bravo!');
      this.setState({uncovered: []})
    }
  }

  pokaPoka = (e) => {
    e.stopPropagation()
    this.setState({uncovered: [...Array(20).keys()].map(key => key + 1)})
  }

  getNextTileNumber = (uncovered) => {
    const allTiles = [...Array(20).keys()].map(key => key + 1)
    var rand = (array = []) => array[Math.floor(Math.random() * array.length)];
    let coveredTiles = allTiles.filter(x => !uncovered.includes(x));
    return rand(coveredTiles)
  }

  render = () => {
    return <Tiles uncovered={this.state.uncovered} handleClick={this.uncover}>
      <button style={{position: 'relative', zIndex: 3}} onClick={this.pokaPoka}>POKA POKA</button>
      <div style={{padding: 20}}>
        <img src={this.props.selectedImage} onClick={this.uncover}/>
      </div>
    </Tiles>
  }
}

export const Tiles = (props) => {
  const {uncovered} = props
  const allTiles = [...Array(20).keys()].map(key => key + 1)
  return <div
    onClick={props.handleClick}
    style={{
      position: 'relative',
      // padding: 20,
      // margin: 20,
      border: '4px dashed pink',
      maxWidth: '100%',
      maxHeight: '100%',
    }}>
    <div style={{
      maxWidth: '100%',
      maxHeight: '100%',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        flexWrap: 'wrap',
      }}>
        {allTiles.map(tile => <Tile id={tile} uncovered={uncovered.indexOf(tile) !== -1} key={tile}/>)}
      </div>
      {props.children}
    </div>
  </div>
}

export const Tile = (props) => console.log(props.uncovered) || <div
  style={{
    opacity: props.uncovered ? 0 : 1,
    width: '24.5%',
    height: '20%',
    zIndex: 2,
    border: '1px dashed beige',
    backgroundColor: 'pink',
  }}></div>