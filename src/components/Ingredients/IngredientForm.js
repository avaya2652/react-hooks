import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator'



const IngredientForm = React.memo(props => {
  const [enteredName, setEnteredName] = useState('');
  const [enteredAmount, setEnteredAmount] = useState(''); 
console.log('Ingredient form');
  const submitHandler = event => {
    event.preventDefault();
    // ...
    // console.log(enteredAmount,enteredName);
    props.onAddIngredient({title: enteredName,amount:enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        {props.loading? <LoadingIndicator /> : null}
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" onChange={(event)=>setEnteredName(event.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" onChange={(event)=>setEnteredAmount(event.target.value)}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
