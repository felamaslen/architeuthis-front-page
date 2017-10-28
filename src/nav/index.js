import { Component, h } from "preact";

import NavBox from './nav-box';

export default class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            hidden: true
        };
    }
    render() {
        const links = ['specs', 'services', 'ups'];

        const navLinks = links.map(link => {
            const className = `nav-link nav-link-${link}`;
            const onActivate = () => this.setState({
                selected: link,
                hidden: !this.state.hidden && this.state.selected === link
            });

            return <li key={link} className={className} onMouseDown={onActivate}>
                <a>{link}</a>
            </li>;
        });

        return <div className="navbar-outer">
            <ul className="nav-links">
                {navLinks}
            </ul>
            <NavBox selected={this.state.selected} hidden={this.state.hidden} />
        </div>;
    }
}

