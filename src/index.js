/* import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister(); */


import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const fecthPokemon = id => 
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(response => response.json())
    .catch(() => {
        document.getElementById('root').innerHTML = '<h3>Error</h3>';
        return false;
    });

class FetchPokemon extends Component {
    constructor() {
        super();
        this.state = { character: null };
    }

    //con static, se pueden definir las defaultProps, si no se pasan utiliza estas
    static defaultProps = {
        renderLoading: () => <div>Loading...</div>
    }

    componentDidMount() {
        fecthPokemon(this.props.id).then(data => 
            this.setState({ character:data })
        );
    }

    // lo probé también con componentDidUpdate usando las props normal y funcionó
    componentWillReceiveProps(nextProps) {
        fecthPokemon(nextProps.id).then(data => 
            this.setState({ character: data })
        );
    }

    render() {
        /* se pone la condición de si hay caracter porque el
        componente se renderiza antes de montarse, entonces
        en ese momento no tiene ningun caracter */
        return this.state.character ? (
            <Pokemon character={this.state.character}/>
        ) : (
            this.props.renderLoading()
        )
    }
}

const Button = (props) => (
    <button onClick={props.action ? props.action : null}>
        {props.title}
    </button>
)

const Pokemon = (props) => (
    <div>
        <h1>
            Pokemon: {props.character.name} ({props.character.id})
        </h1>
        <h2>Abilities</h2>
        <ul>
            {props.character.abilities.map(ability => (
                <li key={ability.ability.name}>
                    {ability.ability.name}
                </li>
            ))}
        </ul> 
    </div>
)

class PokemonIdPager extends Component {
    constructor() {
        super();
        this.state = { id: 1 };
        this.setNextId = this.setNextId.bind(this);
        this.setPreviousId = this.setPreviousId.bind(this);
    }

    setNextId() {
        this.setState(prevState => (
            { id: prevState.id + 1 }
        ));
    }

    setPreviousId() {
        this.setState(prevState => 
            ({ id: prevState.id > 1 ? prevState.id - 1 : 1 })
        );
    }

    render() {
        return (
            <div>
                <Button 
                    title="Previous pokemon"
                    action={this.setPreviousId}
                />
                <Button 
                    title="Next pokemon"
                    action={this.setNextId}
                />
                <FetchPokemon 
                    id={this.state.id} 
                    renderLoading={()=><div>Fetching Pokemon...</div>}
                />
            </div>
        )
    }
}

ReactDOM.render(<PokemonIdPager />, document.getElementById('root'));
