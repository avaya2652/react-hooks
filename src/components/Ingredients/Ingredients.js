import React, { useEffect, useCallback, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentState, action)=>{
  switch(action.type){
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentState, action.ingredients];
    case 'DELETE': return currentState.filter(ing =>ing.id !== action.id)
    default:
      throw new Error('')
  }
}
const httpReducer = (curHttpState, action)=>{
  switch(action.type){
    case 'SEND':
      return { loading: true,error: null};
    case 'RESPONSE':
      return { ...curHttpState, loading: false};
    case 'ERROR':
      return { loading: false,error: action.errorMsg};
    case 'CLEAR': 
      return {...curHttpState, error: null}

    default: throw new Error('Not in this section', action.type);
  }
}

const Ingredients = ()=> {
  const [enteredIngredients, dispatch] = useReducer(ingredientReducer,[])
  // const [enteredIngredients, setEnteredIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer,{loading: false, error: null});
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);

  useEffect(()=>{
    console.log('useEffect from ingredients');
  },[enteredIngredients])

const onAddIngredientHandler = (ingredients) =>{
    // setIsLoading(true);
    dispatchHttp({type:'SEND'})
    fetch('https://react-hook-6e893.firebaseio.com/ingredinets.json',{
      method:'POST',
      body: JSON.stringify(ingredients),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then((respData)=>{
      // setIsLoading(false);
      dispatchHttp({type:'RESPONSE'});

      // setEnteredIngredients((prevState)=>{
      //   return [...prevState, {id:respData.name, ...ingredients}]
      // });.

      dispatch({type:'ADD', ingredients:ingredients})


    })
    .catch((error)=>{
      // setIsLoading(true);
      dispatchHttp({type:'ERROR', errorMsg: error.message});

    })
}
  const onRemoveItemHandler = (id) =>{
    console.log(id);
    // setIsLoading(true);
    dispatchHttp({type:'SEND'})

    fetch(`https://react-hook-6e893.firebaseio.com/ingredinets/${id}.json`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp)=>{
      // setIsLoading(false);
      dispatchHttp({type:'RESPONSE'})
      dispatch({type: 'DELETE', id: id})


      // setEnteredIngredients((prevState)=>{
      //  let as = prevState.filter((state)=>{
      //    return  state.id !== id
      //   })
      //   console.log(as);
      //   return [...as];
      // })

    }).catch(error=>{
      // setIsError(error.message);
      dispatchHttp({type:'ERROR',errorMsg: error.message})

    })

  }

  const onSearchHandler = useCallback((ingredients) =>{
    dispatch({type: 'SET', ingredients: ingredients});
  },[])

  const onErrorModalClose = () =>{
    // setIsError(null);
    // setIsLoading(false);
    dispatchHttp({type:'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={onErrorModalClose}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient = {onAddIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onSearch={onSearchHandler}/>
        {/* Need to add list here! */}
        <IngredientList ingredients = {enteredIngredients} onRemoveItem={onRemoveItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
