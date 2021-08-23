import React from 'react';
import './App.css';
import TodoForm from './components/todo-form/todo-form.component';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { todos: []};
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    const response = await fetch('/todo');
    const todos = await response.json();
     this.setState({todos});
  }

  handleFormSumbitTodo = (e) => {
    console.log(e.target.value);

    if (e.target.value === 'create') {

    } else if (e.target.value === 'cancel') {
      this.setState({showAddTodo: false});
    }


  }


  handleAddTodo = (e) => {
    this.setState({showAddTodo: true});

  }

  render() {
    const {todos, showAddTodo } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          Todo Application
        </header>
        <button onClick = {this.handleAddTodo}> Add Todo</button>
        {showAddTodo? <TodoForm refreshList={this.refreshList} handleClick={this.handleFormSumbitTodo}/> : null}
        <ul>
          {todos.map( item => <li key={item._id}>{item.text} <button>Done</button></li>)}
        </ul>
      </div>
    );
  }
}

export default App;
