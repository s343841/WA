import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row, Button, Form, Table, Navbar, Spinner } from 'react-bootstrap';
import './App.css';
import { MyAside } from './components/AsideComponent.jsx'
import { Film, filterFilms } from './app.js';
import { useState, useEffect } from 'react';
import { NotFoundLayout, GenericLayout, TableLayout, AddLayout, EditLayout } from './components/layout.jsx';
import { Routes, Route, Outlet, Link, BrowserRouter } from 'react-router';
import API from './components/API.js'
import { LoginForm } from './components/AuthComponent.jsx';
import { Navigate } from 'react-router';



function MyNav(props) {
  const name = props.user && props.user.name;
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

          {name ? (
            <>
              <Navbar.Text className='fs-5 text-light'>
                {"Signed in as: " + name}
              </Navbar.Text>
              <Button className='mx-2' variant='danger' onClick={props.logout}>Logout</Button>
              <i className="bi bi-person-circle fs-3" style={{ color: 'white' }}></i>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button className='mx-2' variant='warning'>Login</Button>
              </Link>
              <i className="bi bi-person-circle fs-3"></i>
            </>
          )}
        </div>
      </div>
    </Navbar >
  )
}

function RequireAuth({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App(props) {
  const [activeFilter, setActiveFilter] = useState('filter-all');
  const [listOfFilms, setListOfFilms] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [dirty, setDirty] = useState(true);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Fetching films...");
    API.getAllFilm()
      .then(e => {
        setListOfFilms(e);
        setWaiting(false)
      });
  }, []);
  useEffect(() => {
    setWaiting(true);
    filters[activeFilter].filterFunction()
      .then(filteredFilms => {
        setListOfFilms(Array.isArray(filteredFilms) ? filteredFilms : []);
        setWaiting(false);
        setDirty(false);
      })
      .catch(error => {
        console.error("Error fetching filtered films:", error);
        setListOfFilms([]);
        setWaiting(false);
        setDirty(false);
      });
  }, [activeFilter, dirty]);

  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
      else if (err.error)
        errMsg = err.error;

    setErrorMsg(errMsg);

    setTimeout(() => setDirty(true), 2000);  // Fetch the current version from server, after a while
  }


  const filters = {
    'filter-all': { label: 'all', id: 'filter-all', filterFunction: () => filterFilms(listOfFilms, 'All') },
    'filter-favorite': { label: 'fav', id: 'filter-favorite', filterFunction: () => filterFilms(listOfFilms, 'Favourite') },
    'filter-best': { label: 'best', id: 'filter-best', filterFunction: () => filterFilms(listOfFilms, 'Best Rated') },
    'filter-lastmonth': { label: 'lastMonth', id: 'filter-lastmonth', filterFunction: () => filterFilms(listOfFilms, 'Seen last month') },
    'filter-unseen': { label: 'unseen', id: 'filter-unseen', filterFunction: () => filterFilms(listOfFilms, 'Unseen') }
  };

  function deleteFilm(id) {
    setListOfFilms(listOfFilms =>
      listOfFilms.map(e => e.id === id ? Object.assign({}, e, { status: 'deleted' }) : e)
    );

    API.deleteFilm(id)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function addFilm(film) {

    setListOfFilms(
      listOfFilms => {
        film.status = 'added';
        return [...listOfFilms, film];
      }
    );
    API.addFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }


  function saveExistingFilm(film) {
    setListOfFilms(listOfFilms =>
      listOfFilms.map(e => e.id === film.id ? { ...film, status: 'updated' } : e)
    );
    API.updateFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));

  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    // setDirty ... ?
    /* set state to empty if appropriate */
  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);  // load latest version of data, if appropriate
  }



  return (
    <Routes>
      <Route path="/" element={waiting ?
        <Row><Col><Spinner /></Col></Row>
        : <GenericLayout
          activeFilter={activeFilter} setActiveFilter={setActiveFilter} MyNav={MyNav} MyAside={MyAside} user={user}
          logout={doLogOut} setWaiting={setWaiting} />} >
        <Route index element={waiting ?
          <Row><Col><Spinner /></Col></Row>
          : <TableLayout
            filters={filters} deleteFilm={deleteFilm}
            listOfFilms={listOfFilms} activeFilter={activeFilter} saveExistingFilm={saveExistingFilm} />} />

        <Route path="add" element={
          <RequireAuth loggedIn={loggedIn}>
            {waiting ? <Row><Col><Spinner /></Col></Row>
              : <AddLayout addFilm={addFilm} />}
          </RequireAuth>} />
        <Route path="edit/:filmId" element={
          <RequireAuth loggedIn={loggedIn}>
            {waiting ? <Row><Col><Spinner /></Col></Row> : <EditLayout listOfFilms={listOfFilms} saveExistingFilm={saveExistingFilm} />}
          </RequireAuth>} />
        <Route path="filter/:filterId" element={waiting ?
          <Row><Col><Spinner /></Col></Row>
          : <TableLayout
            listOfFilms={listOfFilms} activeFilter={activeFilter} filters={filters} deleteFilm={deleteFilm}
            saveExistingFilm={saveExistingFilm} />} />
      </Route>
      <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm loginSuccessful={loginSuccessful} />} />
      <Route path="*" element={<NotFoundLayout />} />
    </Routes>
  )
}

export default App
