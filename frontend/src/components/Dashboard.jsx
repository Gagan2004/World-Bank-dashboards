import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css'; // Import the new CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [yearRange, setYearRange] = useState({ min_year: 1960, max_year: 2025 });
  
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/filter-options/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const countryOptions = response.data.countries.map(c => ({ value: c, label: c }));
        setCountries(countryOptions);
        setYearRange(response.data.year_range);
        
        // Set initial state after options are loaded
        setStartYear(response.data.year_range.min_year || 1900);
        setEndYear(response.data.year_range.max_year || 2020);
        
        // Pre-select some countries for initial view
        const initialCountries = countryOptions.filter(c => ['United States', 'Brazil', 'India', 'China'].includes(c.value));
        setSelectedCountries(initialCountries);

      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCountries.length === 0 || !startYear || !endYear) {
          setData([]); // Clear data if filters are not set
          return;
      }
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          start_year: startYear,
          end_year: endYear,
        });
        selectedCountries.forEach(c => params.append('countries[]', c.value));

        const response = await axios.get('/api/world-data/', {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [selectedCountries, startYear, endYear]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const yearOptions = () => {
    if (!yearRange.min_year) return [];
    const years = [];
    for (let i = yearRange.min_year; i <= yearRange.max_year; i++) {
      years.push({ value: i, label: i });
    }
    return years;
  };

  const lineChartData = {
    labels: [...new Set(data.map((item) => item.year))].sort((a, b) => a - b),
    datasets: selectedCountries.map((country) => {
        const countryData = data.filter(item => item.country === country.value).sort((a, b) => a.year - b.year);
        return {
            label: country.label,
            data: countryData.map((item) => item.primary_completion_rate),
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.1
        };
    }),
  };

  const barChartData = {
    labels: selectedCountries.map(c => c.label),
    datasets: [{
        label: 'Average Primary Completion Rate',
        data: selectedCountries.map(country => {
            const countryData = data.filter(item => item.country === country.value);
            const sum = countryData.reduce((acc, item) => acc + (item.primary_completion_rate || 0), 0);
            return countryData.length > 0 ? sum / countryData.length : 0;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
    }],
  };

  const NoDataComponent = () => (
    <div className="no-data-message">
      <p>No data to display for the selected filters.</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>World Data Primary Completion Rate Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="filters-panel">
        <Select
          options={countries}
          isMulti
          onChange={setSelectedCountries}
          value={selectedCountries}
          placeholder="Select Countries..."
          styles={{ container: (base) => ({ ...base, width: '400px' }) }}
        />
        <Select
          options={yearOptions()}
          onChange={opt => setStartYear(opt.value)}
          value={startYear ? { value: startYear, label: startYear } : null}
          placeholder="Start Year"
          styles={{ container: (base) => ({ ...base, width: '150px' }) }}
        />
        <Select
          options={yearOptions()}
          onChange={opt => setEndYear(opt.value)}
          value={endYear ? { value: endYear, label: endYear } : null}
          placeholder="End Year"
          styles={{ container: (base) => ({ ...base, width: '150px' }) }}
        />
      </div>

      <main className="charts-grid">
        <div className="chart-card">
          <h2>Primary Completion Rate Over Time</h2>
          {data.length > 0 ? <Line data={lineChartData} /> : <NoDataComponent />}
        </div>
        <div className="chart-card">
          <h2>Average Primary Completion Rate Comparison</h2>
          {data.length > 0 ? <Bar data={barChartData} /> : <NoDataComponent />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
