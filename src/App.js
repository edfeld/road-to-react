import { Component } from 'react';
import axios from 'axios';
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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    }
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

  };
  
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    // console.log("****=> search Path: ", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`);
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
    
  }
  
  onSearchSubmit(event) {
    // console.log("Hitting OnSearchSubmit");
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories (result) {
    // console.log("setSearchTopS: ", result);
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page }
      }
    });
    // console.log("Set state Results: ", this.state.results);
  }
  
  onSearchChange(event) {
    // console.log("hitting onSearchChange");
    this.setState({ searchTerm: event.target.value})
    // console.log("Search Term: ", this.state.searchTerm);
  };
  
  onDismiss = id => {
    // console.log("id: ", id);

    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    // console.log("updatedHits: ", updatedHits)

    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page}
      }
    });
  }

  componentDidMount() {
    // console.log("component did mount.");
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm} );
    this.fetchSearchTopStories(searchTerm);
  }
  
  render() {
    // this.setState({list: list.push(newItem)});
    const { 
      searchTerm, 
      results, 
      searchKey, 
      error 
    } = this.state;

    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    // console.log("render results: ", results);
    // if (!result) { return null; }

   const largeColumn = {
     width: '40%'
   }
   const midColumn = {
     width: '30%'
   }
   const smallColumn = {
     width: '10%'
   }
    // console.log("Search Term in Render: ", this.state.searchTerm);
    
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
        { error 
          ? <p>Something went wrong. </p>
          : <Table 
            list={list}
            onDismiss={this.onDismiss}
            largeColumn={largeColumn}
            midColumn={midColumn}
            smallColumn={smallColumn}
          />  
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
          MORE 
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, 
  onChange, 
  onSubmit, 
  children 
}) => 
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

const Button = ({ onClick, className = '', type='button', children  }) =>
      <button 
        onClick={onClick}
        className={className}
        type={type} 
      >
        {children}
      </button>

export default App;

export {
  Button,
  Search,
  Table,
};
