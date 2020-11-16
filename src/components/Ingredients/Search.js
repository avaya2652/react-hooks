import React, { useEffect, useRef, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [searchKey, setSearchKey] = useState('');
  const {onSearch} = props;
  const inputRef = useRef();
  useEffect(()=>{
    const timer = setTimeout(()=>{

      if(searchKey === inputRef.current.value){
          const query = searchKey.length >0 ? `?orderBy="title"&equalTo="${searchKey}"`: '';
          fetch('https://react-hook-6e893.firebaseio.com/ingredinets.json' + query,{
              method:'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(resp => resp.json())
            .then((respData)=>{
              let loadedData = [];
              for(let data in respData){
                loadedData.push({
                  id: data,
                  title: respData[data].title,
                  amount: respData[data].amount
                })

              }
              onSearch(loadedData);

            })
      }
    }, 500) 

    return()=>{
      clearTimeout(timer);
    }

  },[searchKey, onSearch, inputRef])



  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
            value={searchKey} 
            onChange={event=>setSearchKey(event.target.value)} 
            ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
