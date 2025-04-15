import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';
import './App.css';
import { Film,filterFilms } from './app';
import { useState } from 'react';

const films = new Film();
films.init();
const FilmList = films.getFilms();


function MyNav() {
  return (
    < Navbar className="navbar navbar-expand-lg bg-body-tertiary" >
      <div className="container-fluid" id="navv">
        <li>
          <i className="bi bi-collection-play-fill"></i>
        </li>
        <a className="navbar-brand">Film Library</a>
        <Button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </Button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
            <button className="btn btn-outline-success" type="submit">Search</button>

          </form>
        </div>
        <div className="icon-container">
          <i className="bi bi-person-circle"></i>
        </div>
      </div>
    </Navbar >
  )
}
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
function FilmRow(props) {
  const e = props.film;

  const stars = [];
  // Add filled stars
  for (let i = 0; i < e.rating; i++) {
    stars.push(<i key={`filled-${i}`} className="bi bi-star-fill"></i>);
  }
  // Add empty stars
  for (let i = 0; i < 5 - e.rating; i++) {
    stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
  }

  return (
    <tr>
      <td>{e.title}</td>
      <td>
        {e.favourite === 1 ? <i className="bi bi-check-square-fill"></i> : <i className="bi bi-square"></i>}
      </td>
      <td>{e.date ? e.date.format('YYYY-MM-DD') : ''}</td>
      <td>{stars}</td>
      <td>
        <Button className="mx-1" variant="danger" onClick={()=>props.delete(e.id)}><i className="bi bi-trash"></i></Button>
      </td>
    </tr>
  );
}
function MyTable(props) {
  return (
    <Table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="films">

        {/* the key can also be the answer id, if unique */}
        {props.listOfFilms.map((e) =>
          <FilmRow key={e.id} film={e} delete={props.delete} />)
        }

      </tbody>
    </Table>
  )
}




function App(props) {
  const [activeFilter,setActiveFilter] = useState('filter-all');
  const [listOfFilms,setListOfFilms] = useState(FilmList);
  function deleteFilm(id){
    setListOfFilms(listOfFilms=>listOfFilms.filter(e=>e.id!==id))
  }

  const filters = {
    'filter-all': { label: 'all', id: 'filter-all', filterFunction: ()=>filterFilms(listOfFilms,'All')},
    'filter-favorite': { label: 'fav', id: 'filter-favorite', filterFunction: ()=>filterFilms(listOfFilms,'Favourite') },
    'filter-best': { label: 'best', id: 'filter-best', filterFunction: ()=>filterFilms(listOfFilms,'Best Rated') },
    'filter-lastmonth': { label: 'lastMonth', id: 'filter-lastmonth', filterFunction: ()=>filterFilms(listOfFilms,'Seen last month') },
    'filter-unseen': { label: 'unseen', id: 'filter-unseen', filterFunction: ()=>filterFilms(listOfFilms,'Unseen') }
  };

  return (
    <>
      <MyNav></MyNav>
      <Container className="container m-0">
        <div className="row justify-content-start">
          <MyAside activeFilter={activeFilter} setActiveFilter={setActiveFilter}></MyAside>
          <div className="col-8">
            <Row >
              <div className="col-11">All</div>
              <div className="col-1">
                <button type="button" className="btn btn-primary">+</button>
              </div>
            </Row>
            <MyTable listOfFilms={filters[activeFilter].filterFunction()} delete={deleteFilm}></MyTable>
          </div>
        </div>
      </Container>
    </>
  )
}

export default App
