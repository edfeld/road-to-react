import { Component } from 'react';
// import logo from './logo.svg';
// import Search from './Search'
// import Table from './Table';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// const list = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org/',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
//   {
//     title: 'Edz Book',
//     url: 'https://EdwardEinfeld.org/',
//     author: 'Edward Einfeld',
//     num_comments: 2,
//     points: 3,
//     objectID: 3,
  
//   }
// ]


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

  };
  
  fetchSearchTopStories(searchTerm, page = 0) {
    console.log("****=> search Path: ", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`);
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response  => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
    
  }
  
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories (result) {
    console.log("setSearchTopS: ", result);
    const { hits, page } = result;

    const oldHits = page !== 0
      ? this.state.result.hits 
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState( {
      result:  {hits: updatedHits, page }
    });
    console.log("Set state Results: ", this.state.result);
  }

  componentDidMount() {
    console.log("component did mount.");
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
    console.log("Search Term: ", this.state.searchTerm);
  };

  onDismiss = id => {
    console.log("id: ", id);
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    console.log("updatedHits: ", updatedHits)
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits}
    });
  }

  render() {
    // this.setState({list: list.push(newItem)});
   const { searchTerm, result } = this.state;
   const page = (result && result.page) || 0;
    console.log("render result: ", result);
   if (!result) { return null; }

   const largeColumn = {
     width: '40%'
   }
   const midColumn = {
     width: '30%'
   }
   const smallColumn = {
     width: '10%'
   }
    console.log("Search Term in Render: ", this.state.searchTerm);
    return (
      <div className="page">
        <div className="interactions">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search 
        </Search>
        </div>
        { 
          result && <Table 
            list={result.hits}
            onDismiss={this.onDismiss}
            largeColumn={largeColumn}
            midColumn={midColumn}
            smallColumn={smallColumn}
          />  
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
          MORE 
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => 
      <form onSubmit={onSubmit}>
        <input type="text"
          value={value}
          onChange={onChange} />
          <Button type="submit">
            { children } 
          </Button>
      </form>
    


const Table = ({ list, onDismiss, largeColumn, midColumn, smallColumn }) => 
      <div className="table">
        {list.map(item =>
        
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>
              {item.author}</span>
            <span style={smallColumn}>
              {item.num_comments}</span>
            <span style={smallColumn}>
              {item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
      )}
    </div>

const Button = ({ onClick, className = '', children }) =>
      <button 
        onClick={onClick}
        className={className}
        type="button" 
      >
        {children}
      </button>

export default App;
