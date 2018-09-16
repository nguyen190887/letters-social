import React, { Component } from "react";
import ProptTypes from "prop-types";
import classnames from 'classnames';
import LocationTypeAhead from "../map/LocationTypeAhead";
import DisplayMap from "../map/DisplayMap";
import Filter from 'bad-words';

class CreatePost extends Component {
    static propTypes = {
        onSubmit: ProptTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.initialState = {
            content: '',
            valid: false,
            showLocationPicker: false,
            location: {
                lat: 34.1535641,
                lng: 118.1428115,
                name: null
            },
            locationSelected: false
        };

        this.state = this.initialState;
        this.filter = new Filter();
    }

    handleSubmit = event => {
        if (!this.state.valid) return;
        const newPost = {
            content: this.state.content
        };
        if (this.state.locationSelected) {
            newPost.location = this.state.location;
        }
        this.props.onSubmit(newPost);
        this.setState(() => ({
            content: '',
            valid: false,
            showLocationPicker: false,
            location: this.initialState.location,
            locationSelected: false
        }));
    };

    handlePostChange = (e) => {
        const content = this.filter.clean(e.target.value);
        this.setState({
            content,
            valid: content.length <= 280
        });
    };

    handleRemoveLocation = event => {
        this.setState({
            locationSelected: false,
            location: this.initialState.location
        });
    };

    handleToggleLocation = (e) => {
        e.preventDefault();
        this.setState({
            showLocationPicker: !this.state.showLocationPicker
        });
    };

    onLocationSelect = (location) => {
        this.setState({
            location,
            showLocationPicker: false,
            locationSelected: true
        });
    };

    onLocationUpdate = (location) => {
        this.setState({location});
    };

    renderLocationControls = () => {
        return (
            <div className="controls">
                <button onClick={this.handleSubmit} disabled={!this.state.valid}>Post</button>
                {this.state.location && this.state.locationSelected ? (
                    <button onClick={this.handleRemoveLocation} className="open location-indicator">
                        <i className="fa-location-arrow fa" />
                        <small>{this.state.location.name}</small>
                    </button>
                ) : (
                    <button onClick={this.handleToggleLocation} className="open">
                        {this.state.showLocationPicker ? 'Cancel' : 'Add location'}{' '}
                        <i className={classnames(`fa`, {
                            'fa-map-o': !this.state.showLocationPicker,
                            'fa-times': this.state.showLocationPicker
                            })}
                        />
                    </button>
                )}
            </div>
        );
    }
    render() {
        return (
            <div className="create-post">
                <textarea
                    value={this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?"
                />
                {this.renderLocationControls()}
                <div
                    className="location-picker"
                    style={{display: this.state.showLocationPicker ? 'block' : 'none'}}
                >
                    {!this.state.locationSelected && [
                        <LocationTypeAhead
                            key="LocationTypeAhead"
                            onLocationSelect={this.onLocationSelect}
                            onLocationUpdate={this.onLocationUpdate}
                        />,
                        <DisplayMap
                            key="DisplayMap"
                            displayOnly={false}
                            location={this.state.location}
                            onLocationSelect={this.onLocationSelect}
                            onLocationUpdate={this.onLocationUpdate}
                        />
                    ]}
                </div>
            </div>
        );
    }
}

export default CreatePost;
