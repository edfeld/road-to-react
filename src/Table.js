import { Component } from "react";

const isSearched = searchTerm => item => 
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
  
class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { list, pattern, onDismiss } = this.props;
    console.log(this.props);
    return (
      <div>
      {list.filter(isSearched(pattern)).map(item =>
        
          <div key={item.objectId}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button
                onClick={() => onDismiss(item.objectId)}
                type="button"
              >
                Dismiss
              </button>
            </span>
          </div>
      )}
    </div>
    );
  }
}

export default Table;