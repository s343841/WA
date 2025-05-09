import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function FilmRow(props) {
  const e = props.film;

  const stars = [];


  const handleFavoriteClick = () => {
    const updatedFilm = {
      ...e,
      favourite: e.favourite === 1 ? 0 : 1
    };
    props.saveFilm(updatedFilm);
  };

  const handleStarClick = (newRating) => {
    const updatedFilm = {
      ...e,
      rating: newRating
    };
    props.saveFilm(updatedFilm);
  };

  for (let i = 0; i < 5; i++) {
    const starValue = i + 1;
    stars.push(
      <i
        key={`star-${i}`}
        className={`bi bi-star${i < e.rating ? '-fill' : ''}`}
        onClick={() => handleStarClick(starValue)}
        style={{ cursor: 'pointer' }}
      />
    );
  }

  return (
    <tr>
      <td>{e.title}</td>
      <td
        onClick={handleFavoriteClick}
        style={{ cursor: 'pointer' }}
      >
        {e.favourite === 1 ? (
          <i className="bi bi-check-square-fill"></i>
        ) : (
          <i className="bi bi-square"></i>
        )}
      </td>
      <td>{e.date ? e.date.format('YYYY-MM-DD') : ''}</td>
      <td>{stars}</td>
      <td>
        <Link to={`/edit/${e.id}`}>
          <Button className="mx-1" variant="warning">
            <i className="bi bi-pencil"></i>
          </Button>
        </Link>
        <Button
          className="mx-1"
          variant="danger"
          onClick={() => props.delete(e.id)}
        >
          <i className="bi bi-trash"></i>
        </Button>
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
          <FilmRow key={e.id} film={e} delete={props.delete} edit={props.edit}
           saveFilm={props.updateFilm} />)
        }

      </tbody>
    </Table>
  )
}
export { MyTable }  