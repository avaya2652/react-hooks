import React, { useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = ()=> {

  const [enteredIngredients, setEnteredIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(()=>{
    console.log('useEffect from ingredients');
  },[enteredIngredients])

const onAddIngredientHandler = (ingredients) =>{
    setIsLoading(true);
    fetch('https://react-hook-6e893.firebaseio.com/ingredinets.json',{
      method:'POST',
      body: JSON.stringify(ingredients),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then((respData)=>{
      setIsLoading(false);

      setEnteredIngredients((prevState)=>{
        return [...prevState, {id:respData.name, ...ingredients}]
    }
      );
    })
    .catch((error)=>{
      setIsLoading(true);
    })
}
  const onRemoveItemHandler = (id) =>{
    console.log(id);
    setIsLoading(true);

    fetch(`https://react-hook-6e893.firebaseio.com/ingredinets/${id}.jon`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp)=>{
      setIsLoading(false);

      setEnteredIngredients((prevState)=>{
       let as = prevState.filter((state)=>{
         return  state.id !== id
        })
        console.log(as);
        return [...as];
      })
    }).catch(error=>{
      setIsError(error.message);
    })

  }

  const onSearchHandler = useCallback((ingredients) =>{
    setEnteredIngredients(ingredients)
  },[])

  const onErrorModalClose = () =>{
    setIsError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {isError && <ErrorModal onClose={onErrorModalClose}>{isError}</ErrorModal>}
      <IngredientForm onAddIngredient = {onAddIngredientHandler} loading={isLoading} />

      <section>
        <Search onSearch={onSearchHandler}/>
        {/* Need to add list here! */}
        <IngredientList ingredients = {enteredIngredients} onRemoveItem={onRemoveItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
