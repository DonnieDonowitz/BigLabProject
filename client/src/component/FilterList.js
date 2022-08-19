import { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink, useLocation} from 'react-router-dom';

function FilterList(props) {

    const location = useLocation();

    useEffect(() => {
        const filter = location.pathname.split("/")[1];
        props.changeActiveFilter(filter);
    }, []);

    const chooseFilter = (filterLabel) => {
        props.changeActiveFilter(filterLabel);
    }


    const listItems = props.filters.map((filter, i) =>
        <ListGroup.Item as="li" key={filter.id} className='link-list-item'
            onClick={() => chooseFilter(filter.label)}>
            <NavLink
                to={{
                    pathname: '/' + filter.label,
                    state: { filterID: filter.id }
                }} className='router-link' activeClassName="custom-active-class">
                {filter.label}
            </NavLink>
        </ListGroup.Item>
    );

    return (
        <ListGroup className={props.show ? "collapse show" : "collapse d-none d-sm-block"} variant="flush" as="ul"> {listItems} </ListGroup>
    );
}

export default FilterList;