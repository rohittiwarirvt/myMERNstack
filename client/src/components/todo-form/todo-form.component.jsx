import React from 'react';

class  TodoForm extends React.Component {

  constructor(props) {
    super(props);
  }

  handleCreateTodo = async (event) => {
    event.preventDefault();
    const { todoText } = this.state;

    try {
      const response = await fetch("/todo", { method: 'POST',
      body: JSON.stringify({text: todoText, is_complete: false}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
      });
      const doc = await response.json();
      this.props.refreshList();
    } catch (err) {
      console.log(err);
    }

  }

  handleOnChange = (event) => {
    const { value, name} = event.target;
    this.setState({[name]: value});
  }

  render (){
    return (
      <form onSubmit={this.handleCreateTodo}>
        <label htmlFor="todoText">Todo</label>
        <input type="text" name="todoText" onChange={this.handleOnChange}></input>
        <input type="button" onClick={this.handleCreateTodo} value="create"></input>
        <input type="button"  onClick={this.props.handleClick} value="cancel"></input>
      </form>
    )
  }
}

export default TodoForm;