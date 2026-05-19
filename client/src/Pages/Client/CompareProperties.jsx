import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CompareProperties.css';

const API_BASE = 'http://localhost:4000';

function CompareProperties() {
  const { idA, idB } = useParams();
  const navigate = useNavigate();
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComparison = async () => {
      if (!idA || !idB) {
        setError('Two property IDs are required for comparison.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/property/compare/${idA}/${idB}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Unable to load property comparison.');
        } else {
          setCompareData(data.data);
        }
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [idA, idB]);

  const formatValue = (value, label) => {
    if (Array.isArray(value)) {
      return value.length ? (
        <div className="amenity-list">
          {value.map((item) => (
            <span key={item} className="amenity-tag">{item}</span>
          ))}
        </div>
      ) : (
        <span className="value-empty">None</span>
      );
    }

    if (value === null || value === undefined || value === '') {
      return <span className="value-empty">Not specified</span>;
    }

    if (label === 'Price' && typeof value === 'number') {
      return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
      }).format(value);
    }

    return value;
  };

  const renderComparisonRows = () => {
    return compareData.comparison.map((row) => (
      <tr key={row.field} className={row.isDifferent ? 'row-different' : 'row-same'}>
        <td>{row.label}</td>
        <td>{formatValue(row.propertyA, row.label)}</td>
        <td>{formatValue(row.propertyB, row.label)}</td>
      </tr>
    ));
  };

  if (loading) {
    return (
      <div className="compare-page">
        <div className="compare-loading">Loading comparison...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compare-page">
        <div className="compare-error">{error}</div>
        <button className="return-btn" onClick={() => navigate('/')}>Back to search</button>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <header className="compare-header">
        <div className="compare-heading-group">
          <h1>Property Comparison</h1>
          <p>Compare two selected properties side by side to make a better decision.</p>
        </div>
        <button className="return-btn" onClick={() => navigate('/')}>Back to search</button>
      </header>

      <section className="compare-summary">
        <div className="summary-card">
          <span className="summary-label">Property A</span>
          <strong>{compareData.propertyA.name}</strong>
        </div>
        <div className="summary-card highlight-card">
          <span className="summary-label">Differences</span>
          <strong>{compareData.totalDifferences}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Property B</span>
          <strong>{compareData.propertyB.name}</strong>
        </div>
      </section>

      <section className="compare-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>{compareData.propertyA.name}</th>
              <th>{compareData.propertyB.name}</th>
            </tr>
          </thead>
          <tbody>{renderComparisonRows()}</tbody>
        </table>
      </section>
    </div>
  );
}

export default CompareProperties;
