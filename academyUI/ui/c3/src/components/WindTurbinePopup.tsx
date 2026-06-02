import React from 'react';
import { Popup } from 'react-leaflet';
import { WindTurbine } from '@c3/types';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';

interface WindTurbinePopupProps {
  turbine: WindTurbine;
}

const WindTurbinePopup = ({ turbine }: WindTurbinePopupProps) => {

  const dispatch = useDispatch();

  const handleViewDetails = (turbine: WindTurbine) => {
    dispatch({
      type: 'GLOBAL_REDIRECT',
      payload: {
        url: `/windturbine/${turbine.id}`, // url with page param, passing the turbine id
      },
    });
  };

  return (
    <Popup>
      <div className="popup-content">
        <h3 className="popup-title">Wind Turbine {turbine.id}</h3>
        <div className="popup-section">
          <strong>Status:</strong>{' '}
          <span className={turbine.active ? 'popup-status-active' : 'popup-status-inactive'}>
            {turbine.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        {turbine.powerData && (
          <div className="popup-section">
            <strong>Power Output:</strong> {turbine.powerData} kW
          </div>
        )}
        {turbine.manufacturer && (
          <div className="popup-section">
            <strong>Manufacturer:</strong> {turbine.manufacturer}
          </div>
        )}
        <button
          onClick={() => handleViewDetails(turbine)}
          className="view-details-btn"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          View Details
        </button>
      </div>
    </Popup>
  );
};

export default WindTurbinePopup;
