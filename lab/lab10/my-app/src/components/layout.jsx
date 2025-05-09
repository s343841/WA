import { Row, Col, Button } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { MyTable } from './TableComponent.jsx'
import { FilmForm } from './FormComponent.jsx';


function NotFoundLayout() {
    return (
        <>
            <h2>This route is not valid!</h2>
            <Link to="/">
                <Button variant="primary">Go back to the main page!</Button>
            </Link>
        </>
    );
}

function AddLayout(props) {
    return (
        <FilmForm addFilm={props.addFilm} />
    );
}

function EditLayout(props) {
    return (
        <FilmForm listOfFilms={props.listOfFilms}
        saveExistingFilm={props.saveExistingFilm} />
    );
}


function TableLayout(props) {
    return (
        <>
            <Row >
                <div className="col-11">All</div>
                <div className="col-1">
                    <Link to="/add">
                        <button type="button" className="btn btn-primary" >+</button>
                    </Link>
                </div>
            </Row>

            <MyTable listOfFilms={props.filters[props.activeFilter].filterFunction()}
            updateFilm={props.saveExistingFilm} edit={props.editFilm} delete={props.deleteFilm}></MyTable>
        </>
    )
}

function GenericLayout(props) {

    return (
        <>
            <props.MyNav></props.MyNav>
            <Container className="container m-0">
                <div className="row justify-content-start">
                    <props.MyAside activeFilter={props.activeFilter} setActiveFilter={props.setActiveFilter}></props.MyAside>
                    <div className="col-8">
                        <Outlet></Outlet>
                    </div>
                </div>
            </Container>
        </>
    )
}



export { NotFoundLayout, GenericLayout, TableLayout, AddLayout,EditLayout };