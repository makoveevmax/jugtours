import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';


class GroupList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };


    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {groups: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/groups', {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({groups: data, isLoading: false}))
            .catch(() => this.props.history.push('/'));
    }

    async remove(id) {
        await fetch(`/api/group/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
            this.setState({groups: updatedGroups});
        });
    }

    render() {
        const {groups, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const groupList = groups.map(group => {
            const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvince || ''}`;
            const events =`${group.eve || ''}`;
            return <tr key={group.id}>
                <td style={{whiteSpace: 'nowrap'}}>{group.name}</td>
                <td>{address}</td>
                <td>{events}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="warning" tag={Link} to={"/groups/" + group.id}>Редактировать</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(group.id)}>Удалить</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/groups/new">Добавить мероприятие</Button>
                    </div>
                    <h3>Мои мероприятия</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Название</th>
                            <th width="20%">Место проведения</th>
                            <th width="20%">Комментарий</th>
                            <th width="10%">Управление</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(GroupList));