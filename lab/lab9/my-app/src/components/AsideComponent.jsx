import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';


function MyAside(props) {

    return (
      <aside className="col-4">
        <div className="list-group">
          <a id="all" onClick={()=>props.setActiveFilter('filter-all')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-all' ? 'bg-success text-white' : ''}`}>All</a>
  
          <a id="fav" onClick={()=>props.setActiveFilter('filter-favorite')} className={`list-group-item list-group-item-action
             ${props.activeFilter === 'filter-favorite' ? 'bg-success text-white' : ''}`} >Favourite</a>
  
          <a id="best" onClick={()=>props.setActiveFilter('filter-best')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-best' ? 'bg-success text-white' : ''}`}>Best Rated</a>
  
          <a id="lastMonth" onClick={()=>props.setActiveFilter('filter-lastmonth')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-lastmonth' ? 'bg-success text-white' : ''}`}>Seen last month</a>
  
          <a id="unseen" onClick={()=>props.setActiveFilter('filter-unseen')} className={`list-group-item list-group-item-action 
            ${props.activeFilter === 'filter-unseen' ? 'bg-success text-white' : ''}`}>Unseen</a>
        </div>
      </aside>
    )
  }

  export{MyAside}