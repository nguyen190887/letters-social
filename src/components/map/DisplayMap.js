import React, { Component } from "react";
import PropTypes from 'prop-types';

export default class DisplayMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapLoaded: false,
            location: {
                lat: props.location.lat,
                lng: props.location.lng,
                name: props.location.name
            }
        };
    }
    static propTypes = {
        location: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
            name: PropTypes.string
        }),
        displayOnly: PropTypes.bool
    }
    static defaultProps = {
        displayOnly: true,
        location: {
            lat: 34.1535641,
            lng: -118.1428115,
            name: null
        }
    }
    componentDidMount() {
        this.L = window.L;
        if (this.state.location.lng && this.state.location.lat) {
            this.ensureMapExists();
        }
    }
    ensureMapExists = () => {
        if (this.state.mapLoaded) return;
        this.map = this.L.mapbox.map(this.mapNode, "mapbox.streets", {
            zoomControl: false,
            scrollWheelZoom: false
        });
        const { lat, lng } = this.state.location;
        this.map.setView(this.L.latLng(lat, lng), 12);
        this.setState({ mapLoaded: true });
    }
    generateStaticMapImage = (lat, lng) => {
        return `https://api.mapbox.com/styles/v1/mapbox/streets­ v10/static/${lat},${lng},12,0,0/600x175?access_token=${process.env.MAPBOX_API_TOKEN}`;
    }
    render() {
        return [
            <div key="displayMap" className="displayMap">
                <div
                    className="map"
                    ref={node => {
                        this.mapNode = node;
                    }}
                />
                {!this.state.mapLoaded && (
                    <img
                        className="map"
                        src={this.generateStaticMapImage(
                            this.state.location.lat,
                            this.state.location.lng
                        )}
                        alt={this.state.location.name}
                    />
                )}
            </div>,
            this.props.displayOnly && (
                <div
                    key="localtion-description"
                    className="location-description"
                >
                    <i className="location-icon fa fa-location-arrow" />
                    <span className="location-name">
                        {this.state.location.name}
                    </span>
                </div>
            )
        ];
    }
}
