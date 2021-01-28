import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';
import Card from '../UI/Card';

import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props ;
  const [search, setSearch] = useState('');
  const inputRef =useRef();
  const {isLoading,data,error,sendRequest, clear } = useHttp();
  useEffect(()=>{
      const timer=  setTimeout(()=>{
      if(search === inputRef.current.value){
        const query = search.length === 0 ? '' : `?orderBy="title"&equalTo="${search}"` ;
        sendRequest('https://react-hooks-6c9e3-default-rtdb.firebaseio.com/ingredients.json' + query, 'GET');       
      }
    },500)
    return ()=> { 
        clearTimeout(timer);
    };
  },[search, onLoadIngredients, inputRef,sendRequest]);

  useEffect(()=>{
    if(!isLoading && error && data){
      const loadedIngredients =[];
      for( const key in data){
        loadedIngredients.push({
          id: key,
          title : data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients)
    }
  },[data,isLoading,error])
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
           ref={inputRef}
           type="text"  value={search} onChange={event=> setSearch(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
