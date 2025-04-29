import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';
import './App.css';
import { MyAside } from './components/AsideComponent.jsx'
import { MyTable } from './components/TableComponent.jsx'
import { Film, filterFilms } from './app.js';
import { useState } from 'react';
import { FilmForm } from './components/FormComponent.jsx';

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





function App(props) {
  const [activeFilter, setActiveFilter] = useState('filter-all');
  const [listOfFilms, setListOfFilms] = useState(FilmList);
  function deleteFilm(id) {
    setListOfFilms(listOfFilms => listOfFilms.filter(e => e.id !== id))
  }
  const [showForm, setShowForm] = useState(false);
  const [ editObj, setEditObj ] = useState(undefined);

  const filters = {
    'filter-all': { label: 'all', id: 'filter-all', filterFunction: () => filterFilms(listOfFilms, 'All') },
    'filter-favorite': { label: 'fav', id: 'filter-favorite', filterFunction: () => filterFilms(listOfFilms, 'Favourite') },
    'filter-best': { label: 'best', id: 'filter-best', filterFunction: () => filterFilms(listOfFilms, 'Best Rated') },
    'filter-lastmonth': { label: 'lastMonth', id: 'filter-lastmonth', filterFunction: () => filterFilms(listOfFilms, 'Seen last month') },
    'filter-unseen': { label: 'unseen', id: 'filter-unseen', filterFunction: () => filterFilms(listOfFilms, 'Unseen') }
  };



  function addFilm(film) {
    //should have an id given by server
    setListOfFilms( listOfFilms => [...listOfFilms, film]);
    setShowForm(false);
  }

  
  function editFilm(id) {
    setEditObj( listOfFilms.find( e => e.id === id) );
    console.log('id: ',  id);
    console.log('Existing film: ',  listOfFilms.find( e => e.id === id));
    setShowForm(true);
  }

  function saveExistingFilm(film) {
    //console.log('saveExistingAnswer: ', ans);
    setListOfFilms( listOfFilms =>
      listOfFilms.map( e => e.id === film.id ? film : e)
    );
    setShowForm(false);
  }
  

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
                {showForm ?
                  undefined: <button type="button" className="btn btn-primary"onClick={() => setShowForm(true)}>+</button>}
              </div>
            </Row>
            <MyTable listOfFilms={filters[activeFilter].filterFunction()} edit={editFilm} delete={deleteFilm}></MyTable>
            <Row>
                {showForm ?
                  <FilmForm addFilm={addFilm}
                    closeForm={() => { setShowForm(false); setEditObj(undefined); }}
                    editObj={editObj} saveExistingFilm={saveExistingFilm}
                    key={editObj ? editObj.id : -1} />
                  : undefined}
              </Row>
          </div>
        </div>
      </Container>
    </>
  )
}

export default App
