import { Component, h } from "preact";
import classNames from 'classnames';

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
            const selected = this.state.selected === link;

            const className = classNames({
                [`nav-link nav-link-${link}`]: true,
                selected: selected && !this.state.hidden,
            });

            const onActivate = () => this.setState({
                selected: link,
                hidden: !this.state.hidden && selected
            });

            return <li key={link} className={className} onMouseDown={onActivate}>
                <a>{link}</a>
            </li>;
        });

        return <div className="navbar-outer">
            <div className="nav-links-outer">
                <ul className="nav-links">
                    {navLinks}
                </ul>
            </div>
            <NavBox selected={this.state.selected} hidden={this.state.hidden} />
        </div>;
    }
}

