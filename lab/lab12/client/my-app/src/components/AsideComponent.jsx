import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function MyAside(props) {

  const navigate = useNavigate();


  function changeFilter(newFilter){
    props.setActiveFilter(newFilter);
    navigate(`filter/${newFilter}`)
  }
  
    return (
      <aside className="col-4">
        <div className="list-group">
          <a id="all" onClick={()=>changeFilter('filter-all')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-all' ? 'bg-success text-white' : ''}`}>All</a>
  
          <a id="fav" onClick={()=>changeFilter('filter-favorite')} className={`list-group-item list-group-item-action
             ${props.activeFilter === 'filter-favorite' ? 'bg-success text-white' : ''}`} >Favourite</a>
  
          <a id="best" onClick={()=>changeFilter('filter-best')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-best' ? 'bg-success text-white' : ''}`}>Best Rated</a>
  
          <a id="lastMonth" onClick={()=>changeFilter('filter-lastmonth')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-lastmonth' ? 'bg-success text-white' : ''}`}>Seen last month</a>
  
          <a id="unseen" onClick={()=>changeFilter('filter-unseen')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-unseen' ? 'bg-success text-white' : ''}`}>Unseen</a>
        </div>
      </aside>
    )
  }

  export{MyAside}