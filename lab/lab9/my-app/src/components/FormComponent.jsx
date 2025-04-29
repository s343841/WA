import { useState } from 'react';
import { Alert, Button, Form,} from 'react-bootstrap';

import dayjs from 'dayjs';

function FilmForm(props) {

    const [Title, setTitle ] = useState(props.editObj? props.editObj.title : '');
    let initialDate = dayjs().format('YYYY-MM-DD');
    if (props.editObj && props.editObj.date)
      initialDate = props.editObj.date.format('YYYY-MM-DD');
    
    const [date, setDate] = useState(initialDate);
    
    const [score, setScore] = useState(props.editObj ? props.editObj.rating : 0);
    const [Favourite, setFavourite] = useState(props.editObj? props.editObj.favourite : false);

    const [errorMsg, setErrorMsg ] = useState('');


    function handleSubmit(event) {
        event.preventDefault();
        //console.log('Submit was clicked');
        // Form validation
        if (!Title) {
        setErrorMsg("Title field is empty");
        }
        //else if (date === '')
          //  setErrorMsg('Invalid date');
        else if (isNaN(parseInt(score) || parseInt(score)>5))
            setErrorMsg('Invalid score');
        else if (parseInt(score) < 0) {
            setErrorMsg('Negative scores are invalid');
        } else if(!typeof Favourite == 'Boolean'){
            setErrorMsg("Invalid Favourite input");
        }
            else{

            const film = {
                title: Title,
                rating: parseInt(score),
                favourite: Favourite? 1:0,
                date: date ? dayjs(date) : null
            }

            if(props.editObj) {  // decide if this is an edit or an add
                film.id = props.editObj.id;
                props.saveExistingFilm(film);
            } else
                props.addFilm(film);
        }
    }

    function handleScore(event) {
        setScore(event.target.value); // NOTE: Cannot do parseInt here otherwise the single minus sign cannot be written
    }

    return (
        <>
        {errorMsg? <Alert variant='danger'  dismissible onClose={()=>{setErrorMsg('')}} >{errorMsg}</Alert> : false}
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={date} onChange={(event) => {
                    setDate(event.target.value); }} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="Title" value={Title}
                    onChange={(event) => setTitle(event.target.value)} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Favourite</Form.Label>
                <Form.Check  type="checkbox" name="Favourite" value={Favourite} onChange={(e) => setFavourite(e.target.checked)} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Score</Form.Label>
                <Form.Control type="number" name="score" value={score} onChange={handleScore} />
            </Form.Group>

            <Button type="submit">{props.editObj? 'Save edit':'Add'}</Button>
            <Button variant='secondary' onClick={()=>props.closeForm()}>Cancel</Button>

        </Form>
        </>
    )
}

export { FilmForm };