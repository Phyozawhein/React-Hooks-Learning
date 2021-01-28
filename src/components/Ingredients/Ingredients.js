import React, {useReducer , useCallback, useMemo, useEffect } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import ErroModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientsReducer = (state, action)=>{
  switch(action.type){
    case 'SET' : return action.ingredients;
    case 'ADD' : return [ ...state, action.ingredient];
    case 'DELETE' : return [...state.filter(ing => ing.id !== action.id)];
    default: throw new Error('Should not get there ! '); 
  }
}



function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  
  const { isLoading, data, error, reqExtra,  sendRequest, reqIdentifier, clear} = useHttp();

  useEffect(()=>{
    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra})
    }
    else if(!isLoading && !error & reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({
        type: 'ADD',
        ingredient: {id: data.name, ...reqExtra}
      })
    }

  },[data, reqExtra,reqIdentifier, isLoading, error]);

  const filterIngredients = useCallback( filterIngs =>{

   dispatch({type:'SET', ingredients: filterIngs})
  },[]);




  const addIngredientHandler = useCallback(ingredient =>{

    sendRequest('https://react-hooks-6c9e3-default-rtdb.firebaseio.com/ingredients.json', 
    'POST', 
    JSON.stringify(ingredient), 
    ingredient,
    'ADD_INGREDIENT');

},[sendRequest])

  const removeIngridentHandler = useCallback(id =>{
   sendRequest(`https://react-hooks-6c9e3-default-rtdb.firebaseio.com/${id}.json`,
   'DELETE',
    null,
    id,
    'REMOVE_INGREDIENT'
    )

  },[sendRequest])
  const ingredientList = useMemo(()=>{
    return <IngredientList ingredients ={ingredients} onRemoveItem={removeIngridentHandler}/>
  },[ingredients, removeIngridentHandler]);

  return (
    <div className="App">
      {error ? <ErroModal onClose={clear}> {error}</ErroModal> : null}
      <IngredientForm onAddIngredient ={addIngredientHandler} loading ={isLoading} />
      <section>
        <Search onLoadIngredients={filterIngredients}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
