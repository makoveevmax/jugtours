import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';


class GroupEdit extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };


    emptyItem = {
        name: '',
        address: '',
        city: '',
        stateOrProvince: '',
        country: '',
        eve: '',
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN')
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            try {
                const group = await (await fetch(`/api/group/${this.props.match.params.id}`, {credentials: 'include'})).json();
                this.setState({item: group});
            } catch (error) {
                this.props.history.push('/');
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        // eslint-disable-next-line
        const {item, csrfToken} = this.state;

        await fetch('/api/group', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include'
        });
        this.props.history.push('/groups');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Редактирование мероприятия' : 'Добавление мероприятия'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Наименование</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Адрес</Label>
                        <Input type="text" name="address" id="address" value={item.address || ''}
                               onChange={this.handleChange} autoComplete="address-level1"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">Город</Label>
                        <Input type="text" name="city" id="city" value={item.city || ''}
                               onChange={this.handleChange} autoComplete="address-level1"/>
                    </FormGroup>
                    <div className="row">
                        <FormGroup className="col-md-3 mb-3">
                            <Label for="stateOrProvince">Регион/Область</Label>
                            <Input type="text" name="stateOrProvince" id="stateOrProvince" value={item.stateOrProvince || ''}
                                   onChange={this.handleChange} autoComplete="address-level1"/>
                        </FormGroup>
                        <FormGroup className="col-md-2 mb-3">
                            <Label for="country">Страна</Label>
                            <Input type="text" name="country" id="country" value={item.country || ''}
                                   onChange={this.handleChange} autoComplete="address-level1"/>
                        </FormGroup>
                        <FormGroup className="col-md-7 mb-3">
                            <Label for="country">Комментарий</Label>
                            <Input type="text" name="eve" id="eve" value={item.eve || ''}
                                   onChange={this.handleChange} autoComplete="address-level1"/>
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Button outline color="primary" type="submit">Сохранить</Button>{' '}
                        <Button outline color="secondary" tag={Link} to="/groups">Отмена</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withCookies(withRouter(GroupEdit));