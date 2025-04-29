import { Col, Container, Row, Button, Form, Table, Navbar } from 'react-bootstrap';

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
        <Button className="mx-1" variant="warning" onClick={()=>props.edit(e.id)}><i className="bi bi-pencil"></i></Button>
        <Button className="mx-1" variant="danger" onClick={() => props.delete(e.id)}><i className="bi bi-trash"></i></Button>
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
          <FilmRow key={e.id} film={e} delete={props.delete} edit={props.edit} />)
        }

      </tbody>
    </Table>
  )
}
export { MyTable }  